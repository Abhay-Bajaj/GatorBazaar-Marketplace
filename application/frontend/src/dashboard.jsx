import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import NavigationSearchBar from './components/NavigationSearchBar'
import ListingCard from './components/ListingCard'
import LoginModal from './components/LoginModal'
import './dashboard.css'


export default function Dashboard() {
  const navigate = useNavigate()
  const [query, setQuery] = useState('')
  const [loginModalOpen, setLoginModalOpen] = useState(false)

  const [activeListings, setActiveListings] = useState([])
  const [soldListings, setSoldListings] = useState([])


  function handleSearch(event) {
    event.preventDefault()
    const params = new URLSearchParams()
    if (query.trim()) params.set('q', query.trim())
    navigate(`/search?${params.toString()}`)
  }

  function handleToggleFavorite(id) {
    setActiveListings((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, isFavorited: !item.isFavorited } : item
      )
    )
  }

  useEffect(() => {
    async function fetchListings() {
      try {
        const response = await fetch(
          'http://localhost:3000/api/items/my-listings',
          {
            credentials: 'include',
          }
        )

        const data = await response.json()

        if (!response.ok){
          console.error(data.error)
          return
        }

        setActiveListings(data.currentListings)
        setSoldListings(data.soldListings)

      } catch (err) {
        console.error(err)
      }
    }

    fetchListings()
  }, [])

  return (
    <div className="search-page">
      <NavigationSearchBar
        query={query}
        onQueryChange={setQuery}
        onSearch={handleSearch}
        onSellClick={() => navigate('/create-listing')}
        onMessagesClick={() => navigate('/inbox')}
        onFavoritesClick={() => { }}
        onProfileClick={() => setLoginModalOpen(true)}
        placeholder="Search marketplace items"
        searchButtonText="Search"
      />

      <section className="dashboard-banner">
        <h2 className="dashboard-title">Seller Dashboard</h2>
        <p className="dashboard-subtitle">
          Track your active listings and recently sold items in one place.
        </p>
      </section>

      <section className="dashboard-section">
        <div className="dashboard-section-header">
          <h3>Currently Listed</h3>
          <span>{activeListings.length} items</span>
        </div>

        <div className="dashboard-row">
          {activeListings.map((listing) => (
            <div key={listing.id} className="dashboard-row-card">
              <ListingCard 
                id={listing.listing_id}
                title={listing.title}
                price={listing.price}
                image={listing.image_url || 'placeholder'}
                category_name={listing.category_name}
                isFavorited={false}
                onToggleFavorite={handleToggleFavorite} />
            </div>
          ))}
        </div>
      </section>

      <section className="dashboard-section">
        <div className="dashboard-section-header">
          <h3>Sold Items</h3>
          <span>{soldListings.length} items</span>
        </div>

        <div className="dashboard-row">
          {soldListings.map((listing) => (
            <article key={listing.id} className="dashboard-sold-card">
              <div className="dashboard-sold-image">
                <img
                  src={
                    listing.image && listing.image !== 'placeholder'
                      ? listing.image
                      : '/images/item-placeholder.png'
                  }
                  alt={listing.title}
                />
              </div>

              <div className="dashboard-sold-info">
                <p className="dashboard-sold-title">{listing.title}</p>
                <p className="dashboard-sold-meta">
                  Listed: ${Number(listing.price || 0).toFixed(2)}
                </p>
                <p className="dashboard-sold-meta">
                  Sold: ${Number(listing.soldPrice || 0).toFixed(2)}
                </p>
              </div>
            </article>
          ))}
        </div>
      </section>

      {loginModalOpen && (
        <LoginModal onClose={() => setLoginModalOpen(false)} />
      )}
    </div>
  )
}