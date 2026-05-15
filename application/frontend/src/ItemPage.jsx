import { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { mockItems } from "./data/mockItems";
import NavigationSearchBar from "./components/NavigationSearchBar";
import LoginModal from "./components/LoginModal";
import { addFavorite, removeFavorite } from './api/favoritesAPI'

export default function ItemPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFavorited, setIsFavorited] = useState(false);
  const [messageSent, setMessageSent] = useState(false);
  const [isSignedIn, setIsSignedIn] = useState(true); //test signed in state
  const [query, setQuery] = useState("");
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  async function handleToggleFavorite() {
    if (!item) return
    const nextIsFavorited = !isFavorited

    try {
      if (nextIsFavorited) {
        await addFavorite(item.listing_id)
      } else {
        await removeFavorite(item.listing_id)
      }
  
      setIsFavorited(nextIsFavorited)

    } catch (err) {
      console.log(err)
    }
  }

  const handleSendMessage = () => {
    setMessageSent(true);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    navigate(`/search?q=${encodeURIComponent(query.trim())}`);
  };

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`/api/items/${id}`, {
          credentials: 'include',
        })
        if (!res.ok) throw new Error(`Item not found (${res.status})`)
        const data = await res.json()
        setItem(data)
        setIsFavorited(data.isFavorited)
      } catch {
        const localItem = mockItems.find(
          (entry) => String(entry.id) === String(id),
        );
        if (localItem) {
          setItem(localItem);
        } else {
          setError("Item not found");
        }
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id]);

  if (loading) {
    return (
      <section className="banner item-detail">
        <div className="search-loading">
          <span className="search-spinner" />
          Loading item…
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="banner item-detail">
        <p className="search-error">⚠ {error}</p>
        <Link className="text-link" to="/search">
          ← Back to search
        </Link>
      </section>
    );
  }

  return (
    <>
      <NavigationSearchBar
        query={query}
        onQueryChange={setQuery}
        onSearch={handleSearch}
        onMessagesClick={() => navigate("/inbox")}
        onProfileClick={() => setLoginModalOpen(true)}
        onFavoritesClick={() => navigate("/favorites")}
      />

    <section className="banner item-detail">
      <Link className="text-link" to="/search">
        ← Back to search
      </Link>

      <div className="item-page-grid">
        {item.images && item.images.length > 0 ? (
          <div className="item-images-gallery">
            <div className="item-images-container">
              {item.images.map((image, index) => (
                <button
                  key={index}
                  className={`image-thumbnail ${selectedImageIndex === index ? "selected" : ""}`}
                  onClick={() => setSelectedImageIndex(index)}
                  type="button"
                  aria-label={`View image ${index + 1}`}
                >
                  <img src={image} alt={`${item.title} ${index + 1}`} />
                </button>
              ))}
            </div>
            <img
              className="item-detail-image"
              src={
                item.images[selectedImageIndex] ||
                "/images/item-placeholder.png"
              }
              alt={item.title}
            />
          </div>
        ) : (
          <img
            className="item-detail-image"
            src={item.image_url || "/images/item-placeholder.png"}
            alt={item.title}
          />
        )}

        <div className="item-detail-body">
          <span className="item-card-category">{item.category_name}</span>

          <div className="item-favorite">
            <h2 className="item-detail-title">{item.title}</h2>

            {!item.isOwner && (
              <button
                className={`item-favorite-button${isFavorited ? " favorited" : ""}`}
                type="button"
                onClick={handleToggleFavorite}
                aria-label={
                  isFavorited ? "Remove from favorites" : "Add to favorites"
                }
              >
                {isFavorited ? "♥" : "♡"}
              </button>
            )}
          </div>

          <p className="item-detail-price">
            ${Number(item.price || 0).toFixed(2)}
          </p>
          <p className="item-detail-description">{item.description}</p>
        </div>

        <div className="item-seller-info">
          <div className="seller-name">
            <button className="seller-page" onClick={() => {}}>
              <img
                className="seller-image"
                src="/images/item-placeholder.png"
                alt="Seller"
              />
            </button>
            <h3>Seller Name</h3>
          </div>

          <div className="message-seller">
            Send a Message to Seller
            {!isSignedIn ? (
              <>
                <p style={{ margin: "10px 0", color: "white" }}>
                  To Message Seller, Please Register/Sign-in
                </p>
                <button
                  className="send-message-button"
                  onClick={() => {}}
                  style={{ backgroundColor: "#007bff" }}
                >
                  Register/Sign in
                </button>
              </>
            ) : messageSent ? (
              <>
                <p style={{ margin: "10px 0", color: "white" }}>
                  ✓ Message Sent
                </p>
              </>
            ) : (
              <>
                <input
                  className="chat-message-input"
                  type="text"
                  defaultValue="Is this available?"
                />
                <button
                  className="send-message-button"
                  onClick={handleSendMessage}
                >
                  Send
                </button>
              </>
            )}
          </div>
        </div>
      </div>
      {loginModalOpen && (
        <LoginModal onClose={() => setLoginModalOpen(false)} />
      )}
    </section>
    </>
  );
}
