import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import type { ChangeEvent, MouseEvent } from 'react'
import '../styles/routes/login.scss'
import { Button, Form } from 'react-bootstrap'
import { useAuthStore } from '../stores/authStore'

export const Route = createFileRoute('/login')({
  component: Login,
})

function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate()
  const { setLogin } = useAuthStore()

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const t = e.target
    const name = t.name
    const value = t.value
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

  const handleSubmit = async (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    setLogin(true)
    navigate({ to: '/appointments' })
  }

  const handleClickRegistrationVeterinaryPractice = (
    e: MouseEvent<HTMLButtonElement>,
  ) => {
    e.preventDefault()
    navigate({ to: '/registration/veterinary' })
  }

  const handleClickRegistrationUser = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    navigate({ to: '/registration/person' })
  }

  return (
    <div className="loginSite">
      <div className="text-center">Login</div>
      <Form className="loginFormular">
        <Form.Group className="mb-3">
          <Form.Control
            id="LoginDialogUserIDText"
            type="text"
            placeholder="E-Mail"
            name="email"
            onChange={handleChange}
            value={email}
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Control
            id="LoginDialogUserIDPassword"
            type="password"
            placeholder="Password"
            name="password"
            onChange={handleChange}
            value={password}
          />
        </Form.Group>
        <Button
          id="PerformLoginButton"
          variant="primary"
          type="submit"
          onClick={handleSubmit}
        >
          Login
        </Button>
      </Form>

      <div className="card card-body loginOption">
        <div className="card-text text-center">Neu bei vetlib?</div>
        <Button
          id="PerformRegistrationButton"
          className="button"
          variant="primary"
          type="submit"
          onClick={handleClickRegistrationUser}
        >
          Registrieren
        </Button>
      </div>
      <div className="card card-body loginOption">
        <div className="card-text text-center">Sie sind Tierarzt?</div>
        <Button
          className="button"
          variant="primary"
          type="submit"
          onClick={handleClickRegistrationVeterinaryPractice}
        >
          Als Praxis regristrieren
        </Button>
      </div>
    </div>
  )
}
