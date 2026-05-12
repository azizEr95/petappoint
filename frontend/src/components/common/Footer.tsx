import { Col, Container, Row } from 'react-bootstrap'
import '../../styles/components/landing/Footer.scss'

export default function Footer() {
  return (
    <footer id="contact" className="footer bg-dark text-white py-5">
      <Container>
        <Row className="g-5">
          {/* Logo & Description & Copyright */}
          <Col lg={5} md={6}>
            <div className="footer-brand">
              <h5 className="fw-bold text-success mb-3">Petappoint</h5>
              <p className="text-light small mb-4">
                Ihre moderne Plattform für einfache und schnelle
                Tierarzt-Terminbuchungen.
              </p>
              <small className="text-light opacity-75 d-block">
                © {new Date().getFullYear()} petappoint.<br />
                Alle Rechte vorbehalten.
              </small>
            </div>
          </Col>

          {/* Legal */}
          <Col lg={3} md={6}>
            <h6 className="text-white fw-bold mb-3 opacity-90">Rechtliches</h6>
            <ul className="list-unstyled footer-links-vertical">
              <li className="mb-2">
                <a href="/legal/impressum" className="footer-link small">Impressum</a>
              </li>
              <li className="mb-2">
                <a href="/legal/datenschutz" className="footer-link small">Datenschutz</a>
              </li>
              <li>
                <a href="/legal/agb" className="footer-link small">AGB</a>
              </li>
            </ul>
          </Col>


          {/* Contact */}
          <Col lg={4} md={6}>
            <h6 className="text-white fw-bold mb-3 opacity-90">Kontakt & Info</h6>
            <ul className="list-unstyled footer-links-vertical">
              <li className="mb-2">
                <a href="/about" className="footer-link small">Über uns</a>
              </li>
              <li className="mb-2">
                <a href="mailto:info@petappoint.de" className="footer-link small">
                  <i className="bi bi-envelope me-2"></i>
                  info@petappoint.de
                </a>
              </li>
              <li>
                <span className="text-light small opacity-75">
                  <i className="bi bi-geo-alt me-2"></i>
                  Berlin, Deutschland
                </span>
              </li>
            </ul>
          </Col>
        </Row>
      </Container>
    </footer>
  )
}
