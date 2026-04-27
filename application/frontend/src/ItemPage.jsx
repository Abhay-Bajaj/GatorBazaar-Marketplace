import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { mockItems } from './data/mockItems'


export default function ItemPage() {
  const { id } = useParams()
  const [item, setItem] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isFavorited, setIsFavorited] = useState(false)
  const [messageSent, setMessageSent] = useState(false)
  const [isSignedIn, setIsSignedIn] = useState(true) // set to false to test non-signed-in state
  const favoriteImage = isFavorited ? "/images/heart_2.png" : "/images/heart_1.webp"
  const handleFavorite = () => setIsFavorited(!isFavorited)
  const handleSendMessage = () => setMessageSent(true)
  
  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`/api/items/${id}`)
        if (!res.ok) throw new Error(`Item not found (${res.status})`)
        setItem(await res.json())
      } catch {
        const localItem = mockItems.find((entry) => String(entry.id) === String(id))
        if (localItem) {
          setItem(localItem)
        } else {
          setError('Item not found')
        }
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [id])

  if (loading) {
    return (
      <section className="banner item-detail">
        <div className="search-loading">
          <span className="search-spinner" />
          Loading item…
        </div>
      </section>
    )
  }

  if (error) {
    return (
      <section className="banner item-detail">
        <p className="search-error">⚠ {error}</p>
        <Link className="text-link" to="/search">
          ← Back to search
        </Link>
      </section>
    )
  }

  return (
    <section className="banner item-detail">
      <Link className="text-link" to="/search">
        ← Back to search
      </Link>

      <div className="item-detail-grid">
        <img
          className="item-detail-image"
          src={item.image_url || '/images/item-placeholder.png'}
          alt={item.title}
        />

        <div className="item-detail-body">
          <span className="item-card-category">{item.category_name}</span>
          
          <div className="item-favorite">
            <h2 className="item-detail-title">{item.title}</h2>
            <button className="item-favorite-button" onClick={handleFavorite}>
              <img className="item-favorite-img" src={favoriteImage} alt="Favorite" style={{transform: isFavorited ? 'scale(1.20)' : 'scale(0.90)' }} />
            </button>
           
          </div>
          
          <p className="item-detail-price">
            ${Number(item.price || 0).toFixed(2)}
          </p>
          <p className="item-detail-description">{item.description}</p>                          
        </div>
        
        <div className="item-seller-info">
          <div className="seller-name">
            <button className="seller-page" onClick={() => {}} >
              <img className="seller-image" src="/images/item-placeholder.png" alt="Seller" />
            </button>
            <h3>Seller Name</h3>
          </div>
          
          <div className="message-seller">
            Send a Message to Seller
            {!isSignedIn ? (
              <>
                <p style={{ margin: '10px 0', color: 'white' }}>
                  To Message Seller, Please Register/Sign-in
                </p>
                <button
                  className="send-message-button"
                  onClick={() => {}}
                  style={{ backgroundColor: '#007bff' }}
                >
                  Register/Sign in
                </button>
              </>
            ) : messageSent ? (
              <>
                <p style={{ margin: '10px 0', color: 'white' }}>
                  ✓ Message Sent
                </p>
                <button
                  className="send-message-button"
                  onClick={() => {}}
                  style={{ backgroundColor: '#28a745' }}
                >
                  Go to Chat
                </button>
              </>
            ) : (
              <>
                <input className="chat-message-input"
                  type="text"
                  defaultValue="Is this available?"
                />
                <button
                  className="send-message-button"
                  onClick={handleSendMessage}
                >
                  Send
                </button>
              </>
            )}
          </div>
        </div>

       

      </div>
    </section>
  )
}
