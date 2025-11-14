import { Button, Col, Container, Form, Row } from 'react-bootstrap'
import { Link } from '@tanstack/react-router'
import styles from '../../styles/footer.modules.css'

export default function Footer() {
  return (
    <footer id="contact" className={`${styles.footer} bg-dark text-white pt-5 pb-3`}>
      <Container>
        <Row className="g-4">
          {/* Logo & Description */}
          <Col lg={3} md={6}>
            <h4 className="fw-bold text-success mb-3">vetlib</h4>
            <p className="text-light small">
              Ihre moderne Plattform für einfache und schnelle
              Tierarzt-Terminbuchungen.
            </p>
            <div className="d-flex gap-2 mt-3">
              <a href="#" className={styles.socialLink}>
                <i className="bi bi-facebook"></i>
              </a>
              <a href="#" className={styles.socialLink}>
                <i className="bi bi-instagram"></i>
              </a>
              <a href="#" className={styles.socialLink}>
                <i className="bi bi-twitter"></i>
              </a>
              <a href="#" className={styles.socialLink}>
                <i className="bi bi-linkedin"></i>
              </a>
            </div>
          </Col>

          {/* Navigation */}
          <Col lg={2} md={6}>
            <h6 className="fw-bold mb-3">Navigation</h6>
            <ul className={`${styles.footerLinks} list-unstyled`}>
              <li>
                <Link to="/">Start</Link>
              </li>
              <li>
                <a href="#how-it-works">So funktioniert's</a>
              </li>
              <li>
                <a href="#for-vets">Für Tierärzte</a>
              </li>
              <li>
                <Link to="/search">Tierarzt finden</Link>
              </li>
            </ul>
          </Col>

          {/* Legal */}
          <Col lg={2} md={6}>
            <h6 className="fw-bold mb-3">Rechtliches</h6>
            <ul className={`${styles.footerLinks} list-unstyled`}>
              <li>
                <a href="#">Über uns</a>
              </li>
              <li>
                <a href="#">Impressum</a>
              </li>
              <li>
                <a href="#">Datenschutz</a>
              </li>
              <li>
                <a href="#">AGB</a>
              </li>
            </ul>
          </Col>

          {/* Contact */}
          <Col lg={2} md={6}>
            <h6 className="fw-bold mb-3">Kontakt</h6>
            <ul className={`${styles.footerContact} list-unstyled`}>
              <li>
                <i className="bi bi-envelope me-2"></i>
                <a href="mailto:info@vetlib.de">info@vetlib.de</a>
              </li>
              <li>
                <i className="bi bi-telephone me-2"></i>
                <a href="tel:+498001234567">0800 123 4567</a>
              </li>
              <li>
                <i className="bi bi-geo-alt me-2"></i>
                Berlin, Deutschland
              </li>
            </ul>
          </Col>

          {/* Newsletter */}
          <Col lg={3} md={12}>
            <h6 className="fw-bold mb-3">Newsletter</h6>
            <p className="small text-light mb-3">
              Bleiben Sie informiert über neue Funktionen und Angebote
            </p>
            <Form className={styles.newsletterForm}>
              <div className="input-group">
                <Form.Control
                  type="email"
                  placeholder="Ihre E-Mail"
                  className="bg-dark text-white border-secondary"
                />
                <Button variant="success" type="submit">
                  <i className="bi bi-arrow-right"></i>
                </Button>
              </div>
            </Form>
            <div className="mt-3">
              <small className="text-light">App herunterladen:</small>
              <div className="d-flex gap-2 mt-2">
                <Button variant="outline-light" size="sm">
                  <i className="bi bi-apple me-1"></i>
                  iOS
                </Button>
                <Button variant="outline-light" size="sm">
                  <i className="bi bi-google-play me-1"></i>
                  Android
                </Button>
              </div>
            </div>
          </Col>
        </Row>

        <hr className="my-4 bg-secondary" />

        <Row className="align-items-center">
          <Col md={6} className="text-center text-md-start mb-3 mb-md-0">
            <small className="text-light">
              © {new Date().getFullYear()} Vetlib. Alle Rechte vorbehalten.
            </small>
          </Col>
          <Col md={6} className="text-center text-md-end">
            <small className="text-light">
              Made with <i className="bi bi-heart-fill text-danger"></i> for
              animals
            </small>
          </Col>
        </Row>
      </Container>
    </footer>
  )
}
