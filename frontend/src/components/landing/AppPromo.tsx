import { Button, Col, Container, Row } from 'react-bootstrap'
import '../../styles/components/landing/AppPromo.scss'

export default function AppPromo() {
  return (
    <section className="app-promo-section section-padding app-promo-with-mockup">
      <Container>
        <Row className="align-items-start">
          <Col lg={6} className="mb-4 mb-lg-0">
            <h2 className="app-promo-title mb-3">
              Noch bequemer mit der petappoint App
            </h2>
            <p className="app-promo-description mb-4">
              Verwalten Sie alle Termine unterwegs, erhalten Sie
              Push-Benachrichtigungen und greifen Sie jederzeit auf die
              Behandlungshistorie Ihrer Tiere zu.
            </p>
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
            <div className="app-promo-qr-section text-start">
              <div className="app-promo-qr-note mb-3">
                <small>Oder scannen Sie den QR-Code</small>
              </div>
              <img src="/petappoint-qr-code.png" alt="petappoint QR Code" className="qr-code-image" />
            </div>
          </Col>
          <Col lg={6} className="d-flex align-items-end justify-content-center">
            <img src="/petappoint-mockup.png" alt="petappoint App Mockup" className="mockup-image" />
          </Col>
        </Row>
      </Container>
    </section>
  )
}
