import { createFileRoute } from '@tanstack/react-router'
import { Container } from 'react-bootstrap'
import { useTitle } from '@/utils/useTitle'
import '../../styles/pages/legal.scss'

export const Route = createFileRoute('/legal/agb')({
  component: AGB,
})

function AGB() {
  useTitle('Allgemeine Geschäftsbedingungen')

  return (
    <main className="legal-page">
      <section className="legal-hero">
        <Container>
          <h1>Allgemeine Geschäftsbedingungen (AGB)</h1>
        </Container>
      </section>

      <section className="legal-content">
        <Container>
          <div className="legal-text">
            <h2>1. Geltungsbereich</h2>
            <p>
              Diese AGB regeln die Nutzung der VetiLib-Plattform für Tierhalter und
              Tiermedizinische Praxen.
            </p>

            <h2>2. Registrierung und Nutzungskonto</h2>
            <p>
              Die Nutzung von VetiLib erfordert eine kostenlose Registrierung. Sie sind
              verpflichtet, wahrheitsgemäße Angaben zu machen und diese aktuell zu halten.
            </p>

            <h2>3. Gebühren</h2>
            <p>
              Die Nutzung von VetiLib für Tierhalter ist kostenlos. Für Tiermedizinische Praxen
              können anfallen (siehe separate Vereinbarung).
            </p>

            <h2>4. Pflichten des Nutzers</h2>
            <p>
              Sie verpflichten sich:
            </p>
            <ul>
              <li>Die Plattform nur für legitime Zwecke zu nutzen</li>
              <li>Keine fremden Konten zu nutzen</li>
              <li>Keine illegalen oder schädlichen Aktivitäten durchzuführen</li>
              <li>Die Rechte anderer Nutzer zu respektieren</li>
            </ul>

            <h2>5. Haftung</h2>
            <p>
              VetiLib haftet nicht für Schäden, die durch die Nutzung oder Unmöglichkeit der
              Nutzung der Plattform entstehen, soweit diese nicht auf Vorsatz oder grobe
              Fahrlässigkeit zurückzuführen sind.
            </p>

            <h2>6. Änderungen der AGB</h2>
            <p>
              VetiLib behält sich das Recht vor, diese AGB jederzeit zu ändern. Änderungen
              werden den Nutzern rechtzeitig mitgeteilt.
            </p>

            <h2>7. Kündigung</h2>
            <p>
              Nutzer können ihr Konto jederzeit über die Kontoeinstellungen löschen.
            </p>

            <h2>8. Anwendbares Recht</h2>
            <p>
              Diese AGB unterliegen deutschem Recht.
            </p>
          </div>
        </Container>
      </section>
    </main>
  )
}
