import { Link, Route, Routes, useLocation, useParams, useNavigate } from 'react-router-dom'
import './App.css'
import './login.css'
import { teamMembers } from './data/teamMembers'
import SearchPage from './SearchPage'
import ItemPage from './ItemPage'
import TransactionPage from './TransactionPage'
import Inbox from './inbox'
import HomePage from './HomePage'
import Dashboard from './dashboard'
import Favorite from './favorite'
import CreateListing from './CreateListing'
import AccountPage from "./AccountPage";
import NavigationSearchBar from './components/NavigationSearchBar'
import { useMemo, useState } from 'react'
import LoginModal from './components/LoginModal'
import Footer from './components/Footer'

function TeamMembers() {
  const navigate = useNavigate()
  const [query, setQuery] = useState('')
  const [loginModalOpen, setLoginModalOpen] = useState(false)


  const handleSearch = (event) => {
    event.preventDefault()
    const params = new URLSearchParams()
    if (query.trim()) params.set('q', query.trim())
    navigate(`/search?${params.toString()}`)
  }

  return (
    <div className="team-members-page">
    <section className="banner">
      <header className="banner-header">
        <h2>Team Members</h2>
      </header>

      <div className="team-members">
        {teamMembers.map((member) => (
          <Link key={member.slug} to={`/team/${member.slug}`} className="member">
            <img
              src={member.image}
              alt={member.name}
              className="member-photo"
            />
            <h3>{member.name}</h3>
          </Link>
        ))}
      </div>
    </section>
    {loginModalOpen && <LoginModal onClose={() => setLoginModalOpen(false)} />}
    </div>
  )
}

function MemberProfile() {
  const navigate = useNavigate()
  const [query, setQuery] = useState('')
  const [loginModalOpen, setLoginModalOpen] = useState(false)


  const handleSearch = (event) => {
    event.preventDefault()
    const params = new URLSearchParams()
    if (query.trim()) params.set('q', query.trim())
    navigate(`/search?${params.toString()}`)
  }

  const { slug } = useParams()
  const member = teamMembers.find((entry) => entry.slug === slug)

  if (!member) {
    return (
      <section className="banner">
        <header className="banner-header">
          <h2>Member Not Found</h2>
        </header>
        <p>We could not find that profile. Please return to the team list.</p>
        <Link className="text-link" to="/">
          Back to team members
        </Link>
      </section>
    )
  }

  return (
    <div className="member-page">

      <NavigationSearchBar
        query={query}
        onQueryChange={setQuery}
        onSearch={handleSearch}
        onSellClick={() => navigate('/create-listing')}
        onMessagesClick={() => navigate('/inbox')}
        onFavoritesClick={() => navigate('/favorite')}
        onProfileClick={() => setLoginModalOpen(true)}
        placeholder="Search marketplace items"
        searchButtonText="Search"
      />
    <section className="banner">


      <div className="member-profile">
        <img
          src={member.image}
          alt={member.name}
          className="profile-picture"
        />

        <div className="member-info">
          <h2>{member.name}</h2>
          <h3>{member.role}</h3>
          {member.bio.map((paragraph, index) => (
            <p key={`${member.slug}-${index}`}>{paragraph}</p>
          ))}
        </div>
      </div>
    </section>
    {loginModalOpen && <LoginModal onClose={() => setLoginModalOpen(false)} />}
    </div>
  )
}

function App() {
  const location = useLocation()
  const isHome = location.pathname === '/'
  const isTeamMembers = location.pathname.startsWith('/teamMembers')

  return (
    <>
    <div className="page">
      <nav className="site-nav">
        <div className="site-nav-inner">
          <Link to="/">
           
          </Link>
          <div className="site-nav-body">
            <h1>
              SFSU Software Engineering Project CSC 648-848, Spring 2026.
              <br />
              For Demonstration Only
            </h1>

            <p>Section 01, Team 07</p>

              {!isTeamMembers && (
                <p className="vp-nav-subtitle">Browse and Search our Item Catalog</p>
              )}

              <Link to="/" className="site-nav-dashboard-link" aria-label="Home">
                <img
                  className="site-nav-brand-icon site-nav-dashboard-icon"
                  src="/images/Icon.png"
                  alt="Home Logo"
                  width={68}
                  height={68}
                  decoding="async"
                />
              </Link>
          </div>
        </div>
      </nav>

      <main>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/create-listing" element={<CreateListing />} />
          <Route path="/team/:slug" element={<MemberProfile />} />
          <Route path="/teamMembers" element={<TeamMembers />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/items/:id" element={<ItemPage />} />
          <Route path="/complete-transaction" element={<TransactionPage />} />
          <Route path="/inbox" element={<Inbox />} />
          <Route path="/favorite" element={<Favorite />} />
          <Route path="/account" element={<AccountPage />} />
        </Routes>
      </main>
    </div>
    <footer>
      <Footer />
    </footer>
    </>
  )
}

export default App