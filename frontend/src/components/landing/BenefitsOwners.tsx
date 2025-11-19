import { Card, Col, Container, Row } from 'react-bootstrap'
import '../../styles/components/landing/BenefitsOwners.scss'

export default function BenefitsOwners() {
  const benefits = [
    {
      icon: '⏰',
      title: '24/7 Online-Buchung',
      description: 'Buchen Sie Termine jederzeit bequem von zu Hause aus',
    },
    {
      icon: '📍',
      title: 'Tierärzte in Ihrer Nähe',
      description:
        'Finden Sie schnell qualifizierte Tierärzte in Ihrer Umgebung',
    },
    {
      icon: '💬',
      title: 'Echte Bewertungen',
      description: 'Profitieren Sie von Erfahrungen anderer Tierhalter',
    },
    {
      icon: '🔔',
      title: 'Erinnerungen',
      description: 'Automatische Terminerinnerungen per E-Mail oder SMS',
    },
    {
      icon: '📋',
      title: 'Zentrale Übersicht',
      description: 'Alle Termine und Behandlungen an einem Ort',
    },
    {
      icon: '💰',
      title: 'Transparent',
      description: 'Klare Preisinformationen ohne versteckte Kosten',
    },
  ]

  return (
    <section className="section-padding">
      <Container>
        <div className="text-center">
          <h2 className="section-title">Vorteile für Tierhalter</h2>
          <p className="section-subtitle">
            Warum über 10.000 Tierhalter uns bereits vertrauen
          </p>
        </div>

        <Row className="g-4">
          {benefits.map((benefit, index) => (
            <Col key={index} md={6} lg={4}>
              <Card className="benefit-card h-100 border-0 shadow-sm">
                <Card.Body className="text-center p-4">
                  <div className="benefit-icon mb-3">{benefit.icon}</div>
                  <Card.Title className="h5 mb-2">{benefit.title}</Card.Title>
                  <Card.Text className="text-muted">
                    {benefit.description}
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>
    </section>
  )
}
