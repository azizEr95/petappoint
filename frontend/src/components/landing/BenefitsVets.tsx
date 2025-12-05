import { Card, Col, Container, Row } from 'react-bootstrap'
import { Link } from '@tanstack/react-router'
import '../../styles/components/landing/BenefitsVets.scss'

export default function BenefitsVets() {
  const benefits = [
    {
      icon: '📊',
      title: 'Effiziente Terminverwaltung',
      description:
        'Automatische Terminplanung spart Zeit und reduziert No-Shows',
    },
    {
      icon: '🎯',
      title: 'Mehr Sichtbarkeit',
      description: 'Erreichen Sie neue Patienten durch unsere Plattform',
    },
    {
      icon: '📱',
      title: 'Digitale Praxisverwaltung',
      description: 'Alle Termine und Patientendaten zentral verwalten',
    },
    {
      icon: '💬',
      title: 'Direkter Kontakt',
      description: 'Kommunizieren Sie einfach mit Ihren Patienten',
    },
  ]

  return (
    <section id="for-vets" className="section-padding benefits-vets-section">
      <Container>
        <div className="text-center mb-5">
          <h2 className="section-title">Vorteile für Tierärzte</h2>
          <p className="section-subtitle">
            Über 500 Praxen vertrauen bereits auf vetilib
          </p>
        </div>

        <Row className="g-4 mb-5">
          {benefits.map((benefit, index) => (
            <Col key={index} md={6} lg={3}>
              <Card className="benefit-card h-100 border-0 shadow-sm">
                <Card.Body className="text-center p-4">
                  <div className="benefit-icon mb-3">{benefit.icon}</div>
                  <Card.Title className="h5 mb-2">{benefit.title}</Card.Title>
                  <Card.Text className="text-muted small">
                    {benefit.description}
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>

        <div className="text-center">
          <div className="demo-preview bg-white p-5 rounded-3 shadow-sm mb-4 mx-auto">
            <h5 className="mb-3">Praxis-Dashboard Vorschau</h5>
            <div className="d-flex flex-column gap-2">
              <div className="d-flex align-items-center p-3 bg-light rounded">
                <i className="bi bi-calendar-check text-success me-3 icon-lg"></i>
                <div className="text-start flex-grow-1">
                  <strong>Heute: 12 Termine</strong>
                  <div className="text-muted small">Nächster in 15 Min</div>
                </div>
              </div>
              <div className="d-flex align-items-center p-3 bg-light rounded">
                <i className="bi bi-people text-primary me-3 icon-lg"></i>
                <div className="text-start flex-grow-1">
                  <strong>47 neue Patienten</strong>
                  <div className="text-muted small">Diesen Monat</div>
                </div>
              </div>
              <div className="d-flex align-items-center p-3 bg-light rounded">
                <i className="bi bi-star-fill text-warning me-3 icon-lg"></i>
                <div className="text-start flex-grow-1">
                  <strong>4.8 ★ Bewertung</strong>
                  <div className="text-muted small">128 Bewertungen</div>
                </div>
              </div>
            </div>
          </div>

          <Link
            to="/registration/veterinary"
            className="btn btn-success btn-lg px-5 py-3"
          >
            <i className="bi bi-building me-2"></i>
            Praxis jetzt anmelden
          </Link>
          <div className="mt-3">
            <small className="text-muted">
              Kostenlos für die ersten 3 Monate
            </small>
          </div>
        </div>
      </Container>

      <style>{`
        .benefit-card {
          transition: transform 0.3s, box-shadow 0.3s;
          border-radius: 12px;
        }

        .benefit-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12) !important;
        }

        .benefit-icon {
          font-size: 2.5rem;
        }

        .demo-preview {
          border: 2px dashed #dee2e6;
        }
      `}</style>
    </section>
  )
}
