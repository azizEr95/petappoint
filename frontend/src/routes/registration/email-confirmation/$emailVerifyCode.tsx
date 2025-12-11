import { useMutation, useQuery } from '@tanstack/react-query'
import { createFileRoute, useLocation, useNavigate } from '@tanstack/react-router'
import { useEffect } from 'react'
import { newToken, verifyEmail } from '../../../api/LoginAPI'
import { useLoginContext } from '../../../LoginContext'
import { EmailVerificationCode } from '../../../components/registration/EmailVerificationCode'
import '../../../styles/routes/emailVerification.scss'
import type { LoginType } from '../../../../../shared/schemas/ZodSchemas'

export const Route = createFileRoute(
  '/registration/email-confirmation/$emailVerifyCode',
)({
  component: RouteComponent,
})

function RouteComponent() {
  const { login, setLogin } = useLoginContext();
  const navigate = useNavigate();
  const location = useLocation();
  const appointment = location.state.appointment;
  const { emailVerifyCode } = Route.useParams();


  // verify email code
  const { isError: isErrorVerifyEmail, isSuccess: isSuccessVerifyEmail, isPending: isPendingVerifyEmail, data: dataVerifyEmail } = useQuery<
    LoginType
  >({
    queryKey: ['loginVerifyEmail', emailVerifyCode],
    queryFn: () => verifyEmail(emailVerifyCode),
    retry: false,
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

  useEffect(() => { // if not verified go to start
    if (login && login.verified && !isSuccessVerifyEmail) {
      navigate({ to: '/dashboard' });
    } else if (login === false) {
      navigate({ to: '/' });
    }
  }, [login]);

  useEffect(() => {
    if (isSuccessVerifyEmail) {
      setTimeout(() => {
        const appointmentUnparse = localStorage.getItem("bookAppointment");
        if (appointmentUnparse) {
          localStorage.removeItem("bookAppointment");
          const appointmentStorage = JSON.parse(appointmentUnparse) as { practiceId: number, appointmentId: number };
          navigate({
            to: "/practices/$practiceId/booking/$appointmentId",
            params: {
              practiceId: appointmentStorage.practiceId.toString(),
              appointmentId: appointmentStorage.appointmentId.toString()
            }
          });
        } else {
          navigate({ to: '/dashboard' });
        }
      }, 2000)
    }
  }, [isSuccessVerifyEmail]);

  useEffect(() => {
    if (isSuccessVerifyEmail) {
      setLogin(dataVerifyEmail);
    }
  }, [isSuccessVerifyEmail, dataVerifyEmail])

  const handleNewCode = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    mutateNewCode();
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
            <div className="section2">Dieser Code ist ungültig.</div>
            <div className="section2">
              <button className="btn btn-primary" type="submit" onClick={handleNewCode}>
                Neuen Code anfordern
              </button>

            </div>
            <EmailVerificationCode />

          </div>
        </div>
      </div>);
  }

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-card">
          <h1 className="auth-title">E-Mail Verifizierung erfolgreich</h1>
          {localStorage.getItem("bookAppointment") === null && <div className="section2">Du wirst in 2 Sekunden automatisch zum Dashboard weitergeleitet.</div>}
          {localStorage.getItem("bookAppointment") !== null && <div className="section2">Du wirst in 2 Sekunden automatisch zur Buchung weitergeleitet.</div>}
        </div>
      </div>
    </div>);
}
