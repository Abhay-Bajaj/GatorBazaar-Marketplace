import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import NavigationSearchBar from './components/NavigationSearchBar'
import ListingCard from './components/ListingCard'
import LoginModal from './components/LoginModal'
import { mockItems } from './data/mockItems'

function toListingCardFormat(items) {
  return items.map((item) => ({
    id: item.id,
    title: item.title,
    price: item.price,
    image: item.image_url || 'placeholder',
    isFavorited: false,
  }))
}

export default function Dashboard() {
  const navigate = useNavigate()
  const [query, setQuery] = useState('')
  const [loginModalOpen, setLoginModalOpen] = useState(false)
  const [activeListings, setActiveListings] = useState(
    toListingCardFormat(mockItems.slice(0, 6))
  )

  const soldListings = useMemo(
    () =>
      toListingCardFormat(mockItems.slice(6, 12)).map((item, index) => ({
        ...item,
        soldPrice: Number(item.price) - (index % 2 === 0 ? 5 : 0),
      })),
    []
  )

  function handleSearch(event) {
    event.preventDefault()
    const params = new URLSearchParams()
    if (query.trim()) params.set('q', query.trim())
    navigate(`/?${params.toString()}`)
  }

  function handleToggleFavorite(id) {
    setActiveListings((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, isFavorited: !item.isFavorited } : item
      )
    )
  }

  return (
    <div className="search-page">
      <NavigationSearchBar
        query={query}
        onQueryChange={setQuery}
        onSearch={handleSearch}
        onSellClick={() => navigate('/dashboard')}
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
              <ListingCard {...listing} onToggleFavorite={handleToggleFavorite} />
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