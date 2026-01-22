import { createFileRoute } from '@tanstack/react-router'
import { Container } from 'react-bootstrap'
import { useTitle } from '@/utils/useTitle'
import '../../styles/pages/legal.scss'

export const Route = createFileRoute('/legal/datenschutz')({
  component: Datenschutz,
})

function Datenschutz() {
  useTitle('Datenschutz')

  return (
    <main className="legal-page">
      <section className="legal-hero">
        <Container>
          <h1>Datenschutzerklärung</h1>
        </Container>
      </section>

      <section className="legal-content">
        <Container>
          <div className="legal-text">
            <h2>1. Verantwortlicher</h2>
            <p>
              VetiLib GmbH<br />
              Beispielstraße 123<br />
              10115 Berlin<br />
              E-Mail: datenschutz@vetilib.de
            </p>

            <h2>2. Erhebung und Verarbeitung personenbezogener Daten</h2>
            <p>
              Wir erheben und verarbeiten personenbezogene Daten nur soweit dies zur Erbringung
              unserer Dienstleistungen erforderlich ist. Dies umfasst insbesondere:
            </p>
            <ul>
              <li>Kontaktdaten (Name, E-Mail, Telefon)</li>
              <li>Adressdaten</li>
              <li>Informationen zu Ihren Haustieren</li>
              <li>Terminbuchungen und -history</li>
            </ul>

            <h2>3. Rechtsgrundlage</h2>
            <p>
              Die Verarbeitung erfolgt auf Grundlage von Artikel 6 Abs. 1 lit. b DSGVO
              (Erfüllung eines Vertrags) und lit. f DSGVO (berechtigte Interessen).
            </p>

            <h2>4. Ihre Rechte</h2>
            <p>
              Sie haben das Recht, jederzeit:
            </p>
            <ul>
              <li>Auskunft über Ihre gespeicherten Daten zu erhalten</li>
              <li>Ihre Daten korrigieren zu lassen</li>
              <li>Ihre Daten löschen zu lassen</li>
              <li>Der Verarbeitung zu widersprechen</li>
            </ul>

            <h2>5. Kontakt zum Datenschutzbeauftragten</h2>
            <p>
              Bei Fragen zur Verarbeitung Ihrer Daten kontaktieren Sie uns unter:<br />
              E-Mail: datenschutz@vetilib.de
            </p>
          </div>
        </Container>
      </section>
    </main>
  )
}
