import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import Header from './components/Header'
import SubHeader from './components/SubHeader'
import FiltersSidebar from './components/FiltersSidebar'
import ListingsGrid from './components/ListingsGrid'
import { mockItems } from './data/mockItems'

function searchMockItems(items, q) {
  const normalizedQuery = q.trim().toLowerCase()
  const terms = normalizedQuery ? normalizedQuery.split(/\s+/) : []

  return items.filter((item) => {
    if (terms.length === 0) return true
    const haystack =
      `${item.title} ${item.description || ''} ${item.category || ''} 
       ${item.category_name || ''}`.toLowerCase()
    return terms.every((term) => haystack.includes(term))
  })
}

function toListingFormat(items) {
  return items.map((item) => ({
    id: item.listing_id || item.id,
    title: item.title,
    price: item.price,
    image: item.image_url || 'placeholder',
    isFavorited: false,
    category: (item.category_name || item.category || '').toLowerCase(),
  }))
}

function applyFilters(listings, filters) {
  return listings.filter((listing) => {
    // Category filter
    const hasAllListings =
      filters.categories.includes('All Listings') || filters.categories.length === 0
    if (!hasAllListings) {
      const cat = listing.category
      const matches = filters.categories.some((filterCat) => {
        if (filterCat === 'Clothes') return cat === 'clothes'
        if (filterCat === 'Text Books') return cat === 'textbooks'
        if (filterCat === 'Furniture') return cat === 'furniture'
        if (filterCat === 'Electronics') return cat === 'electronics'
        if (filterCat === 'School Supplies') return cat === 'school supplies'
        if (filterCat === 'Room Search') return cat === 'room search'
        return true
      })
      if (!matches) return false
    }

    // Price filter
    const price = Number(listing.price || 0)
    if (filters.priceMin !== '' && price < Number(filters.priceMin)) return false
    if (filters.priceMax !== '' && price > Number(filters.priceMax)) return false

    return true
  })
}

export default function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const navigate = useNavigate()

  const [query, setQuery] = useState(searchParams.get('q') ?? '')

  const [listings, setListings] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const [filters, setFilters] = useState({
    categories: ['All Listings'],
    priceMin: '',
    priceMax: '',
    ratings: [],
  })

  /* Re-run whenever URL search params change */
  useEffect(() => {
    const urlQuery = searchParams.get('q') ?? ''
    setQuery(urlQuery)
    fetchResults(urlQuery)
  }, [searchParams])

  /* if API request fails, it resorts to mock data */
  async function fetchResults(q = '') {
    setLoading(true)
    setError(null)

    const applyMockResults = () => {
      const filtered = searchMockItems(mockItems, q)
      const formatted = toListingFormat(filtered)
      setListings(formatted)
    }

    try {
      const params = new URLSearchParams()
      if (q) params.set('keyword', q)

      const res = await fetch(`/api/search?${params.toString()}`)
      const data = await res.json()

      if (!res.ok) throw new Error(data.error || `Server error (${res.status})`)

      const items = Array.isArray(data) ? data : (data.items ?? [])

      const formatted = toListingFormat(items)
      setListings(formatted)
    } catch (err) {
      console.error(err)
      applyMockResults()
    } finally {
      setLoading(false)
    }
  }
/* Section above part of Mock Tests */


  function handleSearch(e) {
    e.preventDefault()
    const params = {}
    if (query.trim()) params.q = query.trim()
    setSearchParams(params)
  }

  function handleFilterChange(type, value) {
    setFilters((prev) => {
      if (type === 'categories') {
        if (value === 'All Listings') {
          return { ...prev, categories: ['All Listings'] }
        }
        const next = prev.categories.filter((c) => c !== 'All Listings')
        const idx = next.indexOf(value)
        const updated = idx === -1 ? [...next, value] : next.filter((c) => c !== value)
        return { ...prev, categories: updated.length === 0 ? ['All Listings'] : updated }
      }
      if (type === 'ratings') {
        const idx = prev.ratings.indexOf(value)
        return {
          ...prev,
          ratings: idx === -1 ? [...prev.ratings, value] : prev.ratings.filter((r) => r !== value),
        }
      }
      return { ...prev, [type]: value }
    })
  }

  function handleToggleFavorite(id) {
    setListings((prev) =>
      prev.map((item) => (item.id === id ? { ...item, isFavorited: !item.isFavorited } : item))
    )
  }

  const displayedListings = applyFilters(listings, filters)
  const urlQuery = searchParams.get('q') ?? ''

  return (
    <div className="search-page">
      <Header query={query} setQuery={setQuery} onSearch={handleSearch} />

      <SubHeader
        query={urlQuery}
        count={loading ? null : displayedListings.length}
        onBack={() => navigate(-1)}
      />

      <div className="main-layout">
        <FiltersSidebar filters={filters} onChange={handleFilterChange} />
        <ListingsGrid
          listings={displayedListings}
          loading={loading}
          error={error}
          onToggleFavorite={handleToggleFavorite}
        />
      </div>
    </div>
  )
}
