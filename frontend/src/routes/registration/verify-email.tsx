import { createFileRoute, useLocation, useNavigate } from '@tanstack/react-router'
import '../../styles/routes/emailVerification.scss'
import { Button, Form } from 'react-bootstrap';
import { useState } from 'react';

export const Route = createFileRoute('/registration/verify-email')({
  component: pendingConfirmation,
})

function pendingConfirmation() {
  const navigate = useNavigate();
  const location = useLocation();
  const user = location.state.person;
  const [code, setCode] = useState('');

  const handleCode = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, '');
    const newCode = value.slice(0, 6);
    setCode(newCode);
  };

  const handleChangeEmail = () => {
    // Emailadresse vom User ändern und Mail neu verschicken
    console.log("not implemented yet");
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-card">
          <h1 className="auth-title">Verifiziere bitte dein E-Mailadresse</h1>
          {user !== undefined && <div className='section-mail'>
            <div>Mail zur Verifizierung an {user.email} geschickt.</div>
            <Button variant="primary" type="submit" className="mt-3 section2" onClick={handleChangeEmail}>Vertippt? Mailadresse ändern</Button>
          </div>}
          <div className="section2">Bitte klicke auf den Link in der Mail oder gib den sechstelligen Code hier ein.</div>
          <div className="section2">Code eingeben:</div>
          <div className="section2">
            <Form>
              <Form.Group controlId="verificationCode">
                <Form.Control
                  type="text"
                  name="verificationCode"
                  value={code}
                  onChange={handleCode}
                  placeholder="6-stelliger Code"
                  maxLength={6}
                />
                <Button variant="primary" type="submit" disabled={code.length !== 6} className="mt-3" onClick={() => navigate({ to: `/registration/email-confirmation/${code}` })}>Verfizieren</Button>
              </Form.Group>
            </Form>
          </div>
        </div>
      </div>
    </div>);
}
