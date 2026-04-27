import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'

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
    item_title: 'Sample Item',
    item_pic: '/images/book.png',
    seller_name: 'Alice Johnson',
    buyer_name: 'Buyer Name',
    seller_profile_pic: '/images/profile-placeholder.png',
    buyer_profile_pic: '/images/profile-placeholder.png',
    amount: 100.00,
    status: 'Pending',
    transaction_date: '2024-04-21T12:00:00Z',
    location: 'Not Cesar Chavez Center',
  },
]

function StarRating({ rating, onRatingChange }) {
  return (
    <div className="star-rating">
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          className={`star ${star <= rating ? 'filled' : ''}`}
          onClick={() => onRatingChange(star)}
        >
          ★
        </span>
      ))}
    </div>
  )
}

export default function TransactionPage() {
  const { transaction_id } = useParams()
  const [transaction, setTransaction] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [sellerRating, setSellerRating] = useState(0)
  const [buyerRating, setBuyerRating] = useState(0)
  const [comments, setComments] = useState('')
  const [confirmed, setConfirmed] = useState(false)

  // Mock current user - in real app, this would come from auth context or API
  const currentUser = 'Alice Johnson' // Change this to test different views

  const isSeller = transaction && transaction.seller_name === currentUser
  const isBuyer = transaction && transaction.buyer_name === currentUser

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
    alert('Transaction completed!')
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

  return (
    <section className="banner transaction-page">
      <NavigationSearchBar
                          query={query}
                          onQueryChange={setQuery}
                          onSearch={handleSearch}
                          onProfileClick={() => setLoginModalOpen(true)}
                          onSellClick={() => navigate('/create-listing')}
                        />
      <div className="transaction-header">
          Complete Transaction
      </div>
      {/* Profile Pictures and Names */}
      <div className="transaction-participants">
        <div className="participant">
          <img
            src={transaction.seller_profile_pic}
            alt={`${transaction.seller_name} profile`}
            className="profile-pic"
          />
          <p className="participant-name">
            {isSeller ? 'You' : transaction.seller_name} (Seller)
          </p>
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
            {isBuyer ? 'You' : transaction.buyer_name} (Buyer)
          </p>
        </div>
      </div>

      <div className="item-image">
        <img
          src="/images/book.png"
            alt={`${transaction.item_title} pic`}
            className="item-pic"
        />
      </div>
      <div className="details-box">
        {/* Exchange Details */}
        <div className="exchange-details">
          <p>Exchanged {transaction.item_title} on {formattedDate}</p>
        </div>

        {/* Location */}
        <div className="transaction-location">
          <p>Location: {transaction.location}</p>
        </div>

        {/* Rating Section */}
        <div className="rating-section">
          <h3>Rate the Other Participant</h3>
          {isSeller && (
            <div className="rating-item">
              <label>Rate Buyer ({transaction.buyer_name}):</label>
              <StarRating rating={buyerRating} onRatingChange={setBuyerRating} />
            </div>
          )}
          {isBuyer && (
            <div className="rating-item">
              <label>Rate Seller ({transaction.seller_name}):</label>
              <StarRating rating={sellerRating} onRatingChange={setSellerRating} />
            </div>
          )}
          <div className="comments-section">
            <label htmlFor="comments">Comments:</label>
            <textarea
              id="comments"
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              placeholder="Add any comments about the transaction..."
              rows={4}
            />
          </div>
        </div>

        {/* Confirmation Checkbox */}
        <div className="confirmation-section">
          <label>
            <input
              type="checkbox"
              checked={confirmed}
              onChange={(e) => setConfirmed(e.target.checked)}
            />
            I confirmed that this transaction took place, at the time and location specified above.
          </label>
        </div>

        <div className="note">
          <i>
            Transaction won't be listed as complete until both seller and buyer complete their confirmation forms.
          </i>
        </div>

        {/* Complete Transaction Button */}
        <button
          className="complete-btn"
          onClick={handleCompleteTransaction}
          disabled={!confirmed}
        >
          Complete Transaction
        </button>
      </div>
    </section>
  )
}
