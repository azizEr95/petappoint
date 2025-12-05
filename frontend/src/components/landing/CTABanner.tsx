import { Container } from 'react-bootstrap'
import { Link } from '@tanstack/react-router'
import '../../styles/components/landing/CTABanner.scss'

export default function CTABanner() {
  return (
    <section className="cta-banner section-padding text-white">
      <Container className="text-center">
        <h2 className="display-4 fw-bold mb-4">
          Bereit für Ihren nächsten Tierarztbesuch?
        </h2>
        <p className="lead mb-5">
          Finden Sie jetzt den passenden Tierarzt und buchen Sie Ihren Termin in
          wenigen Minuten
        </p>
        <div className="d-flex flex-wrap justify-content-center gap-3">
          <Link
            to="/search"
            search={{ name: '', address: '', animalType: '', serviceType: '' }}
            className="btn btn-light btn-lg px-5 py-3 fw-bold"
          >
            <i className="bi bi-search me-2"></i>
            Jetzt Termin finden
          </Link>
          <Link
            to="/registration/veterinary"
            className="btn btn-outline-light btn-lg px-5 py-3 fw-bold"
          >
            <i className="bi bi-building me-2"></i>
            Praxis registrieren
          </Link>
        </div>
      </Container>
    </section>
  )
}
