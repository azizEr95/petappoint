import { useMutation, useQuery } from '@tanstack/react-query'
import { createFileRoute, useLocation, useNavigate } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { Form } from 'react-bootstrap'
import { loginUser, verifyEmail } from '../../../api/LoginAPI'
import { useLoginContext } from '../../../LoginContext'
import type { ChangeEvent } from 'react';
import '../../../styles/routes/emailVerification.scss'
import type { LoginType } from '../../../../../shared/schemas/ZodSchemas'

export const Route = createFileRoute(
  '/registration/email-confirmation/$emailVerifyCode',
)({
  component: RouteComponent,
})

function RouteComponent() {
  const { setLogin } = useLoginContext();
  const navigate = useNavigate();
  const location = useLocation();
  const appointment = location.state.appointment;
  const { emailVerifyCode } = Route.useParams();
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errorLogin, setErrorLogin] = useState('')


  // verify email code
  const { isError: isErrorVerifyEmail, isSuccess: isSuccessVerifyEmail, isPending: isPendingVerifyEmail, data: dataVerifyEmail } = useQuery<
    LoginType | false
  >({
    queryKey: ['loginVerifyEmail', emailVerifyCode],
    queryFn: () => verifyEmail(emailVerifyCode),
    retry: false,
  })

  const { mutate: mutateLogin } = useMutation({
    mutationFn: () => loginUser(email, password),
    onError: () => {
      setLogin(false)
      setErrorLogin('Email oder Password falsch')
    },
    onSuccess: (data: LoginType | false) => {
      if (data === false) {
        setLogin(false)
        navigate({
          to: '/registration/verify-email'
        })
      } else {
        setLogin(data)
        navigate({ to: '/dashboard' });
      }
    },
  })

  useEffect(() => {
    if (isSuccessVerifyEmail) {
      setTimeout(() => {
        if (appointment === undefined) {
          navigate({ to: '/dashboard' });
        } else {
          navigate({
            to: '/practices/$practiceId/booking/$appointmentId',
            params: {
              practiceId: appointment.veterinaryPractice.id.toString(),
              appointmentId: appointment.id.toString(),
            }
          })
        }
      }, 3000)
    }
  }, [isSuccessVerifyEmail]);

  useEffect(() => {
    if (isSuccessVerifyEmail) {
      setLogin(dataVerifyEmail);
    }
  }, [isSuccessVerifyEmail, dataVerifyEmail])

  const handleNewCode = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    mutateLogin();
  }

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

  if (isPendingVerifyEmail) {
    return <div className="auth-page">
      <div className="auth-container">
        <div className="auth-card">
          <h1 className="auth-title">E-Mail wird verifiziert</h1>
          <div className="section2">Bitte warten...</div>
        </div>
      </div>
    </div>;
  }

  if (isErrorVerifyEmail) {
    return (
      <div className="auth-page">
        <div className="auth-container">
          <div className="auth-card">
            <h1 className="auth-title">E-Mail Verifizierung gescheitert</h1>
            <div className="section2">Dein Code ist ungueltig.</div>
            <div className="section2">Bitte einloggen um neuen Code anzufordern:</div>
            <div className="section2">
              <Form>
                <div className="form-group">
                  <label htmlFor="email" className="form-label">
                    E-Mail *
                  </label>
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
                  <label htmlFor="password" className="form-label">
                    Passwort *
                  </label>
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
                {errorLogin !== '' && <div>{errorLogin}</div>}
                <button className="btn btn-primary" type="submit" onClick={handleNewCode}>
                  Neuen Code anfordern
                </button>
              </Form>
            </div>
          </div>
        </div>
      </div>);
  }

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-card">
          <h1 className="auth-title">E-Mail Verifizierung erfolgreich</h1>
          {appointment === undefined && <div className="section2">Du wirst in 3 Sekunden automatisch zum Dashboard weitergeleitet.</div>}
          {appointment !== undefined && <div className="section2">Du wirst in 3 Sekunden automatisch zur Buchung weitergeleitet.</div>}
        </div>
      </div>
    </div>);
}
