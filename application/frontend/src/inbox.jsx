import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { mockConversations } from "./data/mockConversations";
import NavigationSearchBar from "./components/NavigationSearchBar";
import LoginModal from "./components/LoginModal";

export default function Inbox() {
  const navigate = useNavigate();
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSignedIn, setIsSignedIn] = useState(true);
  const [query, setQuery] = useState("");
  const [loginModalOpen, setLoginModalOpen] = useState(false);

  useEffect(() => {
    async function fetchConversations() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch('/api/messages', {
          credentials:'include'
        })
        if (!res.ok) throw new Error(`Server error (${res.status})`)
        const data = await res.json();
        
        setConversations(data);
      } catch (err) {
        console.error(err);
        console.error('fetch failed:', err);
        setConversations(mockConversations);
        setSelectedConversation(mockConversations[0] || null);
      } finally {
        setLoading(false);
      }
    }
    fetchConversations();
  }, []);

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedConversation) return
    try {
      const res = await fetch(`/api/messages/${selectedConversation.conversation_id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({
          message_content: newMessage.trim()
        })
      })

      if (!res.ok) throw new Error(`Server error (${res.status})`)

      const data = await res.json()
      await handleSelectedConversation(selectedConversation)

      setNewMessage('')
    } catch (err) {
      console.error('fetch failed:', err)
      console.error(err)
      setError(err.message)
    }
  }
  const handleSelectedConversation = async (conversation) =>{
    try {
      const res = await fetch(`/api/messages/${conversation.conversation_id}`, {
        credentials: 'include'
      })

      if (!res.ok) throw new Error(`Server error (${res.status})`)

      const messages = await res.json()

      setSelectedConversation({
        ...conversation,
        messages
      })
    } catch (err) {
      console.error(err)
      setError(err.message)
    }
  }
  const handleSearch = (e) => {
    e.preventDefault();
    navigate(`/search?q=${encodeURIComponent(query.trim())}`);
  };

  return (
    <section className="banner inbox">
      <NavigationSearchBar
        query={query}
        onQueryChange={setQuery}
        onSearch={handleSearch}
        onSellClick={() => navigate('/create-listing')}
        onMessagesClick={() => navigate('/inbox')}
        onProfileClick={() => setLoginModalOpen(true)}
        onFavoritesClick={() => navigate("/favorites")}
      />

      <button className="back-button" onClick={() => navigate(-1)}>
        ← Back
      </button>

      {loading && (
        <div className="search-loading">
          <span className="search-spinner" />
          Loading messages…
        </div>
      )}

      {error && <p className="search-error">⚠ Error loading conversations</p>}

      {!loading && !error && (
        <div className="inbox-grid">
          <div className="inbox-messages">
            <h2>Messages</h2>
            {!isSignedIn || conversations.length === 0 ? (
              <div className="inbox-no-messages">
                <p>No messages</p>
              </div>
            ) : (
              <div className="conversations-list">
                {conversations.map((conversation) => (
                  <div
                    key={conversation.conversation_id}
                    className={`conversation-card ${selectedConversation?.conversation_id === conversation.conversation_id ? 'active' : ''}`}
                    onClick={() => handleSelectedConversation(conversation)}
                  >
                    <img
                      src={conversation.itemImage}
                      alt={conversation.itemName}
                      className="conversation-item-image"
                    />
                    <div className="conversation-info">
                      <p className="conversation-item-name">{conversation.itemName}</p>
                      <p className="conversation-last-message">{conversation.lastMessage}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="inbox-chat">
            {!isSignedIn ? (
              <div className="inbox-signin-state">
                <p>Please register/sign-in to view messages</p>
                <button
                  className="inbox-signin-button"
                  onClick={() => navigate("/auth")}
                >
                  Register/Sign-in
                </button>
              </div>
            ) : conversations.length === 0 ? (
              <div className="inbox-no-conversations-state">
                <p>Message Sellers to Start Chatting</p>
              </div>
            ) : selectedConversation ? (
              <>
                <div className="chat-header">
                  <img
                    src={selectedConversation.itemImage}
                    alt={selectedConversation.itemName}
                    className="chat-item-image"
                  />
                  <div className="chat-header-info">
                    <h3>{selectedConversation.itemName}</h3>
                    <p>{selectedConversation.sellerName}</p>
                    <p className="chat-price">{selectedConversation.price}</p>
                  </div>
                </div>

                <div className="messages-container">
                  {selectedConversation.messages.map(message => (
                    <div
                      key={message.message_id}
                      className={`message ${Number(message.sender_user_id) === Number(selectedConversation.seller_user_id) ? 'seller' : 'buyer'}`}
                    >
                      <p className="message-text">{message.body}</p>
                      <p className="message-time">
                        {new Date(message.created_at).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="message-input-area">
                  <input
                    type="text"
                    placeholder="Type your message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                    className="message-input"
                  />
                  <button
                    onClick={handleSendMessage}
                    className="message-send-button"
                  >
                    Send
                  </button>
                </div>
              </>
            ) : (
              <div className="inbox-empty-state">
                <p>Select a chat to message sellers</p>
              </div>
            )}
          </div>
        </div>
      )}
      {loginModalOpen && (
        <LoginModal onClose={() => setLoginModalOpen(false)} />
      )}
    </section>
  );
}
