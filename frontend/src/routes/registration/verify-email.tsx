import { createFileRoute, useNavigate } from '@tanstack/react-router'
import '../../styles/routes/_auth-shared.scss'
import { useEffect, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useLoginContext } from '../../LoginContext'
import { EmailVerificationCode } from '../../components/registration/EmailVerificationCode'
import { getPersonById } from '../../api/PersonsAPI'
import { ChangeEmailDialog } from '../../components/registration/ChangeEmailDialog'
import { useTitle } from '@/utils/useTitle'
import type { PersonsType, VeterinaryPracticesType } from 'petappoint-shared/schemas/ZodSchemas'
import { getVeterinaryPracticesById } from '@/api/VeterinaryPracticeAPI'

export const Route = createFileRoute('/registration/verify-email')({
  component: PendingConfirmation,
})

function PendingConfirmation() {
  useTitle('E-Mail Verifizierung');
  const navigate = useNavigate();
  const { login } = useLoginContext();
  const [showEmailEditDialog, setShowEmailEditDialog] = useState(false);
  const [email, setEmail] = useState<string>("");

  const id = login ? login.id : -1;
  const { data: dataUser, isSuccess: isSuccessUser } = useQuery<PersonsType>({
    queryKey: ['person', id],
    queryFn: () => getPersonById(id),
    retry: false,
    enabled: id !== -1 && login && login.role === 'person',
  })
  const { data: dataPractice, isSuccess: isSuccessPractice } = useQuery<VeterinaryPracticesType>({
    queryKey: ['practice', id],
    queryFn: () => getVeterinaryPracticesById(id.toString()),
    retry: false,
    enabled: id !== -1 && login && login.role === 'company',
  })

  useEffect(() => { // if not verified go to start
    if (login !== false && login.verified) {
      navigate({ to: '/dashboard' });
    } else if (login === false) {
      navigate({ to: '/' });
    }
  }, [login]);

  useEffect(() => {
    if (isSuccessUser && login && login.role === 'person') {
      setEmail(dataUser.email);
    } else if (isSuccessPractice && login && login.role === 'company') {
      setEmail(dataPractice.email);
    }
  }, [dataUser, dataPractice, isSuccessPractice, isSuccessUser]);

  const handleChangeEmail = () => {
    setShowEmailEditDialog(true);
  }

  const hideEmailEditDialog = () => {
    setShowEmailEditDialog(false);
  }

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-card">
          <h1 className="auth-title">Bestätige deine E-Mail-Adresse</h1>
          {email !== "" && (
            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
              <p style={{ color: '#6b7280', marginBottom: '1rem' }}>
                Wir haben eine Bestätigungsmail an <strong>{email}</strong> versendet.
              </p>
              <button
                type="button"
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--color-primary, #2c5a39)',
                  fontSize: '0.9rem',
                  cursor: 'pointer',
                  textDecoration: 'underline',
                  padding: 0,
                }}
                onClick={handleChangeEmail}
              >
                Vertippt? E-Mail-Adresse ändern
              </button>
            </div>
          )}

          <p style={{ textAlign: 'center', color: '#6b7280', marginBottom: '1.5rem' }}>
            Bitte gib den 6-stelligen Code aus der Email hier ein.
          </p>

          <EmailVerificationCode />
          {isSuccessUser && showEmailEditDialog && <ChangeEmailDialog hideEmailEditDialog={hideEmailEditDialog} email={email} />}
        </div>
      </div>
    </div>
  )
}
