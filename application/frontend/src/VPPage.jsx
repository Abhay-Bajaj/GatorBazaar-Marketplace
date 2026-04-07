import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'

const CATEGORIES = [
  { value: '', label: 'All Categories' },
  { value: 'electronics', label: 'Electronics' },
  { value: 'books', label: 'Books' },
  { value: 'furniture', label: 'Furniture' },
]

export default function VPPage() {
  const [searchParams, setSearchParams] = useSearchParams()

  // Controlled form state — initialised from URL so args persist after search
  const [category, setCategory] = useState(searchParams.get('category') ?? '')
  const [query, setQuery] = useState(searchParams.get('q') ?? '')

  // Results state
  const [results, setResults] = useState([])
  const [totalFound, setTotalFound] = useState(null) // null = not yet searched
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // Run a search whenever the URL search params change
  useEffect(() => {
    const urlCategory = searchParams.get('category') ?? ''
    const urlQuery = searchParams.get('q') ?? ''

    // Keep form fields in sync with URL
    setCategory(urlCategory)
    setQuery(urlQuery)

    fetchResults(urlCategory, urlQuery)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams.toString()])

  async function fetchResults(cat, q) {
    setLoading(true)
    setError(null)
    try {
      const params = new URLSearchParams()
      if (cat) params.set('category', cat)
      if (q) params.set('q', q)
      const res = await fetch(`/api/search?${params.toString()}`)
      if (!res.ok) throw new Error(`Server returned ${res.status}`)
      const data = await res.json()
      setResults(data.items ?? [])
      setTotalFound(data.total ?? (data.items ?? []).length)
    } catch (err) {
      setError(err.message)
      setResults([])
      setTotalFound(0)
    } finally {
      setLoading(false)
    }
  }

  function handleSearch(e) {
    e.preventDefault()
    // Push new search params into the URL – this triggers the useEffect above
    const params = {}
    if (category) params.category = category
    if (query) params.q = query
    setSearchParams(params)
  }

  return (
    <section className="banner vp-page">
      {/* ── Search bar ── */}
      <div className="vp-search-wrapper">
        <form className="vp-search-form" onSubmit={handleSearch} role="search">
          <select
            className="vp-category-select"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            aria-label="Category"
          >
            {CATEGORIES.map((c) => (
              <option key={c.value} value={c.value}>
                {c.label}
              </option>
            ))}
          </select>

          <input
            className="vp-search-input"
            type="text"
            placeholder="Search items…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            aria-label="Search"
          />

          <button className="vp-search-btn" type="submit">
            Search
          </button>
        </form>
      </div>

      {/* ── Results area ── */}
      {loading && <p className="vp-status">Searching…</p>}

      {error && (
        <p className="vp-status vp-error">
          Could not reach the server: {error}
        </p>
      )}

      {!loading && totalFound !== null && (
        <>
          <p className="vp-count">
            {totalFound === 0
              ? 'No results found.'
              : `${totalFound} result${totalFound !== 1 ? 's' : ''} found`}
          </p>

          <ul className="vp-results">
            {results.map((item) => (
              <li key={item.id} className="vp-item">
                <img
                  className="vp-item-image"
                  src={item.image_url || '/images/profile-placeholder.png'}
                  alt={item.title}
                />
                <div className="vp-item-body">
                  <h3 className="vp-item-title">{item.title}</h3>
                  <span className="vp-item-category">{item.category}</span>
                  <p className="vp-item-price">
                    ${Number(item.price).toFixed(2)}
                  </p>
                  <p className="vp-item-description">{item.description}</p>
                </div>
              </li>
            ))}
          </ul>
        </>
      )}
    </section>
  )
}
