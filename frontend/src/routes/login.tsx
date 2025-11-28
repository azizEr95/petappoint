import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import type { ChangeEvent, FormEvent } from 'react'
import '../styles/routes/login.scss'
import { useAuthStore } from '../stores/authStore'
import { useMutation } from '@tanstack/react-query'
import { login } from '../api/LoginAPI'

export const Route = createFileRoute('/login')({
  component: Login,
})

function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errorLogin, setErrorLogin] = useState('')
  const navigate = useNavigate()
  const { setLogin } = useAuthStore()

  const { mutate: mutateLogin } = useMutation({
    mutationFn: () =>
      login(email, password),
    onError: () => {
      setErrorLogin("Email oder Password falsch");
    },
    onSuccess: () => {
      setLogin(true);
      navigate({ to: '/dashboard' });
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
        console.log('Error: Fehler beim Aendern von Login State in handleChange')
    }
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    mutateLogin();
  }

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-card">
          <h1 className="auth-title">Login</h1>

          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="email" className="form-label">E-Mail *</label>
              <input
                id="email"
                type="email"
                className="form-input"
                placeholder="ihre@email.de"
                name="email"
                onChange={handleChange}
                value={email}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="password" className="form-label">Passwort *</label>
              <input
                id="password"
                type="password"
                className="form-input"
                placeholder="••••••••"
                name="password"
                onChange={handleChange}
                value={password}
                required
              />
            </div>
            {errorLogin !== "" && <div>{errorLogin}</div>}
            <button type="submit" className="auth-button">
              Einloggen
            </button>
          </form>
        </div>

        <div className="auth-option-card">
          <p className="option-text">Neu bei vetlib?</p>
          <button
            type="button"
            className="option-button"
            onClick={() => navigate({ to: '/registration/person' })}
          >
            Jetzt registrieren
          </button>
        </div>

        <div className="auth-option-card">
          <p className="option-text">Sie sind Tierarzt?</p>
          <button
            type="button"
            className="option-button"
            onClick={() => navigate({ to: '/registration/veterinary' })}
          >
            Als Praxis registrieren
          </button>
        </div>
      </div>
    </div>
  )
}
