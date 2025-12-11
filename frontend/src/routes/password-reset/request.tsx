import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { Form } from 'react-bootstrap'
import { requestPasswordReset } from '../../api/PasswordResetAPI'
import '../../styles/routes/_auth-shared.scss'

export const Route = createFileRoute('/password-reset/request')({
  component: PasswordResetRequest,
})

function PasswordResetRequest() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [emailError, setEmailError] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const { mutate, isPending } = useMutation({
    mutationFn: () => requestPasswordReset(email),
    onSuccess: () => {
      setSubmitted(true)
    },
    onError: () => {
      setEmailError('Ein Fehler ist aufgetreten. Bitte versuchen Sie es später erneut.')
    }
  })

  const validateEmail = (value: string): string => {
    if (!value.trim()) {
      return 'E-Mail ist erforderlich'
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value)) {
      return 'Bitte geben Sie eine gültige E-Mail-Adresse ein'
    }
    return ''
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const error = validateEmail(email)
    if (error) {
      setEmailError(error)
      return
    }

    mutate()
  }

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value)
    if (emailError) {
      setEmailError('')
    }
  }

  if (submitted) {
    return (
      <div className="auth-page">
        <div className="auth-container">
          <div className="auth-card">
            <h1 className="auth-title">E-Mail versendet</h1>
            <p style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
              Falls ein Konto mit dieser E-Mail-Adresse existiert, haben wir Ihnen einen Link zum Zurücksetzen des Passworts geschickt.
            </p>
            <p style={{ textAlign: 'center', color: '#6b7280', fontSize: '0.9rem' }}>
              Bitte prüfen Sie Ihr E-Mail-Postfach. Der Link ist 1 Stunde gültig.
            </p>
            <button
              className="auth-button"
              onClick={() => navigate({ to: '/login' })}
            >
              Zurück zum Login
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-card">
          <h1 className="auth-title">Passwort vergessen?</h1>
          <p style={{ textAlign: 'center', marginBottom: '2rem', color: '#6b7280' }}>
            Geben Sie Ihre E-Mail-Adresse ein und wir senden Ihnen einen Link zum Zurücksetzen Ihres Passworts.
          </p>

          <Form className="auth-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <Form.Label htmlFor="email" className="form-label">
                E-Mail *
              </Form.Label>
              <Form.Control
                id="email"
                type="email"
                className="form-input"
                placeholder="ihre@email.de"
                name="email"
                onChange={handleEmailChange}
                value={email}
                isInvalid={!!emailError}
                disabled={isPending}
              />
              <Form.Control.Feedback type="invalid">
                {emailError}
              </Form.Control.Feedback>
            </div>

            <button
              type="submit"
              className="auth-button"
              disabled={isPending}
            >
              {isPending ? 'Wird gesendet...' : 'Link anfordern'}
            </button>
          </Form>
        </div>

        <div className="auth-option-card">
          <p className="option-text">Erinnern Sie sich an Ihr Passwort?</p>
          <button
            type="button"
            className="option-button"
            onClick={() => navigate({ to: '/login' })}
          >
            Zurück zum Login
          </button>
        </div>
      </div>
    </div>
  )
}
