import { useEffect, useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import NavigationSearchBar from "./components/NavigationSearchBar"
import LoginModal from "./components/LoginModal"
import CreateListing from "./CreateListing"
import "./TransactionPage.css"

const mockTransactions = [
  {
    transaction_id: 1,
    item_title: 'MacBook Pro 16"',
    seller_name: 'John Doe',
    buyer_name: 'Jane Smith',
    seller_profile_pic: 'https://via.placeholder.com/100?text=JD',
    buyer_profile_pic: 'https://via.placeholder.com/100?text=JS',
    amount: 2499.99,
    status: 'Completed',
    transaction_date: '2024-04-15T10:30:00Z',
    location: 'San Francisco, CA',
  },
  {
    transaction_id: 2,
    item_title: 'Calculus Textbook',
    seller_name: 'Alice Johnson',
    buyer_name: 'Bob Wilson',
    seller_profile_pic: 'https://via.placeholder.com/100?text=AJ',
    buyer_profile_pic: 'https://via.placeholder.com/100?text=BW',
    amount: 75.50,
    status: 'Pending',
    transaction_date: '2024-04-20T14:15:00Z',
    location: 'Los Angeles, CA',
  },
  {
    transaction_id: 3,
    item_title: 'Wireless Headphones',
    seller_name: 'Charlie Brown',
    buyer_name: 'Diana Prince',
    seller_profile_pic: 'https://via.placeholder.com/100?text=CB',
    buyer_profile_pic: 'https://via.placeholder.com/100?text=DP',
    amount: 199.99,
    status: 'Completed',
    transaction_date: '2024-04-10T09:45:00Z',
    location: 'New York, NY',
  },
  {
    transaction_id: 4,
    item_title: 'Desk Chair',
    seller_name: 'Eve Garcia',
    buyer_name: 'Frank Miller',
    seller_profile_pic: 'https://via.placeholder.com/100?text=EG',
    buyer_profile_pic: 'https://via.placeholder.com/100?text=FM',
    amount: 150.00,
    status: 'Cancelled',
    transaction_date: '2024-04-18T16:20:00Z',
    location: 'Chicago, IL',
  },
  // Mockup transaction for display
  {
    transaction_id: 5,
    item_title: 'A Book',
    item_pic: '/images/book.png',
    seller_name: 'John San Francisco',
    buyer_name: 'Mary State University',
    seller_profile_pic: '/images/profile-placeholder.png',
    buyer_profile_pic: '/images/profile-placeholder.png',
    amount: 100.00,
    status: 'Pending',
    transaction_date: '2028-04-21T12:00:00Z',
    location: 'Formerly Cesar Chavez Center',
  },
]

function StarRating({ rating, onRatingChange, disabled = false }) {
  return (
    <div className={`star-rating ${disabled ? 'disabled' : ''}`}>
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          className={`star ${star <= rating ? 'filled' : ''} ${disabled ? 'disabled' : ''}`}
          onClick={!disabled ? () => onRatingChange(star) : undefined}
        >
          ★
        </span>
      ))}
    </div>
  )
}

export default function TransactionPage() {
  const { transaction_id } = useParams()
  const navigate = useNavigate()
  const [transaction, setTransaction] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [sellerRating, setSellerRating] = useState(0)
  const [buyerRating, setBuyerRating] = useState(0)
  const [comments, setComments] = useState('')
  const [confirmed, setConfirmed] = useState(false)
  const [query, setQuery] = useState('')
  const [loginModalOpen, setLoginModalOpen] = useState(false)

  // Mock current user - in real app, this would come from auth context or API
  const currentUser = 'John San Francisco' // Change this to test different views

  const isSeller = transaction && transaction.seller_name === currentUser
  const isBuyer = transaction && transaction.buyer_name === currentUser
  const completed = transaction && transaction.status === 'Completed'

  useEffect(() => {
    fetchTransaction()
  }, [transaction_id])

  async function fetchTransaction() {
    setLoading(true)
    setError(null)

    try {
      // For now, use mock data
      let foundTransaction = mockTransactions.find(
        (t) => t.transaction_id === parseInt(transaction_id)
      )
      if (!foundTransaction) {
        // Use the mockup transaction if not found
        foundTransaction = mockTransactions.find((t) => t.transaction_id === 5)
      }
      if (foundTransaction) {
        setTransaction(foundTransaction)
      } else {
        throw new Error('Transaction not found')
      }
    } catch (err) {
      console.error(err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  function handleCompleteTransaction() {
    // Here you would send the rating, comments, and confirmation to the backend
    setTransaction((prev) =>
      prev ? { ...prev, status: 'Completed' } : prev
    )
    alert('Transaction completed!')
  }

  function handleSearch(e) {
    e.preventDefault()
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query.trim())}`)
    }
  }

  if (loading) {
    return (
      <section className="banner transaction-page">
        <div className="search-loading">
          <span className="search-spinner" />
          Loading transaction…
        </div>
      </section>
    )
  }

  if (error || !transaction) {
    return (
      <section className="banner transaction-page">
        <p className="search-error">⚠ {error || 'Transaction not found'}</p>
        <Link to="/transactions" className="search-btn">
          Back to Transactions
        </Link>
      </section>
    )
  }

  const formattedDate = new Date(transaction.transaction_date).toLocaleString()
  const itemImage = transaction.item_pic || '/images/book.png'
  const description = transaction.description || 'This transaction includes the selected item, exchanged between buyer and seller at the agreed location.'

  return (
    <div className="transaction-page">
      <NavigationSearchBar
            query={query}
            onQueryChange={setQuery}
            onSearch={handleSearch}
            onProfileClick={() => setLoginModalOpen(true)}
            onSellClick={() => navigate('/create-listing')}
                          />
      <section className="banner transaction-page">
        <div className="banner-content">
          <div className="transaction-header-row">
            <div>
              <h1 className="transaction-header">Complete Transaction</h1>
              <p className="transaction-subtitle">
                Review the transaction details, confirm the exchange, and submit your feedback.
              </p>
            </div>
            <span className={`status-badge status-${transaction.status.toLowerCase()}`}>
              {transaction.status}
            </span>
          </div>

          <div className="transaction-grid">
            <div className="transaction-summary">
              <div className="transaction-card">
                <div className="summary-card-header">
                  <div>
                    <p className="summary-label">Item</p>
                    <h2>{transaction.item_title}</h2>
                  </div>
                  <p className="summary-price">${transaction.amount.toFixed(2)}</p>
                </div>

                <div className="transaction-meta-row">
                  <div>
                    <p className="summary-label">Date</p>
                    <p>{formattedDate}</p>
                  </div>
                  <div>
                    <p className="summary-label">Location</p>
                    <p>{transaction.location}</p>
                  </div>
                </div>

                <div className="transaction-meta-row">
                  <div>
                    <p className="summary-label">Seller</p>
                    <p>{transaction.seller_name}</p>
                  </div>
                  <div>
                    <p className="summary-label">Buyer</p>
                    <p>{transaction.buyer_name}</p>
                  </div>
                </div>
              </div>

              <div className="transaction-card">
                <div className="transaction-participants compact">
                  <div className="participant">
                    <img
                      src={transaction.seller_profile_pic}
                      alt={`${transaction.seller_name} profile`}
                      className="profile-pic"
                    />
                    <p className="participant-name">
                      {isSeller ? 'You' : transaction.seller_name}
                    </p>
                    <p className="participant-role">Seller</p>
                  </div>
                  <div className="arrow">
                    ⇄
                  </div>
                  <div className="participant">
                    <img
                      src={transaction.buyer_profile_pic}
                      alt={`${transaction.buyer_name} profile`}
                      className="profile-pic"
                    />
                    <p className="participant-name">
                      {isBuyer ? 'You' : transaction.buyer_name}
                    </p>
                    <p className="participant-role">Buyer</p>
                  </div>
                </div>
              </div>

              <div className="transaction-card item-card">
                <p className="summary-label">Item Preview</p>
                <div className="item-image">
                  <img
                    src={itemImage}
                    alt={`${transaction.item_title} pic`}
                    className="item-pic"
                  />
                </div>
                <p className="item-description">{description}</p>
              </div>
            </div>

            <div className="transaction-actions">
              <div className="transaction-card next-steps-card">
                <h3>Next Steps</h3>
                <ul className="transaction-list">
                  <li>Confirm the transaction details below.</li>
                  <li>Leave honest feedback for the other party.</li>
                  <li>Check your inbox for any follow-up messages.</li>
                </ul>
              </div>

              <div className="transaction-card full-card">
                <div className="details-box">
                  <div className="exchange-details">
                    <p>
                      Confirm the exchange details and leave a review for the other participant.
                    </p>
                  </div>

                  <div className="transaction-location">
                    <p><strong>Confirmed location:</strong> {transaction.location}</p>
                  </div>

                  <div className="rating-section">
                    <h3>Rate the Other Participant</h3>
                    {isSeller && (
                      <div className="rating-item">
                        <label>Rate Buyer ({transaction.buyer_name}):</label>
                        <StarRating
                          rating={buyerRating}
                          onRatingChange={setBuyerRating}
                          disabled={completed}
                        />
                      </div>
                    )}
                    {isBuyer && (
                      <div className="rating-item">
                        <label>Rate Seller ({transaction.seller_name}):</label>
                        <StarRating
                          rating={sellerRating}
                          onRatingChange={setSellerRating}
                          disabled={completed}
                        />
                      </div>
                    )}
                  </div>

                  <div className="comments-section">
                    <label htmlFor="comments">Comments</label>
                    <textarea
                      id="comments"
                      value={comments}
                      onChange={(e) => setComments(e.target.value)}
                      placeholder="Add any comments about the transaction..."
                      rows={5}
                      disabled={completed}
                    />
                  </div>

                  <div className="confirmation-section">
                    <label>
                      <input
                        type="checkbox"
                        checked={confirmed}
                        onChange={(e) => setConfirmed(e.target.checked)}
                        disabled={completed}
                      />
                      I confirm this transaction was completed as described.
                    </label>
                  </div>

                  <div className="note">
                    <i>
                      Both parties should confirm to finalize the transaction status.
                    </i>
                  </div>

                  <button
                    className="complete-btn"
                    onClick={handleCompleteTransaction}
                    disabled={!confirmed || completed}
                  >
                    Complete Transaction
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <LoginModal isOpen={loginModalOpen} onClose={() => setLoginModalOpen(false)} />
    </div>
  )
}
