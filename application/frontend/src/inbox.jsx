import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import NavigationSearchBar from "./components/NavigationSearchBar";
import LoginModal from "./components/LoginModal";
import useAuthStatus from "./hooks/useAuthStatus"
import useAccountNavigation from "./hooks/useAccountNavigation"

import {
  getConversations,
  sendMessage,
  markConversationRead,
} from "./api/messagesAPI";

export default function Inbox() {
  const { isSignedIn } = useAuthStatus()
  const navigate = useNavigate();
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [query, setQuery] = useState("");
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const { handleAccountClick } = useAccountNavigation({ isSignedIn, setLoginModalOpen })
  const [sending, setSending] = useState(false);


  useEffect(() => {
    async function load() {
      setLoading(true);
      setError(null);

      if (!isSignedIn) {
        setConversations([]);
        setSelectedConversation(null);
        setLoading(false);
        return;
      }

      try {
        const { unauthorized, conversations: data } = await getConversations();
        if (unauthorized) {
          setConversations([]);
          setSelectedConversation(null);
          return;
        }
        setConversations(data);
        setSelectedConversation(data[0] || null);
      } catch (err) {
        console.error(err);
        setError("Could not load conversations. Is the backend running?");
        setConversations([]);
        setSelectedConversation(null);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedConversation || sending) return;

    setSending(true);
    try {
      const created = await sendMessage(
        selectedConversation.id,
        newMessage.trim(),
      );

      if (created.unauthorized) {
        setLoginModalOpen(true);
        return;
      }

      const updatedConversations = conversations.map((conv) => {
        if (conv.id !== selectedConversation.id) return conv;
        return {
          ...conv,
          messages: [...conv.messages, created],
          lastMessage: newMessage.trim(),
        };
      });

      const updated = updatedConversations.find(
        (c) => c.id === selectedConversation.id,
      );
      setConversations(updatedConversations);
      setSelectedConversation(updated);
      setNewMessage("");
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to send message");
    } finally {
      setSending(false);
    }
  };

  const handleSelectedConversation = async (conversation) => {
    setSelectedConversation(conversation);
    setConversations((prev) =>
      prev.map((conv) =>
        conv.id === conversation.id ? { ...conv, read: true } : conv,
      ),
    );
    try {
      await markConversationRead(conversation.id);
    } catch (err) {
      console.error(err);
    }
  };

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
        onProfileClick={handleAccountClick}
        onFavoritesClick={() => navigate("/favorites")}
      />

      <button className="back-button" type="button" onClick={() => navigate(-1)}>
        ← Back
      </button>

      {loading && (
        <div className="search-loading">
          <span className="search-spinner" />
          Loading messages…
        </div>
      )}

      {error && <p className="search-error">⚠ {error}</p>}

      {!loading && (
        <div className="inbox-grid">
          <div className="inbox-messages">
            <h2>Messages</h2>
            {!isSignedIn || conversations.length === 0 ? (
              <div className="inbox-no-messages">
                <p>{isSignedIn ? "No messages" : "Sign in to view messages"}</p>
              </div>
            ) : (
              <div className="conversations-list">
                {conversations.map((conversation) => (
                  <div
                    key={conversation.id}
                    className={`conversation-card ${selectedConversation?.id === conversation.id ? "active" : ""}`}
                    onClick={() => handleSelectedConversation(conversation)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSelectedConversation(conversation)}
                    role="button"
                    tabIndex={0}
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
                  type="button"
                  onClick={() => setLoginModalOpen(true)}
                >
                  Register/Sign-in
                </button>
              </div>
            ) : conversations.length === 0 ? (
              <div className="inbox-no-conversations-state">
                <p>Message sellers from a listing page to start chatting</p>
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
                    onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                    className="message-input"
                  />
                  <button
                    type="button"
                    onClick={handleSendMessage}
                    className="message-send-button"
                    disabled={sending}
                  >
                    {sending ? "Sending…" : "Send"}
                  </button>
                </div>
              </>
            ) : (
              <div className="inbox-empty-state">
                <p>Select a chat to view messages</p>
              </div>
            )}
          </div>
        </div>
      )}
      {loginModalOpen && <LoginModal onClose={() => setLoginModalOpen(false)} />}
    </section>
  );
}
