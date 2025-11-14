import { Link } from '@tanstack/react-router'
import { useAuthStore } from '../stores/authStore'
import styles from '../styles/header.modules.css'

export default function Header() {
  const { login, setLogin } = useAuthStore()

  return (
    <header className={styles.headerClean}>
      <div className="container">
        <nav className={styles.navClean}>
          <Link to="/" className={styles.logoClean}>
            <span className={styles.logoIcon}>🐾</span>
            <span className={styles.logoText}>vetlib</span>
          </Link>

          <div className={styles.navLinksClean}>
            <Link to="/" className={styles.navLinkClean}>
              Start
            </Link>
            <a href="#how-it-works" className={styles.navLinkClean}>
              So funktioniert's
            </a>
            <a href="#for-vets" className={styles.navLinkClean}>
              Für Tierärzte
            </a>
            <a href="#contact" className={styles.navLinkClean}>
              Kontakt
            </a>
          </div>

          <div className={styles.navActions}>
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
