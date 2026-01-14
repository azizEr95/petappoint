import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { LoginForm } from '../components/registration/Login'
import { useTitle } from '@/utils/useTitle';

type loginRedirect = {
  redirect?: string;
}

export const Route = createFileRoute('/login')({
  validateSearch: (
    search: loginRedirect,
  ): loginRedirect => {
    return search
  },
  component: Login,
})

function Login() {
  useTitle('Login');
  const navigate = useNavigate()
  const { redirect } = Route.useSearch();

  return (
    <div className="auth-page">
      <div className="auth-container">
        <LoginForm
          setStatusBookingProcess={undefined}
          appointment={undefined}
          redirect={redirect}
        />

        <div className="auth-option-card">
          <p className="option-text">Sie sind Tierarzt?</p>
          <button
            type="button"
            className="option-button"
            onClick={() => navigate({ to: '/registration/veterinarypractice' })}
          >
            Als Praxis registrieren
          </button>
        </div>
      </div>
    </div>
  )
}
