import { createFileRoute } from '@tanstack/react-router'
import { Container } from 'react-bootstrap'
import { useTitle } from '@/utils/useTitle'
import '../../styles/pages/legal.scss'

export const Route = createFileRoute('/legal/impressum')({
  component: Impressum,
})

function Impressum() {
  useTitle('Impressum')

  return (
    <main className="legal-page">
      <section className="legal-hero">
        <Container>
          <h1>Impressum</h1>
        </Container>
      </section>

      <section className="legal-content">
        <Container>
          <div className="legal-text">
            <h2>Anbieter</h2>
            <p>
              VetiLib GmbH<br />
              Beispielstraße 123<br />
              10115 Berlin<br />
              Deutschland
            </p>

            <h2>Kontakt</h2>
            <p>
              E-Mail: info@vetilib.de<br />
              Telefon: +49 (0) 800 123 4567
            </p>

            <h2>Geschäftsführer</h2>
            <p>
              [Name eintragen]
            </p>

            <h2>Handelsregister</h2>
            <p>
              Handelsregister: HRB 123456<br />
              Registergericht: Amtsgericht Berlin
            </p>

            <h2>Umsatzsteuer</h2>
            <p>
              Umsatzsteuer-Identifikationsnummer: DE 123 456 789
            </p>

            <h2>Verantwortlich für den Inhalt</h2>
            <p>
              Gemäß § 7 Abs. 1 TMG ist der Anbieter dieser Website für eigene Inhalte auf diesen Seiten
              nach den allgemeinen Gesetzen verantwortlich.
            </p>
          </div>
        </Container>
      </section>
    </main>
  )
}
