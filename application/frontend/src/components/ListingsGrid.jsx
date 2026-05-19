import ListingCard from './ListingCard'

export default function ListingsGrid({ listings, loading, error, onToggleFavorite }) {
  if (loading) {
    return (
      <div className="gb-listings-grid">
        {[...Array(12)].map((_, i) => (
          <div key={i} className="gb-listing-card skeleton-card">
            <div className="skeleton skeleton-card-image-search" />
            <div className="gb-card-footer" style={{ flexDirection: 'column', gap: 8 }}>
              <div className="skeleton skeleton-text-sm" style={{ width: '80%' }} />
              <div className="skeleton skeleton-text-sm" style={{ width: '40%' }} />
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <div className="gb-grid-status">
        <p className="search-error">⚠ Could not reach the server: {error}</p>
      </div>
    )
  }

  if (listings.length === 0) {
    return (
      <div className="gb-grid-status">
        <p className="search-empty-msg">No listings found. Try adjusting your search or filters.</p>
      </div>
    )
  }

  return (
    <div className="gb-listings-grid">
      {listings.map((listing) => (
        <ListingCard
          key={listing.id}
          {...listing}
          onToggleFavorite={onToggleFavorite}
        />
      ))}
    </div>
  )
}
