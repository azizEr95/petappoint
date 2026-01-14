import { useQuery } from '@tanstack/react-query'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { verifyEmail } from '../../../api/LoginAPI'
import { useLoginContext } from '../../../LoginContext'
import { EmailVerificationCode } from '../../../components/registration/EmailVerificationCode'
import '../../../styles/routes/emailVerification.scss'
import { ChangeEmailDialog } from '../../../components/registration/ChangeEmailDialog'
import { getPersonById } from '../../../api/PersonsAPI'
import type { LoginType, PersonsType } from 'vetilib-shared/schemas/ZodSchemas'
import { useTitle } from '@/utils/useTitle'

export const Route = createFileRoute(
  '/registration/email-confirmation/$emailVerifyCode',
)({
  component: SuccessFailEmailVerification,
})

function SuccessFailEmailVerification() {
  useTitle('E-Mail Verifizierung');
  const { login, setLogin } = useLoginContext();
  const navigate = useNavigate();
  const [showEmailEditDialog, setShowEmailEditDialog] =  useState(false);
  const { emailVerifyCode } = Route.useParams();

  // verify email code
  const { isError: isErrorVerifyEmail, isSuccess: isSuccessVerifyEmail, isPending: isPendingVerifyEmail, data: dataVerifyEmail } = useQuery<
    LoginType
  >({
    queryKey: ['loginVerifyEmail', emailVerifyCode],
    queryFn: () => verifyEmail(emailVerifyCode),
    retry: false,
  })

  const userId = login ? login.id : -1;
  const { data: dataUser, isSuccess: isSuccessUser } = useQuery<PersonsType>({
    queryKey: ['person', userId],
    queryFn: () => getPersonById(userId),
    retry: false,
    enabled: userId !== -1,
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
    setShowEmailEditDialog(true);
  }

  const hideEmailEditDialog = () => {
    setShowEmailEditDialog(false);
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
                Code erneut anfordern
              </button>

            </div>
            <EmailVerificationCode />
            {isSuccessUser && showEmailEditDialog && <ChangeEmailDialog hideEmailEditDialog={hideEmailEditDialog} email={dataUser.email} />}
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
