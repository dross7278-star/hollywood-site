import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

function AppLayout() {
  const navigate = useNavigate()
  const { activeProfile, profiles, switchProfile, logout } = useAuth()

  return (
    <div className="app-shell">
      <header className="top-nav">
        <div className="logo">HOLLYWOOD SITE</div>

        <nav className="menu-links" aria-label="Main menu">
          <NavLink to="/">Home</NavLink>
          <NavLink to="/tv">TV Shows</NavLink>
          <NavLink to="/movies">Movies</NavLink>
          <NavLink to="/my-list">My List</NavLink>
        </nav>

        <div className="profile-chip">
          <button
            className="search-btn"
            type="button"
            aria-label="Search content"
            onClick={() => navigate('/search')}
          >
            Search
          </button>

          <select
            className="profile-select"
            aria-label="Switch profile"
            value={activeProfile.id}
            onChange={(event) => switchProfile(event.target.value)}
          >
            {profiles.map((profile) => (
              <option key={profile.id} value={profile.id}>
                {profile.name}
              </option>
            ))}
          </select>

          <div className="avatar" aria-hidden="true">
            {activeProfile.avatar}
          </div>

          <button type="button" className="logout-btn" onClick={logout}>
            Sign Out
          </button>
        </div>
      </header>

      <Outlet />

      <footer className="site-footer">
        <p>Questions? Contact us.</p>
        <div>
          <a href="#">Help Center</a>
          <a href="#">Terms of Use</a>
          <a href="#">Privacy</a>
          <a href="#">Cookie Preferences</a>
        </div>
      </footer>
    </div>
  )
}

export default AppLayout
