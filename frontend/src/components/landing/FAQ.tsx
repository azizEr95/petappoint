import { Accordion, Col, Container, Row } from 'react-bootstrap'
import '../../styles/components/landing/FAQ.scss'

export default function FAQ() {
  const faqTierhalter = [
    {
      question: 'Ist die Nutzung von petappoint kostenlos?',
      answer:
        'Ja, die Terminbuchung über petappoint ist für Tierhalter komplett kostenlos.',
    },
    {
      question: 'Kann ich einen Termin stornieren?',
      answer:
        'Ja, Sie können Termine bis zu 24 Stunden vor dem Termin kostenlos stornieren.',
    },
    {
      question: 'Wie erhalte ich eine Terminerinnerung?',
      answer:
        'Sie erhalten automatisch eine E-Mail-Erinnerung 24 Stunden vor Ihrem Termin. Optional können Sie auch SMS-Benachrichtigungen aktivieren.',
    },
    {
      question: 'Was passiert bei einem Notfall?',
      answer:
        'Bei Notfällen empfehlen wir, direkt die Tierarztpraxis anzurufen. Viele Praxen bieten auch eine Notfall-Schnellbuchung an.',
    },
  ]

  const faqTieraerzte = [
    {
      question: 'Wie viel kostet petappoint für meine Praxis?',
      answer:
        'Die ersten 3 Monate sind kostenlos. Danach zahlen Sie eine faire monatliche Gebühr abhängig von der Praxisgröße. Keine versteckten Kosten.',
    },
    {
      question: 'Wie funktioniert die Integration?',
      answer:
        'Die Einrichtung dauert ca. 15 Minuten. Unser Support-Team hilft Ihnen bei der Anbindung an Ihr bestehendes Praxisverwaltungssystem.',
    },
    {
      question: 'Kann ich Terminarten selbst festlegen?',
      answer:
        'Ja, Sie haben volle Kontrolle über Terminarten, Dauer, Preise und Verfügbarkeiten.',
    },
    {
      question: 'Was passiert mit meinen Patientendaten?',
      answer:
        'Alle Daten werden DSGVO-konform in Deutschland gespeichert. Sie behalten die volle Kontrolle über Ihre Patientendaten.',
    },
  ]

  return (
    <section className="faq-section section-padding">
      <Container>
        <div className="text-center mb-5">
          <h2 className="section-title">Häufig gestellte Fragen</h2>
          <p className="section-subtitle">
            Antworten auf die wichtigsten Fragen
          </p>
        </div>

        <Row>
          <Col lg={6} className="mb-4">
            <h4 className="faq-category-title mb-4">
              <i className="bi bi-person-circle me-2"></i>
              Für Tierhalter
            </h4>
            <Accordion className="faq-accordion">
              {faqTierhalter.map((faq, index) => (
                <Accordion.Item key={index} eventKey={String(index)}>
                  <Accordion.Header>{faq.question}</Accordion.Header>
                  <Accordion.Body>{faq.answer}</Accordion.Body>
                </Accordion.Item>
              ))}
            </Accordion>
          </Col>

          <Col lg={6} className="mb-4">
            <h4 className="faq-category-title mb-4">
              <i className="bi bi-building me-2"></i>
              Für Tierärzte
            </h4>
            <Accordion className="faq-accordion">
              {faqTieraerzte.map((faq, index) => (
                <Accordion.Item key={index} eventKey={String(index)}>
                  <Accordion.Header>{faq.question}</Accordion.Header>
                  <Accordion.Body>{faq.answer}</Accordion.Body>
                </Accordion.Item>
              ))}
            </Accordion>
          </Col>
        </Row>

        <div className="text-center mt-5">
          <p className="faq-contact">
            Weitere Fragen?{' '}
            <a href="#contact">
              Kontaktieren Sie uns
            </a>
          </p>
        </div>
      </Container>
    </section>
  )
}
