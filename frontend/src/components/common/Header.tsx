import { Link } from '@tanstack/react-router'
import '../../styles/components/common/Header.scss'
import { useMutation } from '@tanstack/react-query'
import { useLoginContext } from '../../LoginContext'
import { logoutUser } from '../../api/LoginAPI'

export default function Header() {
  const { login, setLogin } = useLoginContext()

  const { mutate: mutateLogout } = useMutation({
    mutationFn: () => logoutUser(),
    onError: () => {
      console.log('Ausloggen gescheitert')
    },
    onSuccess: () => {
      setLogin(false)
    },
  })

  let linksHeader = <></>;
  if (login && login.role === 'person') {
    linksHeader = <>
      <Link to="/dashboard" className="nav-link-clean">
        Dashboard
      </Link>
      <Link to="/appointments" className="nav-link-clean">
        Termine
      </Link>
      <Link to="/animals" className="nav-link-clean">
        Tiere
      </Link>
    </>;
  } else if (login && login.role === 'company') {
    linksHeader = <>
      <Link to="/dashboard" className="nav-link-clean">
        Dashboard
      </Link>
    </>;
  } else {
    linksHeader = <>
      <Link to="/" hash="how-it-works" className="nav-link-clean">
        So funktioniert's
      </Link>
      <Link to="/" hash="for-vets" className="nav-link-clean">
        Für Tierärzte
      </Link>
      <Link to="/" hash="contact" className="nav-link-clean">
        Kontakt
      </Link>
    </>;
  }

  return (
    <header className="header-clean">
      <div className="container">
        <nav className="nav-clean">
          <Link to="/" className="logo-clean">
            <span className="logo-icon">🐾</span>
            <span className="logo-text">VetiLib</span>
          </Link>

          <div className="nav-links-clean">
            {linksHeader}
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
                onClick={() => mutateLogout()}
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