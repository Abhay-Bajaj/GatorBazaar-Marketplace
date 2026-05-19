import { useState, useEffect } from "react";
import "./HomePage.css";
import NavigationSearchBar from "./components/NavigationSearchBar";
import LoginModal from "./components/LoginModal";
import CreateListing from "./CreateListing";
import { Link, useNavigate } from "react-router-dom";
import { mockItems } from "./data/mockItems";
import { HomePageSkeleton, NavBarSkeleton } from "./components/SkeletonLoaders";
import useAuthStatus from "./hooks/useAuthStatus";
import useAccountNavigation from "./hooks/useAccountNavigation";
import ListingCard from "./components/ListingCard";

const categories = [
  "Clothes",
  "Text Books",
  "Furniture",
  "Electronics",
  "School Supplies",
  "Room Search",
];

export default function HomePage() {
  const { isSignedIn } = useAuthStatus();
  const [query, setQuery] = useState("");
  const navigate = useNavigate();
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [favorites, setFavorites] = useState([]);

  const handleToggleFavorite = (itemId) => {
    setFavorites((prev) =>
        prev.includes(itemId) ? prev.filter((id) => id !== itemId) : [...prev, itemId]
    )
}
 
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);
  const { handleAccountClick } = useAccountNavigation({
    isSignedIn,
    setLoginModalOpen,
  });

  function handleSearch(e) {
    e.preventDefault();
    navigate(`/search?q=${query}`);
  }

  function handleCategoryClick(category) {
    navigate(`/search?category=${category}`);
  }
  // Recently added items || Replace mockItems with db
  const recentItems = mockItems.slice(0, 5);

  const recentViewed = mockItems.slice(0, 5);

  if (loading) {
    return (
      <>
        <NavBarSkeleton />
        <HomePageSkeleton />
      </>
    );
  }

  return (
    <div className="homepage">
      <header className="nav-bar">
        <NavigationSearchBar
          query={query}
          onQueryChange={setQuery}
          onSearch={handleSearch}
          onProfileClick={handleAccountClick}
          onSellClick={() => navigate("/create-listing")}
          onMessagesClick={() => navigate("/inbox")}
          onFavoritesClick={() => navigate("/favorites")}
        />
      </header>
      <section>
        <div className="category-list">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => handleCategoryClick(category)}
            >
              {category}
            </button>
          ))}
        </div>
      </section>
      <section>
        <h3>Recently Added</h3>
        <div className="recent-items">
          {recentItems.map((item) => (
            <ListingCard
              key={item.id}
              id={item.id}
              title={item.title}
              price={item.price}
              image={item.image_url}
              category_name={item.category_name}
              isFavorited={favorites.map(String).includes(String(item.id))}
              onToggleFavorite={handleToggleFavorite}
            />
          ))}
        </div>
      </section>
      <section>
        {/* Placeholder, implement with db*/}
        <h3> Recently Viewed</h3>
        <div className="recent-items">
          {recentViewed.map((item) => (
            <ListingCard
              key={item.id}
              id={item.id}
              title={item.title}
              price={item.price}
              image={item.image_url}
              category_name={item.category_name}
              isFavorited={favorites.map(String).includes(String(item.id))}
              onToggleFavorite={handleToggleFavorite}
            />
          ))}
        </div>
      </section>
      {loginModalOpen && (
        <LoginModal onClose={() => setLoginModalOpen(false)} />
      )}
    </div>
  );
}
