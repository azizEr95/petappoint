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
      text: 'Vetlib hat unsere Terminverwaltung revolutioniert. Weniger Anrufe, weniger No-Shows, zufriedenere Patienten.',
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
    <section className="section-padding bg-light">
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
              <div
                className="testimonial-card bg-white p-5 rounded-3 shadow-sm mx-auto"
                style={{ maxWidth: '700px' }}
              >
                <div className="mb-3">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <i key={i} className="bi bi-star-fill text-warning"></i>
                  ))}
                </div>
                <p className="testimonial-text fs-5 mb-4">
                  "{testimonial.text}"
                </p>
                <div className="d-flex align-items-center">
                  <div
                    className="testimonial-avatar bg-success text-white rounded-circle d-flex align-items-center justify-content-center me-3"
                    style={{
                      width: '50px',
                      height: '50px',
                      fontSize: '1.5rem',
                    }}
                  >
                    {testimonial.name.charAt(0)}
                  </div>
                  <div className="text-start">
                    <strong>{testimonial.name}</strong>
                    <div className="text-muted small">{testimonial.role}</div>
                  </div>
                </div>
              </div>
            </Carousel.Item>
          ))}
        </Carousel>

        <div className="text-center mt-5">
          <h5 className="mb-4 text-muted">Vertrauenspartner</h5>
          <Row className="justify-content-center">
            {partnerLogos.map((partner, index) => (
              <Col key={index} xs={6} md={3} className="mb-3">
                <div className="partner-logo bg-white p-4 rounded shadow-sm">
                  <div
                    className="partner-icon mb-2"
                    style={{ fontSize: '2.5rem' }}
                  >
                    {partner.icon}
                  </div>
                  <small className="text-muted">{partner.name}</small>
                </div>
              </Col>
            ))}
          </Row>
        </div>

        <div className="text-center mt-5 p-4 bg-success bg-opacity-10 rounded">
          <div className="d-flex flex-wrap justify-content-center gap-5">
            <div>
              <div className="fs-2 fw-bold text-success">10.000+</div>
              <div className="text-muted">Zufriedene Tierhalter</div>
            </div>
            <div>
              <div className="fs-2 fw-bold text-success">500+</div>
              <div className="text-muted">Tierarztpraxen</div>
            </div>
            <div>
              <div className="fs-2 fw-bold text-success">50.000+</div>
              <div className="text-muted">Gebuchte Termine</div>
            </div>
          </div>
        </div>

        <div className="text-center mt-4">
          <div className="d-inline-flex align-items-center gap-2 bg-white p-3 rounded shadow-sm">
            <i
              className="bi bi-shield-check text-success"
              style={{ fontSize: '1.5rem' }}
            ></i>
            <div className="text-start">
              <strong className="d-block">DSGVO-konform</strong>
              <small className="text-muted">Ihre Daten sind sicher</small>
            </div>
          </div>
        </div>
      </Container>
    </section>
  )
}
