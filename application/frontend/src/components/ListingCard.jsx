import { useNavigate } from 'react-router-dom'

export default function ListingCard({ id, title, price, image, isFavorited, onToggleFavorite }) {
  const navigate = useNavigate()

  const handleCardClick = () => {
    navigate(`/items/${id}`)
  }

  const handleFavoriteClick = (e) => {
    e.stopPropagation()
    onToggleFavorite(id)
  }

  return (
    <div className="gb-listing-card" onClick={handleCardClick} style={{ cursor: 'pointer' }}>
      <button
        className={`gb-favorite-btn${isFavorited ? ' favorited' : ''}`}
        type="button"
        onClick={handleFavoriteClick}
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