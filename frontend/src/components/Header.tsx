import { Link } from '@tanstack/react-router'
import { useAuthStore } from '../stores/authStore'

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
            <a href="#how-it-works" className="nav-link-clean">
              So funktioniert's
            </a>
            <a href="#for-vets" className="nav-link-clean">
              Für Tierärzte
            </a>
            <a href="#contact" className="nav-link-clean">
              Kontakt
            </a>
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

      <style>{`
        .header-clean {
          background: white;
          box-shadow: var(--shadow-sm);
          position: sticky;
          top: 0;
          z-index: 1000;
          padding: 1rem 0;
        }

        .nav-clean {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 2rem;
        }

        .logo-clean {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          text-decoration: none;
          font-size: 1.5rem;
          font-weight: 700;
          color: var(--color-primary);
        }

        .logo-icon {
          font-size: 1.8rem;
        }

        .nav-links-clean {
          display: flex;
          gap: 2rem;
          flex: 1;
          justify-content: center;
        }

        .nav-link-clean {
          text-decoration: none;
          color: var(--color-primary);
          font-weight: 500;
          transition: color 0.3s;
        }

        .nav-link-clean:hover {
          color: var(--color-primary-dark);
        }

        .nav-actions {
          display: flex;
          gap: 1rem;
        }

        @media (max-width: 768px) {
          .nav-links-clean {
            display: none;
          }

          .logo-text {
            font-size: 1.3rem;
          }
        }
      `}</style>
    </header>
  )
}
