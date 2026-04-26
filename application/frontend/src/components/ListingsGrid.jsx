import ListingCard from './ListingCard'

export default function ListingsGrid({ listings, loading, error, onToggleFavorite }) {
  if (loading) {
    return (
      <div className="gb-grid-status">
        <div className="search-loading">
          <span className="search-spinner" />
          Searching…
        </div>
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
