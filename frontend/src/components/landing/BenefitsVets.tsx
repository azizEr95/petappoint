import { Link } from '@tanstack/react-router'
import '../../styles/components/landing/BenefitsVets.scss'

export default function BenefitsVets() {
  const benefits = [
    {
      icon: 'bi-graph-up-arrow',
      title: 'Effiziente Terminverwaltung',
      description:
        'Automatische Terminplanung spart Zeit und reduziert No-Shows',
    },
    {
      icon: 'bi-eye',
      title: 'Mehr Sichtbarkeit',
      description: 'Erreichen Sie neue Patienten durch unsere Plattform',
    },
    {
      icon: 'bi-phone-landscape',
      title: 'Digitale Praxisverwaltung',
      description: 'Alle Termine und Patientendaten zentral verwalten',
    },
  ]

  return (
    <section id="for-vets" className="section">
      <div className="container">
        <h2 className="section-title">Vorteile für Tierärzte</h2>
        <p className="section-subtitle">
          Über 500 Praxen vertrauen bereits auf VetiLib
        </p>

        <div className="benefits-grid mb-5">
          {benefits.map((benefit, index) => (
            <div key={index} className="benefit-card">
              <div className="benefit-icon-wrapper">
                <i className={`${benefit.icon} benefit-icon`}></i>
              </div>
              <h3 className="benefit-title">{benefit.title}</h3>
              <p className="benefit-description">{benefit.description}</p>
            </div>
          ))}
        </div>

        <div className="text-center">
          <div className="demo-preview mb-4 mx-auto">
            <h5 className="demo-title mb-4">Praxis-Dashboard Vorschau</h5>
            <div className="d-flex flex-column gap-3">
              <div className="demo-item">
                <i className="bi bi-calendar-check"></i>
                <div className="demo-content">
                  <strong>Heute: 12 Termine</strong>
                  <div className="demo-subtitle">Nächster in 15 Min</div>
                </div>
              </div>
              <div className="demo-item">
                <i className="bi bi-people"></i>
                <div className="demo-content">
                  <strong>47 neue Patienten</strong>
                  <div className="demo-subtitle">Diesen Monat</div>
                </div>
              </div>
              <div className="demo-item">
                <i className="bi bi-star-fill"></i>
                <div className="demo-content">
                  <strong>4.8 ★ Bewertung</strong>
                  <div className="demo-subtitle">128 Bewertungen</div>
                </div>
              </div>
            </div>
          </div>

          <Link
            to="/registration/veterinary"
            className="btn btn-primary btn-lg px-5 py-3 mb-3 text-white"
          >
            <i className="bi bi-building me-2"></i>
            Praxis jetzt anmelden
          </Link>
          <div>
            <small className="text-muted">
              Kostenlos für die ersten 3 Monate
            </small>
          </div>
        </div>
      </div>
    </section>
  )
}
