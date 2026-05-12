import '../../styles/components/landing/FeaturesOverview.scss'
import { Link } from '@tanstack/react-router'

export default function FeaturesOverview() {
  const steps = [
    {
      number: 1,
      title: 'Registrieren',
      description:
        'Erstellen Sie Ihr kostenloses Konto und fügen Sie Ihre Tiere hinzu',
      icon: 'bi-person-plus-fill',
      link: '/registration/person',
    },
    {
      number: 2,
      title: 'Praxis finden',
      description:
        'Suchen Sie nach Tierarzt, Behandlung oder Klinik in Ihrer Nähe',
      icon: 'bi-search',
      link: '#hero',
    },
    {
      number: 3,
      title: 'Termin buchen',
      description:
        'Wählen Sie einen passenden Termin und buchen Sie direkt online',
      icon: 'bi-calendar-check-fill',
      link: '/search',
    },
  ]

  return (
    <section id="how-it-works" className="section">
      <div className="container">
        <h2 className="section-title">So funktioniert's</h2>
        <p className="section-subtitle">
          In nur 3 einfachen Schritten zum Tierarzttermin
        </p>

        <div className="steps-grid">
          {steps.map((step) => {
            const isAnchor = step.link.startsWith('#')
            const CardContent = (
              <div className="step-card">
                <div className="step-icon-wrapper">
                  <i className={`${step.icon} step-icon`}></i>
                  <div className="step-number-badge">{step.number}</div>
                </div>
                <h3 className="step-title">{step.title}</h3>
                <p className="step-description">{step.description}</p>
              </div>
            )

            return isAnchor ? (
              <a key={step.number} href={step.link} className="step-card-link">
                {CardContent}
              </a>
            ) : (
              <Link key={step.number} to={step.link} className="step-card-link">
                {CardContent}
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}
