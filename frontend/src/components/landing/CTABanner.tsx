import { Button, Container } from 'react-bootstrap'
import { Link } from '@tanstack/react-router'
import styles from '../../styles/ctaBanner.modules.css'

export default function CTABanner() {
  return (
    <section className={`${styles.ctaBanner} section-padding text-white`}>
      <Container className="text-center">
        <h2 className="display-4 fw-bold mb-4">
          Bereit für Ihren nächsten Tierarztbesuch?
        </h2>
        <p className="lead mb-5">
          Finden Sie jetzt den passenden Tierarzt und buchen Sie Ihren Termin in
          wenigen Minuten
        </p>
        <div className="d-flex flex-wrap justify-content-center gap-3">
          <Button
            as={Link}
            to="/"
            variant="light"
            size="lg"
            className="px-5 py-3 fw-bold"
            onClick={() => {
              setTimeout(() => {
                document
                  .querySelector('.hero-section')
                  ?.scrollIntoView({ behavior: 'smooth' })
              }, 100)
            }}
          >
            <i className="bi bi-search me-2"></i>
            Jetzt Termin finden
          </Button>
          <Button
            as={Link}
            to="/veterinaryRegistration"
            variant="outline-light"
            size="lg"
            className="px-5 py-3 fw-bold"
          >
            <i className="bi bi-building me-2"></i>
            Praxis registrieren
          </Button>
        </div>
      </Container>
    </section>
  )
}
