import { createFileRoute, useNavigate } from '@tanstack/react-router'
import '../../styles/routes/_auth-shared.scss'
import { useEffect, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useLoginContext } from '../../LoginContext'
import { EmailVerificationCode } from '../../components/registration/EmailVerificationCode'
import { getPersonById } from '../../api/PersonsAPI'
import { ChangeEmailDialog } from '../../components/registration/ChangeEmailDialog'
import type { PersonsType } from '../../../../shared/schemas/ZodSchemas'

export const Route = createFileRoute('/registration/verify-email')({
  component: PendingConfirmation,
})

function PendingConfirmation() {
  const navigate = useNavigate();
  const { login } = useLoginContext();
  const [showEmailEditDialog, setShowEmailEditDialog] =  useState(false);

  const userId = login ? login.id : -1;
  const { data: dataUser, isSuccess: isSuccessUser } = useQuery<PersonsType>({
    queryKey: ['person', userId],
    queryFn: () => getPersonById(userId),
    retry: false,
    enabled: userId !== -1,
  })

  useEffect(() => { // if not verified go to start
    if (login !== false && login.verified) {
      navigate({ to: '/dashboard' });
    } else if (login === false) {
      navigate({ to: '/' });
    }
  }, [login]);

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

          {/* TODO: Feature folgt noch, noch nicht implentiert... */}
          {isSuccessUser && (
            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
              <p style={{ color: '#6b7280', marginBottom: '1rem' }}>
                Wir haben eine Bestätigungsmail an <strong>{dataUser.email}</strong> versendet.
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
          {isSuccessUser && showEmailEditDialog && <ChangeEmailDialog hideEmailEditDialog={hideEmailEditDialog} email={dataUser.email} />}
        </div>
      </div>
    </div>
  )
}
