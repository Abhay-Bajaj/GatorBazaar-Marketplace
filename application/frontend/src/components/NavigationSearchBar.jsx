export default function NavigationSearchBar({
  query,
  onQueryChange,
  onSearch,
  onProfileClick,
  onSellClick = () => {},
  onMessagesClick = () => {},
  onFavoritesClick = () => {},
  logoText = 'GatorBazaar',
  placeholder = 'Enter Text Here',
  searchButtonText = 'Search',
  searchInputAriaLabel = 'Search items',
  autoFocus = true,
}) {
  return (
    <header className="gb-header">
      <div className="gb-header-inner">
        <span className="gb-logo">{logoText}</span>

        <form className="gb-search-form" onSubmit={onSearch} role="search">
          <input
            className="gb-search-input"
            type="text"
            placeholder={placeholder}
            value={query}
            onChange={(e) => onQueryChange(e.target.value)}
            aria-label={searchInputAriaLabel}
            autoFocus={autoFocus}
          />
          <button className="gb-search-btn" type="submit">
            {searchButtonText}
          </button>
        </form>

        
        <div className="gb-header-actions">
            {/* Sell Button */}
          <button className="gb-sell-btn" type="button" onClick={onSellClick}>
            Sell
          </button>

            {/* Message Button */}
          <button className="gb-icon-btn" type="button" aria-label="Messages" title="Messages" onClick={onMessagesClick}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="18" height="18">
              <rect x="2" y="4" width="20" height="16" rx="2" />
              <path d="M2 7l10 7 10-7" />
            </svg>
          </button>

            {/* Favourite Button */}
          <button className="gb-icon-btn" type="button" aria-label="Favorites" title="Favorites" onClick={onFavoritesClick}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="18" height="18">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
          </button>

            {/* Profile Button */}
          <button className="gb-icon-btn" type="button" aria-label="Profile" title="Profile" onClick={onProfileClick}>
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
