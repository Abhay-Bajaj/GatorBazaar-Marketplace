import { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { mockFavorites } from "./data/mockFavorites";
import NavigationSearchBar from "./components/NavigationSearchBar";
import LoginModal from "./components/LoginModal";
import ListingCard from "./components/ListingCard";

export default function Favorite() {
  const navigate = useNavigate();

  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [isSignedIn, setIsSignedIn] = useState(true); //test unregistered user state

  const handleToggleFavorite = (itemId) => {
    setFavorites((prev) => prev.filter((item) => item.id !== itemId));
  };

  const handleSearch = (e) => {
    e.preventDefault();
    navigate(`/search?q=${encodeURIComponent(query.trim())}`);
  };

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`/api/favorites`);
        if (!res.ok) throw new Error();
        const data = await res.json();
        setFavorites(data);
      } catch {
        setFavorites(mockFavorites);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  return (
    <section className="favorites-page">
      <NavigationSearchBar
        query={query}
        onQueryChange={setQuery}
        onSearch={handleSearch}
        onMessagesClick={() => navigate("/inbox")}
        onProfileClick={() => setLoginModalOpen(true)}
      />
      <button className="back-button" onClick={() => navigate(-1)}>
        ← Back
      </button>

      <div className="main-layout">
        {!isSignedIn ? (
          <h1 className="favorite-empty">
            Please sign in to view your favorites.
          </h1>
        ) : loading ? (
          <p>Loading...</p>
        ) : favorites.length === 0 ? (
          <h1 className="favorite-empty"> No favorites found.</h1>
        ) : (
          <div className="gb-listings-grid">
            {favorites.map((item) => (
              <ListingCard
                key={item.id}
                {...item}
                isFavorited={true}
                onToggleFavorite={handleToggleFavorite}
              />
            ))}
          </div>
        )}
      </div>

      {loginModalOpen && (
        <LoginModal onClose={() => setLoginModalOpen(false)} />
      )}
    </section>
  );
}
