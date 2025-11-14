import { Button, Container } from 'react-bootstrap'
import { Link } from '@tanstack/react-router'

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

      <style>{`
        .cta-banner {
          background: linear-gradient(135deg, var(--primary-green) 0%, var(--primary-green-dark) 100%);
          position: relative;
          overflow: hidden;
        }

        .cta-banner::before {
          content: '';
          position: absolute;
          top: -50%;
          left: -50%;
          width: 200%;
          height: 200%;
          background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%);
          animation: pulse 15s ease-in-out infinite;
        }

        @keyframes pulse {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(-10%, -10%) scale(1.1); }
        }

        .cta-banner .container {
          position: relative;
          z-index: 1;
        }
      `}</style>
    </section>
  )
}
