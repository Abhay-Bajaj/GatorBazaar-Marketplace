import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { mockConversations } from "./data/mockConversations";
import NavigationSearchBar from "./components/NavigationSearchBar";
import LoginModal from "./components/LoginModal";
import "./inbox.css";

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
        const res = await fetch("/api/conversations");
        if (!res.ok) throw new Error(`Server error (${res.status})`);
        const data = await res.json();
        setConversations(data);
        setSelectedConversation(data[0] || null);
      } catch (err) {
        console.error(err);
        setConversations(mockConversations);
        setSelectedConversation(mockConversations[0] || null);
      } finally {
        setLoading(false);
      }
    }
    fetchConversations();
  }, []);

  const handleSendMessage = () => {
    if (newMessage.trim() && selectedConversation) {
      const updatedConversations = conversations.map((conv) => {
        if (conv.id === selectedConversation.id) {
          const newMsg = {
            id: conv.messages.length + 1,
            sender: "buyer",
            text: newMessage,
            timestamp: new Date().toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            }),
          };
          return {
            ...conv,
            messages: [...conv.messages, newMsg],
            lastMessage: newMessage,
          };
        }
        return conv;
      });
      const updated = updatedConversations.find(
        (c) => c.id === selectedConversation.id,
      );
      setConversations(updatedConversations);
      setSelectedConversation(updated);
      setNewMessage("");
    }
  };

  const handleSelectedConversation = (conversation) => {
    setSelectedConversation(conversation);
    setConversations((prev) =>
      prev.map((conv) =>
        conv.id === conversation.id ? { ...conv, read: true } : conv,
      ),
    );
  };

  const handleSearch = (e) => {
    e.preventDefault();
    navigate(`/search?q=${encodeURIComponent(query.trim())}`);
  };

  return (
    <>
    <NavigationSearchBar
        query={query}
        onQueryChange={setQuery}
        onSearch={handleSearch}
        onSellClick={() => navigate('/create-listing')}
        onMessagesClick={() => navigate('/inbox')}
        onProfileClick={() => setLoginModalOpen(true)}
        onFavoritesClick={() => navigate("/favorite")}
      />
    <section className="banner-inbox">

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
                    key={conversation.id}
                    className={`conversation-card ${selectedConversation?.id === conversation.id ? "active" : ""}`}
                    onClick={() => handleSelectedConversation(conversation)}
                  >
                    <img
                      src={conversation.itemImage}
                      alt={conversation.itemName}
                      className="conversation-item-image"
                    />
                    <div className="conversation-info">
                      <div className="conversation-name-row">
                        <p className="conversation-item-name">
                          {conversation.itemName}
                        </p>
                        {!conversation.read && <span className="unread-dot" />}
                      </div>
                      <p className="conversation-last-message">
                        {conversation.lastMessage}
                      </p>
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
                  {selectedConversation.messages.map((message) => (
                    <div
                      key={message.id}
                      className={`message ${message.sender}`}
                    >
                      <p className="message-text">{message.text}</p>
                      <p className="message-time">{message.timestamp}</p>
                    </div>
                  ))}
                </div>

                <div className="message-input-area">
                  <input
                    type="text"
                    placeholder="Type your message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
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
    </>
  );
}
