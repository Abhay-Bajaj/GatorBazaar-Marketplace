const SIDEBAR_CATEGORIES = ['All Listings', 'Clothes', 'Text Books', 'Furniture', 'Electronics', 'School Supplies', 'Room Search']
const STAR_RATINGS = [5, 4, 3, 2, 1]

export default function FiltersSidebar({ filters, onChange }) {
  return (
    <aside className="gb-filters">
      {/* Categories */}
      <div className="gb-filter-section">
        <h4 className="gb-filter-heading">Categories</h4>
        {SIDEBAR_CATEGORIES.map((cat) => (
          <label key={cat} className="gb-filter-label">
            <input
              type="checkbox"
              checked={filters.categories.includes(cat)}
              onChange={() => onChange('categories', cat)}
            />
            {cat}
          </label>
        ))}
      </div>

      {/* Price-Range */}
      <div className="gb-filter-section">
        <h4 className="gb-filter-heading">Price Range</h4>
        <div className="gb-price-range">
          <input
            className="gb-price-input"
            type="number"
            min="0"
            placeholder="Min"
            value={filters.priceMin}
            onChange={(e) => onChange('priceMin', e.target.value)}
            aria-label="Minimum price"
          />
          <span className="gb-price-sep">–</span>
          <input
            className="gb-price-input"
            type="number"
            min="0"
            placeholder="Max"
            value={filters.priceMax}
            onChange={(e) => onChange('priceMax', e.target.value)}
            aria-label="Maximum price"
          />
        </div>
      </div>

      {/* Rating */}
      <div className="gb-filter-section">
        <h4 className="gb-filter-heading">Rating</h4>
        {STAR_RATINGS.map((stars) => (
          <label key={stars} className="gb-filter-label">
            <input
              type="checkbox"
              checked={filters.ratings.includes(stars)}
              onChange={() => onChange('ratings', stars)}
            />
            <span className="gb-stars" aria-label={`${stars} stars`}>
              {'★'.repeat(stars)}
              {'☆'.repeat(5 - stars)}
            </span>
          </label>
        ))}
      </div>
    </aside>
  )
}
