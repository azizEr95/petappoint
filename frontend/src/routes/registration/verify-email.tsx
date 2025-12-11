import { createFileRoute, useLocation, useNavigate } from '@tanstack/react-router'
import '../../styles/routes/_auth-shared.scss'
import { Form } from 'react-bootstrap'
import { useState } from 'react'

export const Route = createFileRoute('/registration/verify-email')({
  component: PendingConfirmation,
})

function PendingConfirmation() {
  const navigate = useNavigate()
  const location = useLocation()
  const user = location.state?.person
  const [code, setCode] = useState('')

  const handleCode = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, '')
    const newCode = value.slice(0, 6)
    setCode(newCode)
  }

  const handleChangeEmail = () => {
    console.log('not implemented yet')
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (code.length === 6) {
      navigate({ to: `/registration/email-confirmation/${code}` })
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-card">
          <h1 className="auth-title">Bestätige deine E-Mail-Adresse</h1>

          {user !== undefined && (
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
          )}

          <p style={{ textAlign: 'center', color: '#6b7280', marginBottom: '1.5rem' }}>
            Klicke auf den Link in der E-Mail oder gib den 6-stelligen Code ein.
          </p>

          <Form className="auth-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <Form.Label htmlFor="code" className="form-label">
                Bestätigungscode *
              </Form.Label>
              <Form.Control
                id="code"
                type="text"
                className="form-input"
                placeholder="000000"
                name="code"
                value={code}
                onChange={handleCode}
                maxLength={6}
              />
            </div>

            <button
              type="submit"
              className="auth-button"
              disabled={code.length !== 6}
            >
              {code.length === 6 ? 'Bestätigen' : 'Code eingeben (6 Ziffern)'}
            </button>
          </Form>
        </div>
      </div>
    </div>
  )
}
