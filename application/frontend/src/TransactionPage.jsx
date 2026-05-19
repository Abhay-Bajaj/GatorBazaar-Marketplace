import { useEffect, useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import NavigationSearchBar from "./components/NavigationSearchBar"
import LoginModal from "./components/LoginModal"
import CreateListing from "./CreateListing"
import { mockTransactions } from "./data/mockTransactions"
import "./TransactionPage.css"


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
  const [reviews, setReviews] = useState([])
  const [query, setQuery] = useState('')
  const [loginModalOpen, setLoginModalOpen] = useState(false)

  useEffect(() => {
    fetchTransaction()
  }, [transaction_id])

  async function fetchTransaction() {
    setLoading(true)
    setError(null)

    try {
      const [transactionRes, reviewsRes] = await Promise.all([
        fetch(`/api/transactions/${transaction_id}`, {
          credentials: 'include'
        }),
        fetch(`/api/transactions/${transaction_id}/reviews`, {
          credentials: 'include'
        })
      ])

      if (!transactionRes.ok) {
        throw new Error(`Transaction error (${transactionRes.status})`)
      }

      if (!reviewsRes.ok) {
        throw new Error(`Reviews error (${reviewsRes.status})`)
      }

      const transactionData = await transactionRes.json()
      const reviewsData = await reviewsRes.json()

      setTransaction(transactionData)
      setReviews(reviewsData)
    } catch (err) {
      console.error(err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  async function handleCompleteTransaction() {
    try {
      const reviewed_user_id = isSeller
        ? transaction.buyer_user_id
        : transaction.seller_user_id

      const rating = isSeller ? buyerRating : sellerRating

      const reviewRes = await fetch(`/api/transactions/${transaction_id}/reviews`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({
          reviewed_user_id,
          confirmed: true,
          rating,
          comment: comments
        })
      })

      if (!reviewRes.ok) throw new Error(`Review error (${reviewRes.status})`)

      await fetchTransaction()

    } catch (err) {
      console.error(err)
      setError(err.message)
    }
  }
  async function handleCancelTransaction() {
    try {
      const res = await fetch(`/api/transactions/${transaction_id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({
          action: 'Cancelled'
        })
      })

      if (!res.ok) {
        throw new Error(`Cancel error (${res.status})`)
      }

      await fetchTransaction()
    } catch (err) {
      console.error(err)
      setError(err.message)
    }
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
        <Link to="/inbox" className="search-btn">
          Back to Inbox
        </Link>
      </section>
    )
  }

  const formattedDate = new Date(transaction.exchange_time).toLocaleString()
  const itemImage = transaction.item_pic || '/images/book.png'
  const description = 'This transaction includes the selected item, exchanged between buyer and seller at the agreed location.'
  const sellerProfilePic = transaction.seller_profile_pic || '/images/profile-placeholder.png'
  const buyerProfilePic = transaction.buyer_profile_pic || '/images/profile-placeholder.png'
  const isSeller =
    transaction &&
    Number(transaction.current_user_id) === Number(transaction.seller_user_id)

  const isBuyer =
    transaction &&
    Number(transaction.current_user_id) === Number(transaction.buyer_user_id)
  const sellerConfirmed = reviews.some(
    review =>
      Number(review.reviewer_user_id) ===
      Number(transaction?.seller_user_id) &&
      Number(review.confirmed) === 1
  )

  const buyerConfirmed = reviews.some(
    review =>
      Number(review.reviewer_user_id) ===
      Number(transaction?.buyer_user_id) &&
      Number(review.confirmed) === 1
  )
  const completed = transaction && ((isBuyer && buyerConfirmed) || (isSeller && sellerConfirmed))
  const statusLabel = transaction.status === 'Accepted' ? 'In Progress' : transaction.status
  const isCancelled = transaction.status === 'Cancelled'
  const pageTitle =
    transaction.status === 'Cancelled'
      ? 'Transaction Cancelled'
      : transaction.status === 'Completed'
        ? 'Transaction Complete'
        : 'Complete Transaction'
  return (
    <div className="transaction-page">
      <NavigationSearchBar
            query={query}
            onQueryChange={setQuery}
            onSearch={handleSearch}
            onProfileClick={() => setLoginModalOpen(true)}
            onSellClick={() => navigate('/create-listing')}
            onMessagesClick={() => navigate('/inbox')}
            onFavoritesClick={() => navigate('/favorites')}
                          />
      <section className="banner transaction-page">
        <div className="banner-content">
          <div className="transaction-header-row">
            <div>
              <Link className="text-link" to="/inbox">
                ← Back to inbox
              </Link>
              <h1 className="transaction-header">{pageTitle}</h1>
              <p className="transaction-subtitle">
                Review the transaction details, confirm the exchange, and submit your feedback.
              </p>
            </div>
            <span className={`status-badge status-${transaction.status.toLowerCase()}`}>
              {statusLabel}
            </span>
          </div>

          <div className="transaction-grid">
            <div className="transaction-summary">
              <div className="transaction-card">
                <div className="summary-card-header">
                  <div>
                    <p className="summary-label">Item</p>
                    <h2>{transaction.item_name}</h2>
                  </div>
                  <p className="summary-price">${Number(transaction.amount).toFixed(2)}</p>
                </div>

                <div className="transaction-meta-row">
                  <div>
                    <p className="summary-label">Date</p>
                    <p>{formattedDate}</p>
                  </div>
                  <div>
                    <p className="summary-label">Location</p>
                    <p>{transaction.exchange_location}</p>
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
                  <div className={"participant"}>
                    <img
                      src={sellerProfilePic}
                      alt={`${transaction.seller_name} profile`}
                      className={`profile-pic ${sellerConfirmed ? 'confirmed' : ''}`}
                    />
                    <p className="participant-name">
                      {isSeller ? 'You' : transaction.seller_name}
                    </p>
                    <p className="participant-role">Seller</p>
                  </div>
                  <div className="arrow">
                    ⇄
                  </div>
                  <div className={"participant"}>
                    <img
                      src={buyerProfilePic}
                      alt={`${transaction.buyer_name} profile`}
                      className={`profile-pic ${buyerConfirmed ? 'confirmed' : ''}`}
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
                    <p><strong>Confirmed location:</strong> {transaction.exchange_location}</p>
                  </div>

                  <div className="rating-section">
                    <h3>Rate the Other Participant</h3>
                    {isSeller && (
                      <div className="rating-item">
                        <label>Rate Buyer ({transaction.buyer_name}):</label>
                        <StarRating
                          rating={buyerRating}
                          onRatingChange={setBuyerRating}
                          disabled={completed || isCancelled}
                        />
                      </div>
                    )}
                    {isBuyer && (
                      <div className="rating-item">
                        <label>Rate Seller ({transaction.seller_name}):</label>
                        <StarRating
                          rating={sellerRating}
                          onRatingChange={setSellerRating}
                          disabled={completed || isCancelled}
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
                      disabled={completed || isCancelled}
                    />
                  </div>

                  <div className="confirmation-section">
                    <label>
                      <input
                        type="checkbox"
                        checked={confirmed}
                        onChange={(e) => setConfirmed(e.target.checked)}
                        disabled={completed || isCancelled}
                      />
                      I confirm this transaction was completed as described.
                    </label>
                  </div>

                  <div className="note">
                    <i>
                      Both parties must confirm to finalize the transaction status.
                    </i>
                  </div>

                  <button
                    className="complete-btn"
                    onClick={handleCompleteTransaction}
                    disabled={!confirmed || completed || isCancelled}
                  >
                    Complete Transaction
                  </button>
                  <button
                    className="cancel-btn"
                    onClick={handleCancelTransaction}
                    disabled={completed || isCancelled}
                  >
                    Cancel Transaction
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
