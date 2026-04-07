import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'

export default function ItemPage() {
  const { id } = useParams()
  const [item, setItem] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`/api/items/${id}`)
        if (!res.ok) throw new Error(`Item not found (${res.status})`)
        setItem(await res.json())
      } catch (err) {
        setError(err.message)
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
          <span className="item-card-category">{item.category}</span>
          <h2 className="item-detail-title">{item.title}</h2>
          <p className="item-detail-price">
            ${Number(item.price || 0).toFixed(2)}
          </p>
          <p className="item-detail-description">{item.description}</p>
        </div>
      </div>
    </section>
  )
}
