import { Button, Col, Container, Row } from 'react-bootstrap'

export default function AppPromo() {
  return (
    <section className="section-padding bg-success bg-gradient text-white">
      <Container>
        <Row className="align-items-center">
          <Col lg={6} className="mb-4 mb-lg-0">
            <h2 className="display-5 fw-bold mb-3">
              Noch bequemer mit der Vetlib App
            </h2>
            <p className="lead mb-4">
              Verwalten Sie alle Termine unterwegs, erhalten Sie
              Push-Benachrichtigungen und greifen Sie jederzeit auf die
              Behandlungshistorie Ihrer Tiere zu.
            </p>
            <div className="d-flex flex-wrap gap-3 mb-3">
              <div className="app-feature">
                <i className="bi bi-check-circle-fill me-2"></i>
                Push-Benachrichtigungen
              </div>
              <div className="app-feature">
                <i className="bi bi-check-circle-fill me-2"></i>
                Offline-Zugriff
              </div>
              <div className="app-feature">
                <i className="bi bi-check-circle-fill me-2"></i>
                Impfpass digital
              </div>
            </div>
            <div className="d-flex flex-wrap gap-2">
              <Button variant="light" size="lg">
                <i className="bi bi-apple me-2"></i>
                App Store
              </Button>
              <Button variant="light" size="lg">
                <i className="bi bi-google-play me-2"></i>
                Play Store
              </Button>
            </div>
            <div className="mt-3">
              <small className="opacity-75">Oder scannen Sie den QR-Code</small>
            </div>
          </Col>
          <Col lg={6} className="text-center">
            <div className="app-mockup">
              <div className="mockup-phone">
                <i className="bi bi-phone" style={{ fontSize: '15rem' }}></i>
              </div>
              <div className="qr-placeholder mt-3">
                <div className="qr-code">
                  <i className="bi bi-qr-code" style={{ fontSize: '6rem' }}></i>
                  <p className="mt-2 mb-0">QR-Code scannen</p>
                </div>
              </div>
            </div>
          </Col>
        </Row>
      </Container>

      <style>{`
        .app-feature {
          background: rgba(255, 255, 255, 0.2);
          padding: 0.5rem 1rem;
          border-radius: 20px;
          font-size: 0.95rem;
        }

        .mockup-phone {
          color: rgba(255, 255, 255, 0.3);
        }

        .qr-placeholder {
          display: inline-block;
        }

        .qr-code {
          background: white;
          color: var(--text-dark);
          padding: 1.5rem;
          border-radius: 12px;
          display: inline-block;
        }
      `}</style>
    </section>
  )
}
