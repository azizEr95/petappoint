import { Link } from '@tanstack/react-router'
import { useAuthStore } from '../../stores/authStore'
import '../../styles/components/common/Header.scss'

export default function Header() {
  const { login, setLogin } = useAuthStore()

  return (
    <header className="header-clean">
      <div className="container">
        <nav className="nav-clean">
          <Link to="/" className="logo-clean">
            <span className="logo-icon">🐾</span>
            <span className="logo-text">vetlib</span>
          </Link>

          <div className="nav-links-clean">
            <Link to="/" className="nav-link-clean">
              Start
            </Link>
            {login ? (
              <>
                <Link to="/dashboard" className="nav-link-clean">
                  Dashboard
                </Link>
                <Link to="/appointments" className="nav-link-clean">
                  Termine
                </Link>
                <Link to="/animals" className="nav-link-clean">
                  Tiere
                </Link>
              </>
            ) : (
              <>
                <Link to="/" hash="how-it-works" className="nav-link-clean">
                  So funktioniert's
                </Link>
                <Link to="/" hash="for-vets" className="nav-link-clean">
                  Für Tierärzte
                </Link>
                <Link to="/" hash="contact" className="nav-link-clean">
                  Kontakt
                </Link>
              </>
            )}
          </div>

          <div className="nav-actions">
            {!login ? (
              <Link to="/login" className="btn btn-secondary btn-sm">
                Einloggen
              </Link>
            ) : (
              <Link
                to="/"
                className="btn btn-secondary btn-sm"
                onClick={() => setLogin(false)}
              >
                Ausloggen
              </Link>
            )}
          </div>
        </nav>
      </div>
    </header>
  )
}
