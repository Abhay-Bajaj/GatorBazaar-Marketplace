import { useEffect, useRef, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { mockItems } from './data/mockItems'

const CATEGORIES = [
  { value: '', label: 'All Categories' },
  { value: 'electronics', label: 'Electronics' },
  { value: 'books', label: 'Books' },
  { value: 'furniture', label: 'Furniture' },
  { value: 'clothing', label: 'Clothing' },
  { value: 'dorm-essentials', label: 'Dorm Essentials' },
  { value: 'sationary', label: 'Sationary' },
  { value: 'room-rent', label: 'Room/Rent' },
]

function searchMockItems(items, cat, q) {
  const normalizedQuery = q.trim().toLowerCase()
  const terms = normalizedQuery ? normalizedQuery.split(/\s+/) : []

  return items.filter((item) => {
    const categoryMatch = !cat || item.category === cat
    if (!categoryMatch) return false

    if (terms.length === 0) return true

    const haystack = `${item.title} ${item.description} ${item.category}`.toLowerCase()
    return terms.every((term) => haystack.includes(term))
  })
}

function ItemCard({ item }) {
  return (
    <Link to={`/items/${item.listing_id}`} className="item-card">
      <img
        className="item-card-image"
        src={item.image_url || '/images/item-placeholder.png'}
        alt={item.title}
      />
      <div className="item-card-body">
        <span className="item-card-category">{item.category}</span>
        <h3 className="item-card-title">{item.title}</h3>
        <p className="item-card-description">{item.description}</p>
        <p className="item-card-price">${Number(item.price || 0).toFixed(2)}</p>
      </div>
    </Link>
  )
}

export default function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const searchInputRef = useRef(null)

  // Form fields — initialized from URL so args persist after search
  const [category, setCategory] = useState(searchParams.get('category') ?? '')
  const [query, setQuery] = useState(searchParams.get('q') ?? '')

  const [results, setResults] = useState([])
  const [totalFound, setTotalFound] = useState(null) // null = not yet fetched
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // Re-run whenever URL search params change
  useEffect(() => {
    const urlCategory = searchParams.get('category') ?? ''
    const urlQuery = searchParams.get('q') ?? ''

    setCategory(urlCategory)
    setQuery(urlQuery)
    //fetchResults(urlCategory, urlQuery)
    fetchResults()
  }, [searchParams])

  async function fetchResults() {
    setLoading(true)
    setError(null)

    try {
      const res = await fetch('/api/search')

      const data = await res.json()

      if (!res.ok) throw new Error(data.error || `Server error (${res.status})`)

      setResults(data.items ?? [])
      setTotalFound(data.total ?? 0)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    } 
  }


  // if the API request fails, it resorts to the mock data
  /*async function fetchResults(cat, q) {
    setLoading(true)
    setError(null)

    const applyMockResults = () => {
      const filteredItems = searchMockItems(mockItems, cat, q)
      setResults(filteredItems)
      setTotalFound(filteredItems.length)
    }

    try {
      const params = new URLSearchParams()
      if (cat) params.set('category', cat)
      if (q) params.set('q', q)
      const res = await fetch(`/api/search?${params.toString()}`)
      if (!res.ok) throw new Error(`Server error (${res.status})`)
      const data = await res.json()
      setResults(data.items ?? [])
      setTotalFound(data.total ?? (data.items ?? []).length)
    } catch {
      applyMockResults()
    } finally {
      setLoading(false)
    }
  }*/

  function handleSearch(e) {
    e.preventDefault()
    const params = {}
    if (category) params.category = category
    if (query.trim()) params.q = query.trim()
    setSearchParams(params)
    searchInputRef.current?.focus()
  }

  function handleCategoryChange(e) {
    setCategory(e.target.value)
    searchInputRef.current?.focus()
  }

  return (
    <section className="banner search-page">
      {/* ── Search bar ── */}
      <form className="search-form" onSubmit={handleSearch} role="search">
        <select
          className="search-category"
          value={category}
          onChange={handleCategoryChange}
          aria-label="Category"
        >
          {CATEGORIES.map((c) => (
            <option key={c.value} value={c.value}>
              {c.label}
            </option>
          ))}
        </select>

        <input
          ref={searchInputRef}
          className="search-input"
          type="text"
          placeholder="Search items…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          aria-label="Search"
        />

        <button className="search-btn" type="submit">
          Search
        </button>
      </form>

      {/* ── Loading ── */}
      {loading && (
        <div className="search-loading">
          <span className="search-spinner" />
          Searching…
        </div>
      )}

      {/* ── Error ── */}
      {!loading && error && (
        <p className="search-error">⚠ Could not reach the server: {error}</p>
      )}

      {/* ── Results ── */}
      {!loading && !error && totalFound !== null && (
        <>
          <p className="search-count">
            {totalFound === 0
              ? 'No results found.'
              : `${totalFound} result${totalFound !== 1 ? 's' : ''}`}
          </p>

          {results.length > 0 && (
            <ul className="results-grid">
              {results.map((item) => (
                <li key={item.listing_id}>
                  <ItemCard item={item} />
                </li>
              ))}
            </ul>
          )}

          {totalFound === 0 && (
            <div className="search-empty">
              <p>Try a different keyword or browse all items by clearing the search.</p>
              <button
                className="search-btn"
                onClick={() => setSearchParams({})}
              >
                Show all items
              </button>
            </div>
          )}
        </>
      )}
    </section>
  )
}
