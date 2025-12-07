import { Carousel, Col, Container, Row } from 'react-bootstrap'
import '../../styles/components/landing/Testimonials.scss'

export default function Testimonials() {
  const testimonials = [
    {
      name: 'Anna M.',
      role: 'Hundebesitzerin',
      text: 'Super einfache Buchung! Habe innerhalb von 5 Minuten einen Termin für meinen Hund gefunden. Die Terminerinnerung war auch sehr hilfreich.',
      rating: 5,
    },
    {
      name: 'Dr. Schmidt',
      role: 'Tierarztpraxis München',
      text: 'vetilib hat unsere Terminverwaltung revolutioniert. Weniger Anrufe, weniger No-Shows, zufriedenere Patienten.',
      rating: 5,
    },
    {
      name: 'Peter K.',
      role: 'Katzenbesitzer',
      text: 'Endlich kann ich auch abends nach der Arbeit Termine buchen. Die Bewertungen haben mir geholfen, den richtigen Tierarzt zu finden.',
      rating: 5,
    },
  ]

  const partnerLogos = [
    { name: 'Tierärzteverband', icon: '🏥' },
    { name: 'Tierschutzbund', icon: '🐾' },
    { name: 'Fachverband', icon: '⚕️' },
    { name: 'Qualitätssiegel', icon: '✓' },
  ]

  return (
    <section className="testimonials-section section-padding">
      <Container>
        <div className="text-center mb-5">
          <h2 className="section-title">Was unsere Nutzer sagen</h2>
          <p className="section-subtitle">
            Erfahrungen von Tierhaltern und Tierärzten
          </p>
        </div>

        <Carousel className="testimonial-carousel mb-5" indicators={false}>
          {testimonials.map((testimonial, index) => (
            <Carousel.Item key={index}>
              <div className="testimonial-card">
                <div className="testimonial-avatar mb-4">
                  {testimonial.name.charAt(0)}
                </div>
                <div className="testimonial-info mb-3">
                  <strong className="testimonial-name">{testimonial.name}</strong>
                  <div className="testimonial-role">{testimonial.role}</div>
                </div>
                <div className="star-rating mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <i key={i} className="bi bi-star-fill"></i>
                  ))}
                </div>
                <p className="testimonial-text">
                  "{testimonial.text}"
                </p>
              </div>
            </Carousel.Item>
          ))}
        </Carousel>

        <div className="partners-section">
          <h5 className="partners-title">Vertrauenspartner</h5>
          <Row className="justify-content-center">
            {partnerLogos.map((partner, index) => (
              <Col key={index} xs={6} md={3} className="mb-3">
                <div className="partner-logo">
                  <div className="partner-icon">
                    {partner.icon}
                  </div>
                  <small className="partner-name">{partner.name}</small>
                </div>
              </Col>
            ))}
          </Row>
        </div>
      </Container>
    </section>
  )
}
