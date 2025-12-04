import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { LoginForm } from '../components/Login';


export const Route = createFileRoute('/login')({
  component: Login,
})

function Login() {
  const navigate = useNavigate();
  
  return (
    <div className="auth-page">
      <div className="auth-container">
        <LoginForm setStatusBookingProcess={undefined} appointment={undefined}/>

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
