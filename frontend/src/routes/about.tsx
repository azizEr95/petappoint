import { createFileRoute } from '@tanstack/react-router'
import { Container } from 'react-bootstrap'
import { useTitle } from '@/utils/useTitle'
import '../styles/pages/about.scss'

export const Route = createFileRoute('/about')({
  component: About,
})

function About() {
  useTitle('Über uns')

  return (
    <main className="about-page">
      <section className="about-hero">
        <Container>
          <h1>Über petappoint</h1>
        </Container>
      </section>

      <section className="about-section">
        <Container>
          <div className="about-content">
            <h2>Unsere Mission</h2>
            <p>
              petappoint verbindet Tierhalter mit qualifizierten Tierärztinnen und Tierärzten.
              Wir glauben, dass die Gesundheit von Haustieren zu wichtig ist, um bei der Buchung
              von Terminen Komplikationen zu haben.
            </p>
            <p>
              Unser Ziel ist es, den gesamten Prozess von der Suche über die Buchung bis zur
              Behandlung so einfach und transparent wie möglich zu gestalten.
            </p>
          </div>
        </Container>
      </section>

      <section className="about-team">
        <Container>
          <div className="team-image-wrapper">
            <img src="/petappoint-teambild-1200x800.jpg" alt="petappoint Team" className="team-image" />
          </div>
        </Container>
      </section>

      <section className="about-section">
        <Container>
          <div className="about-content">
            <h2>Wie wir arbeiten</h2>
            <p>
              Wir entwickeln Technologie, die Tierhaltern hilft, den richtigen Tierarzt zu finden,
              und Tierärztinnen und Tierärzte unterstützen, ihre Praxen effizienter zu führen.
            </p>
            <p>
              Mit petappoint sparen Sie Zeit, reduzieren Verwaltungsaufwand und können sich mehr auf
              das konzentrieren, was zählt: die beste Betreuung für Ihre Patienten und Haustiere.
            </p>
          </div>
        </Container>
      </section>
    </main>
  )
}
