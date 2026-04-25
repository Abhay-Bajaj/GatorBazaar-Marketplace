export default function ListingCard({ id, title, price, image, isFavorited, onToggleFavorite }) {
  return (
    <div className="gb-listing-card">
      <button
        className={`gb-favorite-btn${isFavorited ? ' favorited' : ''}`}
        type="button"
        onClick={() => onToggleFavorite(id)}
        aria-label={isFavorited ? 'Remove from favorites' : 'Add to favorites'}
      >
        {isFavorited ? '♥' : '♡'}
      </button>

      <div className="gb-card-image">
        <img
          src={image && image !== 'placeholder' ? image : '/images/item-placeholder.png'}
          alt={title}
        />
      </div>

      <div className="gb-card-footer">
        <span className="gb-card-title">{title}</span>
        <span className="gb-card-price">${Number(price || 0).toFixed(2)}</span>
      </div>
    </div>
  )
}
