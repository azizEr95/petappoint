import { useLocation, useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import '../../styles/routes/login.scss'
import { useMutation } from '@tanstack/react-query'
import { Form } from 'react-bootstrap'
import { loginUser, newToken } from '../../api/LoginAPI'
import { StatusBooking } from '../../types/booking'
import { useLoginContext } from '../../LoginContext'
import { PasswordInput } from '../common/PasswordInput'
import type { ChangeEvent, FormEvent } from 'react'
import type { AppointmentsType, LoginType } from 'vetilib-shared/schemas/ZodSchemas'

type LoginProps = {
  setStatusBookingProcess?: (status: StatusBooking) => void // only if Login is in Booking Process
  appointment?: AppointmentsType
  redirect?: string
}

export function LoginForm({
  setStatusBookingProcess,
  appointment,
  redirect,
}: LoginProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errorLogin, setErrorLogin] = useState('')
  const navigate = useNavigate()
  const { setLogin } = useLoginContext()
  const location = useLocation()
  const selectedService = location.state.selectedService

  const { mutate: mutateLogin } = useMutation({
    mutationFn: () => loginUser(email, password),
    onError: () => {
      setLogin(false)
      setErrorLogin('Email oder Password falsch')
    },
    onSuccess: (data: LoginType) => {
      setLogin(data)
      if(data.verified === true){ // verfied, login successful
        if (setStatusBookingProcess !== undefined) {
          setStatusBookingProcess(StatusBooking.selectAnimal)
        } else {
        if(redirect !== undefined){
          navigate({ to: redirect })
        } else {
            navigate({ to: '/dashboard' })
          }
      }
      } else { // not verified, resend Verifcaation Email
        if(appointment !== undefined){ // store appointment in localStorage to keep it after redirect in booking process, if undefined it is an normal login
          localStorage.setItem('bookAppointment', JSON.stringify({ appointmentId: appointment.id, practiceId: appointment.veterinaryPractice.id }));
        }
        mutateNewCode();
      }
    },
  })

  const { mutate: mutateNewCode } = useMutation({
    mutationFn: () => newToken(),
    onSuccess: () => {
      navigate({
        to: '/registration/verify-email',
        state: {
          appointment: appointment,
        }
      });
    },
  })

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    switch (name) {
      case 'email':
        setEmail(value)
        break
      case 'password':
        setPassword(value)
        break
      default:
        console.log(
          'Error: Fehler beim Aendern von Login State in handleChange',
        )
    }
  }

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    mutateLogin()
  }

  const handleClickRegistration = () => {
    if(appointment !== undefined){
      localStorage.setItem('bookAppointment', JSON.stringify({ appointmentId: appointment.id, practiceId: appointment.veterinaryPractice.id }));
    }
    navigate({
      to: '/registration/person',
      state: {
        appointment:
          setStatusBookingProcess !== undefined ? appointment : undefined,
        selectedService: selectedService,
      },
    })
  }

  return (
    <>
      <div className="auth-card">
        <h1 className="auth-title">Login</h1>

        <form className="auth-form" onSubmit={handleSubmit}>
          <Form.Group className="form-group">
            <Form.Label htmlFor="email" className="form-label">
              E-Mail *
            </Form.Label>
            <Form.Control
              id="email"
              type="email"
              placeholder="ihre@email.de"
              name="email"
              onChange={handleChange}
              value={email}
              data-testid="email-input"
              required
            />
          </Form.Group>

          <Form.Group className="form-group">
            <PasswordInput
              id="password"
              name="password"
              value={password}
              onChange={handleChange}
              placeholder="••••••••"
              required
            />
            <div style={{ marginTop: '0.5rem' }}>
              <button
                type="button"
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--color-primary, #667eea)',
                  fontSize: '0.9rem',
                  cursor: 'pointer',
                  textDecoration: 'underline',
                  padding: 0
                }}
                onClick={() => navigate({ to: '/password-reset/request' })}
              >
                Passwort vergessen?
              </button>
            </div>
          </Form.Group>
          {errorLogin !== '' && (
            <div className="error-message">
              {errorLogin}
            </div>
          )}
          <button type="submit" className="auth-button" data-testid="login-submit">
            Einloggen
          </button>
        </form>
      </div>

      <div className="auth-option-card">
        <p className="option-text">Neu bei vetilib?</p>
        <button
          type="button"
          className="option-button"
          onClick={handleClickRegistration}
        >
          Jetzt registrieren
        </button>
      </div>
    </>
  )
}