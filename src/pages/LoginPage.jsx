import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

function LoginPage() {
  const { isAuthenticated, login, profiles } = useAuth()

  if (isAuthenticated) {
    return <Navigate to="/" replace />
  }

  return (
    <main className="login-page">
      <section className="login-panel">
        <h1>Who is watching?</h1>
        <p>Select a profile to enter Hollywood Site.</p>

        <div className="profile-grid">
          {profiles.map((profile) => (
            <button
              key={profile.id}
              type="button"
              className="profile-card"
              onClick={() => login(profile.id)}
            >
              <span>{profile.avatar}</span>
              <strong>{profile.name}</strong>
            </button>
          ))}
        </div>
      </section>
    </main>
  )
}

export default LoginPage
