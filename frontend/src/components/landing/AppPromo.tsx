import { Button, Col, Container, Row } from 'react-bootstrap'
import '../../styles/components/landing/AppPromo.scss'

export default function AppPromo() {
  return (
    <section className="app-promo-section section-padding">
      <Container>
        <Row className="align-items-center">
          <Col lg={6} className="mb-4 mb-lg-0">
            <h2 className="app-promo-title mb-3">
              Noch bequemer mit der Vetlib App
            </h2>
            <p className="app-promo-description mb-4">
              Verwalten Sie alle Termine unterwegs, erhalten Sie
              Push-Benachrichtigungen und greifen Sie jederzeit auf die
              Behandlungshistorie Ihrer Tiere zu.
            </p>
            <div className="d-flex flex-wrap gap-2 mb-4">
              <span className="app-feature-badge">
                <i className="bi bi-check-circle-fill me-2"></i>
                Push-Benachrichtigungen
              </span>
              <span className="app-feature-badge">
                <i className="bi bi-check-circle-fill me-2"></i>
                Offline-Zugriff
              </span>
              <span className="app-feature-badge">
                <i className="bi bi-check-circle-fill me-2"></i>
                Impfpass digital
              </span>
            </div>
            <div className="d-flex flex-wrap gap-3 mb-4">
              <Button className="btn-app-store" type="button">
                <i className="bi bi-apple me-2"></i>
                App Store
              </Button>
              <Button className="btn-play-store" type="button">
                <i className="bi bi-google-play me-2"></i>
                Play Store
              </Button>
            </div>
            <div className="app-promo-qr-note">
              <small>Oder scannen Sie den QR-Code</small>
            </div>
          </Col>
          <Col lg={6} className="text-center">
            <div className="app-mockup">
              <div className="mockup-phone">
                <i className="bi bi-phone"></i>
              </div>
              <div className="qr-placeholder mt-4">
                <div className="qr-code">
                  <i className="bi bi-qr-code"></i>
                  <p className="mt-2 mb-0">QR-Code scannen</p>
                </div>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </section>
  )
}
