import { createFileRoute, useNavigate } from '@tanstack/react-router'
import '../../styles/routes/_auth-shared.scss'
import { useEffect } from 'react'
import { useLoginContext } from '../../LoginContext'
import { EmailVerificationCode } from '../../components/registration/EmailVerificationCode'

export const Route = createFileRoute('/registration/verify-email')({
  component: PendingConfirmation,
})

function PendingConfirmation() {
  const navigate = useNavigate();
  const { login } = useLoginContext();
  // const location = useLocation();
  // const user = location.state.person;
  // const appointment = location.state.appointment;
  

  useEffect(() => { // if not verified go to start
    if(login !== false && login.verified) {
      navigate({ to: '/dashboard' });
    } else if(login === false){
      navigate({ to: '/' });
    }
  },[login]);

  // const handleChangeEmail = () => {
  //   console.log('not implemented yet')
  // }

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-card">
          <h1 className="auth-title">Bestätige deine E-Mail-Adresse</h1>

          {/* TODO: Feature folgt noch, noch nicht implentiert... */}
          {/* {user !== undefined && (
            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
              <p style={{ color: '#6b7280', marginBottom: '1rem' }}>
                Wir haben eine Bestätigungsmail an <strong>{user.email}</strong> versendet.
              </p>
              <button
                type="button"
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--color-primary, #2c5a39)',
                  fontSize: '0.9rem',
                  cursor: 'pointer',
                  textDecoration: 'underline',
                  padding: 0,
                }}
                onClick={handleChangeEmail}
              >
                Vertippt? E-Mail-Adresse ändern
              </button>
            </div>
          )} */}

          <p style={{ textAlign: 'center', color: '#6b7280', marginBottom: '1.5rem' }}>
            Klicke auf den Link in der E-Mail oder gib den 6-stelligen Code ein.
          </p>

          <EmailVerificationCode />
        </div>
      </div>
    </div>
  )
}
