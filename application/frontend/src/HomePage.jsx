import { useState } from "react"
import './HomePage.css'
import { Link, useNavigate } from "react-router-dom"
import { mockItems } from './data/mockItems'

const categories = [
    "Clothess", 
    "Text Books", 
    "Funiture", 
    "Electronics", 
    "School Supplies", 
    "Room Search" ]

export default function HomePage() {
    const [query, setQuery] = useState("")
    const navigate = useNavigate()

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
            {/* Placeholder, implement with Ken's updated search page nav bar */}
            <div className="navbar">
                <h2> Gator Bazaar</h2>
                
                <form onSubmit={handleSearch} className="search-form">
                    <input 
                        type="text"
                        placeholder="Search items..."
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                    />
                </form>

                <button> Sell </button>
            </div>

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