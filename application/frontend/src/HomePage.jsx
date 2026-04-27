import { useState } from "react"
import './HomePage.css'
import NavigationSearchBar from "./components/NavigationSearchBar"
import LoginModal from "./components/LoginModal"
import CreateListing from "./CreateListing"
import { Link, useNavigate } from "react-router-dom"
import { mockItems } from './data/mockItems'

const categories = [
    "Clothes", 
    "Text Books", 
    "Funiture", 
    "Electronics", 
    "School Supplies", 
    "Room Search" ]

export default function HomePage() {
    const [query, setQuery] = useState("")
    const navigate = useNavigate()
    const [loginModalOpen, setLoginModalOpen] = useState(false)

    function handleSearch(e) {
        e.preventDefault()
        navigate(`/search?q=${query}`)
    }

    function handleCategoryClick(category) {
        navigate(`/search?category=${category}`)
    }
    // Recently added items || Replace mockItems with db
    const recentItems = mockItems.slice(0, 5)
    
    return (
        <div className="homepage">
            <NavigationSearchBar
                    query={query}
                    onQueryChange={setQuery}
                    onSearch={handleSearch}
                    onProfileClick={() => setLoginModalOpen(true)}
                    onSellClick={() => navigate('/create-listing')}
                  />

            <section>
                <h3>Popular Categories</h3>
                <div className="category-list">
                    {categories.map((category) => (
                        <button
                            key={category}
                            onClick={() => handleCategoryClick(category)}>
                            {category}
                        </button>
                    ))}
                </div>
            </section>

            <section>
                <h3>Recently Added</h3>
                <div className="recent-items">
                    {recentItems.map((item) => (
                        <ItemCard key={item.listing_id} item={item} />
                    ))}
                </div>
            </section>
            
            <section> 
                {/* Placeholder, implement with db*/} 
                <h3> Recently Viewed</h3>
                <div className="recent-items"> 
                    {recentItems.map((item) => (
                        <ItemCard key={item.listing_id} item={item} />
                    ))}
                </div>
            </section>

            {loginModalOpen && <LoginModal onClose={() => setLoginModalOpen(false)} />}
        </div>
        

        
    )
}
    
function ItemCard({ item }) {
    return (
      <Link to={`/items/${item.listing_id}`} className="item-card">
        <img
          className="item-card-image"
          src={item.image_url || '/images/item-placeholder.png'}
          alt={item.title}
        />
        <div className="item-card-body">
          <span className="item-card-category">{item.category_name}</span>
          <h3 className="item-card-title">{item.title}</h3>
          <p className="item-card-description">{item.description}</p>
          <p className="item-card-price">${Number(item.price || 0).toFixed(2)}</p>
        </div>
      </Link>
    )
  }