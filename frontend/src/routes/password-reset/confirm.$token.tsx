import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import { useMutation, useQuery } from '@tanstack/react-query'
import { Form } from 'react-bootstrap'
import { PasswordInput } from '../../components/common/PasswordInput'
import {
  confirmPasswordReset,
  verifyResetToken,
} from '../../api/PasswordResetAPI'
import '../../styles/routes/_auth-shared.scss'

export const Route = createFileRoute('/password-reset/confirm/$token')({
  component: PasswordResetConfirm,
})

function PasswordResetConfirm() {
  const { token } = Route.useParams()
  const navigate = useNavigate()
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [errors, setErrors] = useState<{
    password?: string
    confirmPassword?: string
  }>({})
  const [resetSuccess, setResetSuccess] = useState(false)

  // Verify token on mount
  const {
    data: isTokenValid,
    isLoading: isVerifying,
    isError,
  } = useQuery({
    queryKey: ['verifyResetToken', token],
    queryFn: () => verifyResetToken(token),
    retry: false,
  })

  const { mutate, isPending, error } = useMutation({
    mutationFn: () => confirmPasswordReset(token, password),
    onSuccess: () => {
      setResetSuccess(true)
      setTimeout(() => {
        navigate({ to: '/login' })
      }, 3000)
    },
  })

  const validatePassword = (value: string): string => {
    if (!value.trim()) {
      return 'Passwort ist erforderlich'
    }
    if (value.length < 8) {
      return 'Passwort muss mindestens 8 Zeichen lang sein'
    }
    if (!/[A-Z]/.test(value)) {
      return 'Passwort muss mindestens einen Großbuchstaben enthalten'
    }
    if (!/[0-9]/.test(value)) {
      return 'Passwort muss mindestens eine Zahl enthalten'
    }
    if (!/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(value)) {
      return 'Passwort muss mindestens ein Sonderzeichen enthalten'
    }
    return ''
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const newErrors: typeof errors = {}

    const passwordError = validatePassword(password)
    if (passwordError) {
      newErrors.password = passwordError
    }

    if (!confirmPassword.trim()) {
      newErrors.confirmPassword = 'Passwort-Wiederholung ist erforderlich'
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwörter stimmen nicht überein'
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    mutate()
  }

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value)
    if (errors.password) {
      setErrors({ ...errors, password: undefined })
    }
  }

  const handleConfirmPasswordChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setConfirmPassword(e.target.value)
    if (errors.confirmPassword) {
      setErrors({ ...errors, confirmPassword: undefined })
    }
  }

  if (isVerifying) {
    return (
      <div className="auth-page">
        <div className="auth-container">
          <div className="auth-card">
            <h1 className="auth-title">Link wird überprüft...</h1>
          </div>
        </div>
      </div>
    )
  }

  if (isError || !isTokenValid) {
    return (
      <div className="auth-page">
        <div className="auth-container">
          <div className="auth-card">
            <h1 className="auth-title">Ungültiger Link</h1>
            <p style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
              Dieser Link ist ungültig, abgelaufen oder wurde bereits verwendet.
            </p>
            <button
              className="auth-button"
              onClick={() => navigate({ to: '/password-reset/request' })}
            >
              Neuen Link anfordern
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (resetSuccess) {
    return (
      <div className="auth-page">
        <div className="auth-container">
          <div className="auth-card">
            <h1 className="auth-title">Passwort erfolgreich zurückgesetzt</h1>
            <p style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
              Sie werden in 3 Sekunden zum Login weitergeleitet...
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-card">
          <h1 className="auth-title">Neues Passwort erstellen</h1>

          <Form className="auth-form" onSubmit={handleSubmit}>
            <PasswordInput
              id="password"
              name="password"
              value={password}
              onChange={handlePasswordChange}
              placeholder="••••••••"
              isInvalid={!!errors.password}
              error={errors.password}
              className="form-group"
              label="Neues Passwort *"
              required
              disabled={isPending}
            />

            <PasswordInput
              id="confirmPassword"
              name="confirmPassword"
              value={confirmPassword}
              onChange={handleConfirmPasswordChange}
              placeholder="••••••••"
              isInvalid={!!errors.confirmPassword}
              error={errors.confirmPassword}
              className="form-group"
              label="Passwort wiederholen *"
              required
              disabled={isPending}
            />

            {error && (
              <div
                style={{
                  padding: '0.75rem',
                  backgroundColor: '#fee',
                  borderRadius: '6px',
                  color: '#c00',
                  fontSize: '0.9rem',
                }}
              >
                {error.message}
              </div>
            )}

            <button type="submit" className="auth-button" disabled={isPending}>
              {isPending ? 'Wird gespeichert...' : 'Passwort zurücksetzen'}
            </button>
          </Form>
        </div>
      </div>
    </div>
  )
}
