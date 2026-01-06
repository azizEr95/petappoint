import { Container } from 'react-bootstrap'
import { Link } from '@tanstack/react-router'
import '../../styles/components/landing/CTABanner.scss'

export default function CTABanner() {
  return (
    <section className="cta-banner section-padding">
      <Container className="text-center">
        <h2 className="cta-title mb-4">
          Bereit für Ihren nächsten Tierarztbesuch?
        </h2>
        <p className="cta-description mb-5">
          Finden Sie jetzt den passenden Tierarzt und buchen Sie Ihren Termin in
          wenigen Minuten
        </p>
        <div className="cta-buttons">
          <Link
            to="/search"
            search={{ name: '', address: '', animalType: '', serviceType: '' }}
            className="btn btn-cta btn-cta-primary"
          >
            <i className="bi bi-search me-2"></i>
            Jetzt Termin finden
          </Link>
          <Link
            to="/registration/veterinarypractice"
            className="btn btn-cta btn-cta-secondary"
          >
            <i className="bi bi-building me-2"></i>
            Praxis registrieren
          </Link>
        </div>
      </Container>
    </section>
  )
}
