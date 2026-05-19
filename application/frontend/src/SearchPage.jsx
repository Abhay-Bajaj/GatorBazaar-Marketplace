import { useEffect, useState, useMemo } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import NavigationSearchBar from './components/NavigationSearchBar'
import SubHeader from './components/SubHeader'
import FiltersSidebar from './components/FiltersSidebar'
import ListingsGrid from './components/ListingsGrid'
import LoginModal from './components/LoginModal'
import { addFavorite, removeFavorite } from './api/favoritesAPI'
import './searchPage.css'
// skeletons are rendered locally inside components to avoid full-page remounts
import useAuthStatus from "./hooks/useAuthStatus"
import useAccountNavigation from "./hooks/useAccountNavigation"
import { mockItems } from './data/mockItems'

function categoriesFromParams(searchParams) {
  const cats = searchParams.getAll('category')
  if (cats.length === 0) return ['All Listings']
  return cats
}

function toListingFormat(items) {
  return items.map((item) => ({
    id: item.listing_id ?? item.id,
    title: item.title,
    price: item.price,
    image: item.image_url || 'placeholder',
    isFavorited: item.isFavorited,
    isOwner: item.isOwner,
    category_name: item.category_name ?? item.category ?? '',
    rating: item.rating ?? null,
  }))
}

function useDebouncedPrices(priceMin, priceMax, delayMs) {
  const [debounced, setDebounced] = useState({ priceMin, priceMax })
  useEffect(() => {
    const id = setTimeout(() => setDebounced({ priceMin, priceMax }), delayMs)
    return () => clearTimeout(id)
  }, [priceMin, priceMax, delayMs])
  return debounced
}

export default function SearchPage() {
  const { isSignedIn } = useAuthStatus()
  const [searchParams, setSearchParams] = useSearchParams()
  const navigate = useNavigate()

  const [query, setQuery] = useState(searchParams.get('q') ?? '')
  const [loginModalOpen, setLoginModalOpen] = useState(false)

  const { handleAccountClick } = useAccountNavigation({ isSignedIn, setLoginModalOpen })

  const [listings, setListings] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const [filters, setFilters] = useState({
    priceMin: '',
    priceMax: '',
  })

  const debouncedPrices = useDebouncedPrices(filters.priceMin, filters.priceMax, 400)

  const categoriesFromUrl = useMemo(() => categoriesFromParams(searchParams), [searchParams])

  useEffect(() => {
    setQuery(searchParams.get('q') ?? '')
  }, [searchParams])

  useEffect(() => {
    let cancelled = false

    // Temporary: use mockItems for local testing of search results and skeletons.
    // This simulates a short network delay and applies basic filters from URL params.
    setLoading(true)
    setError(null)

    const t = setTimeout(() => {
      if (cancelled) return

      try {
        const keyword = (searchParams.get('q') ?? '').toLowerCase().trim()
        const categories = searchParams.getAll('category')
        const sort = searchParams.get('sort') ?? ''

        const priceMin = debouncedPrices.priceMin !== '' ? Number(debouncedPrices.priceMin) : null
        const priceMax = debouncedPrices.priceMax !== '' ? Number(debouncedPrices.priceMax) : null

        let items = mockItems.slice()

        if (keyword) {
          items = items.filter((it) => it.title.toLowerCase().includes(keyword) || (it.description || '').toLowerCase().includes(keyword))
        }

        if (categories.length > 0 && !(categories.length === 1 && categories[0] === 'All Listings')) {
          items = items.filter((it) => categories.includes(it.category))
        }

        if (priceMin !== null) items = items.filter((it) => Number(it.price || 0) >= priceMin)
        if (priceMax !== null) items = items.filter((it) => Number(it.price || 0) <= priceMax)

        if (sort === 'price_low') items.sort((a, b) => (a.price || 0) - (b.price || 0))
        if (sort === 'price_high') items.sort((a, b) => (b.price || 0) - (a.price || 0))

        setListings(toListingFormat(items))
      } catch (err) {
        console.error(err)
        setError('Search failed (mock)')
        setListings([])
      } finally {
        if (!cancelled) setLoading(false)
      }
    }, 700)

    return () => {
      cancelled = true
      clearTimeout(t)
    }
  }, [searchParams, debouncedPrices])

  function handleSearch(e) {
    e.preventDefault()
    const next = new URLSearchParams(searchParams)
    const trimmed = query.trim()
    if (trimmed) next.set('q', trimmed)
    else next.delete('q')
    setSearchParams(next)
  }

  function handleFilterChange(type, value) {
    if (type === 'categories') {
      const next = new URLSearchParams(searchParams)
      next.delete('category')

      if (value === 'All Listings') {
        setSearchParams(next)
        return
      }

      let selected = searchParams.getAll('category')
      const hadAll = selected.length === 0

      if (hadAll) {
        selected = [value]
      } else if (selected.includes(value)) {
        selected = selected.filter((c) => c !== value)
      } else {
        selected = [...selected, value]
      }

      if (selected.length === 0) {
        setSearchParams(next)
        return
      }

      selected.forEach((c) => next.append('category', c))
      setSearchParams(next)
      return
    }

    if (type === 'priceMin' || type === 'priceMax') {
      setFilters((prev) => ({ ...prev, [type]: value }))
    }
  }

  function handleSortChange(e) {
    const next = new URLSearchParams(searchParams)
    const v = e.target.value
    if (v) next.set('sort', v)
    else next.delete('sort')
    setSearchParams(next)
  }

  async function handleToggleFavorite(id) {
    const listing = listings.find((item) => item.id === id)
    if (!listing) return

    const nextIsFavorited = !listing.isFavorited

    try {
      if (nextIsFavorited) {
        await addFavorite(id)
      } else {
        await removeFavorite(id)
      }
  
      setListings((prev) =>
        prev.map((item) => (item.id === id ? { ...item, isFavorited: nextIsFavorited } : item))
      )

    } catch (err) {
      console.log(err)
    }
  }

  const sidebarFilters = {
    categories: categoriesFromUrl,
    priceMin: filters.priceMin,
    priceMax: filters.priceMax,
  }

  const urlQuery = searchParams.get('q') ?? ''

  // Always render the page shell. Show loading state inside the listings grid
  // to avoid unmounting the entire page (prevents skeleton flicker when filters change).
  return (
    <div className="search-page">
      <NavigationSearchBar
        query={query}
        onQueryChange={setQuery}
        onSearch={handleSearch}
        onMessagesClick={() => navigate('/inbox')}
        onProfileClick={handleAccountClick}
        onFavoritesClick={() => navigate('/favorites')}
        onSellClick={() => navigate('/create-listing')}
      />

      <SubHeader
        query={urlQuery}
        count={loading ? null : listings.length}
        onBack={() => navigate('/')}
      />

      <div className="gb-sort-row" style={{ padding: '0 1rem', marginBottom: '0.5rem' }}>
        <label htmlFor="search-sort" style={{ marginRight: '0.5rem' }}>
          Sort by
        </label>
        <select
          id="search-sort"
          value={searchParams.get('sort') ?? ''}
          onChange={handleSortChange}
        >
          <option value=""> Newest first</option>
          <option value="price_low">Price: Low to High</option>
          <option value="price_high">Price: High to Low</option>
          
          {/* Rating options added for sorting */}
          <option value="rating_low">Rating: Low to High</option>
          <option value="rating_high">Rating: High to Low</option>
        </select>
      </div>

      <div className="main-layout">
        <FiltersSidebar filters={sidebarFilters} onChange={handleFilterChange} />
        <ListingsGrid
          listings={listings}
          loading={loading}
          error={error}
          onToggleFavorite={handleToggleFavorite}
        />
      </div>

      {loginModalOpen && <LoginModal onClose={() => setLoginModalOpen(false)} />}
    </div>
  )
}
