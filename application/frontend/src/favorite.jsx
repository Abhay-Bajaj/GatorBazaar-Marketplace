import { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import NavigationSearchBar from "./components/NavigationSearchBar";
import LoginModal from "./components/LoginModal";
import ListingCard from "./components/ListingCard";
import useAuthStatus from "./hooks/useAuthStatus"
import useAccountNavigation from "./hooks/useAccountNavigation"
import { addFavorite, removeFavorite } from './api/favoritesAPI'
import "./favorites.css"

export default function Favorite() {
  const { isSignedIn } = useAuthStatus()
  const navigate = useNavigate();

  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const { handleAccountClick } = useAccountNavigation({ isSignedIn, setLoginModalOpen })
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 12

  const totalPages = Math.ceil(favorites.length / itemsPerPage)

  const startItem = favorites.length === 0
    ? 0
    : (currentPage - 1) * itemsPerPage + 1

  const endItem = Math.min(
    currentPage * itemsPerPage,
    favorites.length
  )

  const paginatedFavorites = favorites.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  async function handleToggleFavorite(itemId) {

    const listing = favorites.find((item) => item.id === itemId)
    if (!listing) return

    const nextIsFavorited = !listing.isFavorited

    try {
      if (nextIsFavorited) {
        await addFavorite(itemId)
      } else {
        await removeFavorite(itemId)
      }

      setFavorites((prev) => prev.filter((item) => item.id !== itemId));

    } catch (err) {
      console.log(err)
    }
  }


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
        setFavorites(
          data.map((item) => ({
            ...item,
            id: item.listing_id,
            image: item.image_url,
            isFavorited: true
          }))
        )
      } catch {
        console.log(err);
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
        onProfileClick={handleAccountClick}
        onSellClick={() => navigate('/create-listing')}
      />
      <div className="favorites-content">

        <div className="favorites-header">

          <button className="home-button" onClick={() => navigate("/")}>
            ← Home
          </button>

          <div>
            <h1>My Favorites</h1>
            <p>Your saved marketplace listings.</p>
          </div>
        </div>

        <div className="favorites-panel">
          {!isSignedIn ? (
            <h1 className="favorite-empty">
              Please sign in to view your favorites.
            </h1>
          ) : loading ? (
            <p>Loading...</p>
          ) : favorites.length === 0 ? (
            <h1 className="favorite-empty"> No favorites found.</h1>
          ) : (
            <>
              <div className="favorites-stats">
                <span>
                  <strong>{favorites.length}</strong> favorites
                </span>

                <span>
                  Showing {startItem}-{endItem}
                </span>
              </div>

              <div className="gb-listings-grid favorites-grid">
                {paginatedFavorites.map((item) => (
                  <ListingCard
                    key={item.id}
                    {...item}
                    isFavorited={true}
                    onToggleFavorite={handleToggleFavorite}
                  />
                ))}
              </div>

              {totalPages > 1 && (
                <div className="favorites-pagination">
                  <button
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage((prev) => prev - 1)}
                  >
                    Previous
                  </button>

                  <span>
                    Page {currentPage} of {totalPages}
                  </span>

                  <button
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage((prev) => prev + 1)}
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
      {loginModalOpen && (
        <LoginModal onClose={() => setLoginModalOpen(false)} />
      )}

    </section>
  );
}
