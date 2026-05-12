import '../../styles/components/landing/BenefitsOwners.scss'

export default function BenefitsOwners() {
  const benefits = [
    {
      icon: 'bi-clock-fill',
      title: '24/7 Online-Buchung',
      description: 'Buchen Sie Termine jederzeit bequem von zu Hause aus',
    },
    {
      icon: 'bi-geo-alt-fill',
      title: 'Tierärzte in Ihrer Nähe',
      description:
        'Finden Sie schnell qualifizierte Tierärzte in Ihrer Umgebung',
    },
    {
      icon: 'bi-chat-dots-fill',
      title: 'Echte Bewertungen',
      description: 'Profitieren Sie von Erfahrungen anderer Tierhalter',
    },
    {
      icon: 'bi-bell-fill',
      title: 'Erinnerungen',
      description: 'Automatische Terminerinnerungen per E-Mail oder SMS',
    },
    {
      icon: 'bi-clipboard-check-fill',
      title: 'Zentrale Übersicht',
      description: 'Alle Termine und Behandlungen an einem Ort',
    },
    {
      icon: 'bi-cash-stack',
      title: 'Transparent',
      description: 'Klare Preisinformationen ohne versteckte Kosten',
    },
  ]

  return (
    <section id="benefits-owners" className="section">
      <div className="container">
        <h2 className="section-title">Vorteile für Tierhalter</h2>
        <p className="section-subtitle">
          Warum über 10.000 Tierhalter uns bereits vertrauen
        </p>

        <div className="benefits-grid">
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
      </div>
    </section>
  )
}
