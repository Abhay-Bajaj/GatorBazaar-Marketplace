import './skeletonLoaders.css'

/* ─────────────────────────────────────────
   Shared shimmer base — all skeletons use
   the .skeleton class + .skeleton-* shapes
───────────────────────────────────────── */

// ── Home Page ──────────────────────────────────────────────────────────────

export function HomePageSkeleton() {
  return (
    <div className="homepage">
      {/* Category pills */}
      <div className="category-list">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="skeleton skeleton-category-btn" />
        ))}
      </div>

      {/* Recently Added */}
      <section>
        <div className="skeleton skeleton-section-heading" />
        <div className="recent-items">
          {[...Array(5)].map((_, i) => (
            <ItemCardSkeleton key={i} />
          ))}
        </div>
      </section>

      {/* Recently Viewed */}
      <section>
        <div className="skeleton skeleton-section-heading" />
        <div className="recent-items">
          {[...Array(5)].map((_, i) => (
            <ItemCardSkeleton key={i} />
          ))}
        </div>
      </section>
    </div>
  )
}

function ItemCardSkeleton() {
  return (
    <div className="item-card skeleton-card">
      <div className="skeleton skeleton-card-image" />
      <div className="item-card-body">
        <div className="skeleton skeleton-text-xs" style={{ width: '50%' }} />
        <div className="skeleton skeleton-text-md" style={{ width: '80%' }} />
        <div className="skeleton skeleton-text-sm" style={{ width: '100%' }} />
        <div className="skeleton skeleton-text-sm" style={{ width: '70%' }} />
        <div className="skeleton skeleton-text-md" style={{ width: '35%', marginTop: 4 }} />
      </div>
    </div>
  )
}

// ── Search Page ────────────────────────────────────────────────────────────

export function SearchPageSkeleton() {
  return (
    <div className="search-page">
      {/* Subheader */}
      <div className="gb-subheader">
        <div className="skeleton skeleton-back-btn" />
        <div className="skeleton skeleton-text-sm" style={{ width: 140 }} />
      </div>

      {/* Sort row */}
      <div style={{ padding: '0 1rem', marginBottom: '0.5rem' }}>
        <div className="skeleton skeleton-text-sm" style={{ width: 120 }} />
      </div>

      <div className="main-layout">
        {/* Filters sidebar */}
        <div className="gb-filters">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="gb-filter-section">
              <div className="skeleton skeleton-text-xs" style={{ width: '60%', marginBottom: 10 }} />
              {[...Array(4)].map((_, j) => (
                <div key={j} className="skeleton skeleton-text-sm" style={{ width: `${65 + j * 8}%`, marginBottom: 8 }} />
              ))}
            </div>
          ))}
        </div>

        {/* Listings grid */}
        <div className="gb-listings-grid">
          {[...Array(12)].map((_, i) => (
            <SearchCardSkeleton key={i} />
          ))}
        </div>
      </div>
    </div>
  )
}

function SearchCardSkeleton() {
  return (
    <div className="gb-listing-card skeleton-card">
      <div className="skeleton skeleton-card-image-search" />
      <div className="gb-card-footer" style={{ flexDirection: 'column', gap: 8 }}>
        <div className="skeleton skeleton-text-sm" style={{ width: '80%' }} />
        <div className="skeleton skeleton-text-sm" style={{ width: '40%' }} />
      </div>
    </div>
  )
}

// ── Item Page ──────────────────────────────────────────────────────────────

export function ItemPageSkeleton() {
  return (
    <section className="banner item-detail">
      <div className="skeleton skeleton-back-btn" style={{ marginBottom: 16 }} />

      <div className="item-page-grid">
        {/* Image gallery */}
        <div className="item-images-gallery">
          <div className="item-images-container">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="skeleton skeleton-thumb" />
            ))}
          </div>
          <div className="skeleton skeleton-item-main-image" />
        </div>

        {/* Detail body */}
        <div className="item-detail-body">
          <div className="skeleton skeleton-text-xs" style={{ width: 80 }} />
          <div className="skeleton skeleton-text-lg" style={{ width: '75%' }} />
          <div className="skeleton skeleton-text-lg" style={{ width: '30%' }} />
          <div className="skeleton skeleton-text-sm" style={{ width: '100%' }} />
          <div className="skeleton skeleton-text-sm" style={{ width: '90%' }} />
          <div className="skeleton skeleton-text-sm" style={{ width: '80%' }} />
        </div>

        {/* Seller info */}
        <div className="item-seller-info">
          <div className="seller-name" style={{ gap: 12 }}>
            <div className="skeleton skeleton-seller-avatar" />
            <div className="skeleton skeleton-text-md" style={{ width: 100 }} />
          </div>
          <div style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div className="skeleton skeleton-text-sm" style={{ width: '70%' }} />
            <div className="skeleton skeleton-input" />
            <div className="skeleton skeleton-btn" />
          </div>
        </div>
      </div>
    </section>
  )
}

// ── Inbox Page ─────────────────────────────────────────────────────────────

export function InboxSkeleton() {
  return (
    <section className="banner-inbox">
      <div className="skeleton skeleton-back-btn" style={{ marginBottom: 16 }} />

      <div className="inbox-grid">
        {/* Conversation list */}
        <div className="inbox-messages">
          <div
            style={{
              padding: '16px',
              borderBottom: '1px solid #e2ddd6',
              position: 'sticky',
              top: 0,
              background: '#fbfaf7',
            }}
          >
            <div className="skeleton skeleton-text-md" style={{ width: 100 }} />
          </div>

          {[...Array(5)].map((_, i) => (
            <ConversationCardSkeleton key={i} />
          ))}
        </div>

        {/* Chat panel */}
        <div className="inbox-chat">
          {/* Chat header */}
          <div className="chat-header">
            <div className="skeleton skeleton-chat-image" />
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
              <div className="skeleton skeleton-text-md" style={{ width: '60%' }} />
              <div className="skeleton skeleton-text-sm" style={{ width: '40%' }} />
              <div className="skeleton skeleton-text-sm" style={{ width: '25%' }} />
            </div>
          </div>

          {/* Messages */}
          <div className="messages-container">
            <MessageSkeleton align="flex-start" width="55%" />
            <MessageSkeleton align="flex-end" width="40%" />
            <MessageSkeleton align="flex-start" width="65%" />
            <MessageSkeleton align="flex-end" width="50%" />
            <MessageSkeleton align="flex-start" width="45%" />
          </div>

          {/* Input */}
          <div className="message-input-area">
            <div className="skeleton skeleton-msg-input" />
            <div className="skeleton skeleton-send-btn" />
          </div>
        </div>
      </div>
    </section>
  )
}

function ConversationCardSkeleton() {
  return (
    <div className="conversation-card" style={{ pointerEvents: 'none' }}>
      <div className="skeleton skeleton-conv-image" />
      <div className="conversation-info">
        <div className="skeleton skeleton-text-sm" style={{ width: '70%', marginBottom: 6 }} />
        <div className="skeleton skeleton-text-xs" style={{ width: '90%' }} />
      </div>
    </div>
  )
}

function MessageSkeleton({ align, width }) {
  return (
    <div className="message" style={{ alignSelf: align, maxWidth: '70%', width }}>
      <div
        className="skeleton"
        style={{
          height: 38,
          borderRadius: 8,
          width: '100%',
        }}
      />
      <div
        className="skeleton skeleton-text-xs"
        style={{ width: 50, marginTop: 4, alignSelf: align === 'flex-end' ? 'flex-end' : 'flex-start' }}
      />
    </div>
  )
}

// ── Create Listing Page ────────────────────────────────────────────────────

export function CreateListingSkeleton() {
  return (
    <div className="create-listing__container">
      <div className="skeleton skeleton-text-lg" style={{ width: 200, marginBottom: 16 }} />

      <div className="create-listing__layout">
        {/* Form */}
        <div className="form">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="form__section">
              <div className="skeleton skeleton-text-xs" style={{ width: 80, marginBottom: 4 }} />
              <div className={`skeleton ${i === 2 ? 'skeleton-textarea' : 'skeleton-input'}`} />
            </div>
          ))}
          <div className="skeleton skeleton-submit-btn" style={{ marginTop: 10 }} />
        </div>
      </div>
    </div>
  )
}

// ── Navigation Bar ─────────────────────────────────────────────────────────

export function NavBarSkeleton() {
  return (
    <header className="gb-header">
      <div className="gb-header-inner">
        {/* Logo */}
        <div className="skeleton skeleton-nav-logo" />

        {/* Search bar */}
        <div className="skeleton skeleton-nav-search" />

        {/* Action buttons */}
        <div className="gb-header-actions">
          <div className="skeleton skeleton-nav-sell-btn" />
          <div className="skeleton skeleton-nav-icon-btn" />
          <div className="skeleton skeleton-nav-icon-btn" />
          <div className="skeleton skeleton-nav-icon-btn" />
        </div>
      </div>
    </header>
  )
}
