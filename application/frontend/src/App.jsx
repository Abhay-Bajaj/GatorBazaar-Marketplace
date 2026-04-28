import { Link, Route, Routes, useLocation, useParams } from 'react-router-dom'
import './App.css'
import { teamMembers } from './data/teamMembers'
import SearchPage from './SearchPage'
import ItemPage from './ItemPage'
import TransactionPage from './TransactionPage'
import Inbox from './inbox'
import HomePage from './HomePage'
import LoginPage from './LoginPage'
import Dashboard from './dashboard'
import CreateListing from './CreateListing'

function TeamMembers() {
  return (
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
  )
}

function MemberProfile() {
  const { slug } = useParams()
  const member = teamMembers.find((entry) => entry.slug === slug)

  // handle case: missing member
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
  )
}

function App() {
  const location = useLocation()
  const isHome = location.pathname === '/'
  const isTeamMembers = location.pathname.startsWith('/teamMembers')
  const isLogin = location.pathname === '/login'

  if (isLogin) {
    return (
      <Routes>
        <Route path="/login" element={<LoginPage />} />
      </Routes>
    )
  }

  return (
    <div className="page">
      <nav className="site-nav">
        {!isTeamMembers && (
          <Link className="team-button" to="/teamMembers">
            ← Team Members
          </Link>
        )}
        <h1>
          SFSU Software Engineering Project CSC 648-848, Spring 2026.
          <br />
          For Demonstration Only
        </h1>
        <p>Section 01, Team 07</p>
        {isTeamMembers && (
          <>
            <Link className="vp-nav-link" to="/">
              🔍 Browse &amp; Search
            </Link>
            <Link className="vp-nav-link" to="/dashboard">
              📊 Dashboard
            </Link>
          </>
        )}
        {isHome && (
          <p className="vp-nav-subtitle"> Browse and Search our Item Catalog</p>
        )}
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
        </Routes>
      </main>
    </div>
  )
}

export default App
