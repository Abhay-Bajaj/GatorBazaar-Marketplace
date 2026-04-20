export default function Header({ query, setQuery, onSearch }) {
  return (
    <header className="gb-header">
      <div className="gb-header-inner">
        <span className="gb-logo">GatorBazaar</span>

        <form className="gb-search-form" onSubmit={onSearch} role="search">
          <input
            className="gb-search-input"
            type="text"
            placeholder="Enter Text Here"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            aria-label="Search items"
          />
          <button className="gb-search-btn" type="submit">
            Search
          </button>
        </form>

        <div className="gb-header-actions">
          <button className="gb-sell-btn" type="button">
            Sell
          </button>

          <button className="gb-icon-btn" type="button" aria-label="Messages" title="Messages">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="18" height="18">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
          </button>

          <button className="gb-icon-btn" type="button" aria-label="Favorites" title="Favorites">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="18" height="18">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
          </button>

          <button className="gb-icon-btn" type="button" aria-label="Notifications" title="Notifications">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="18" height="18">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
              <path d="M13.73 21a2 2 0 0 1-3.46 0" />
            </svg>
          </button>

          <button className="gb-icon-btn" type="button" aria-label="Profile" title="Profile">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="18" height="18">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          </button>
        </div>
      </div>
    </header>
  )
}
