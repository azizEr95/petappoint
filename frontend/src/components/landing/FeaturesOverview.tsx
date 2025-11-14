import styles from '../../styles/featuresOverview.modules.css'

export default function FeaturesOverview() {
  const steps = [
    {
      number: 1,
      title: 'Registrieren',
      description:
        'Erstellen Sie Ihr kostenloses Konto und fügen Sie Ihre Tiere hinzu',
      icon: '📝',
    },
    {
      number: 2,
      title: 'Praxis finden',
      description:
        'Suchen Sie nach Tierarzt, Behandlung oder Klinik in Ihrer Nähe',
      icon: '🔍',
    },
    {
      number: 3,
      title: 'Termin buchen',
      description:
        'Wählen Sie einen passenden Termin und buchen Sie direkt online',
      icon: '📅',
    },
  ]

  return (
    <section id="how-it-works" className="section">
      <div className="container">
        <h2 className="section-title">So funktioniert's</h2>
        <p className="section-subtitle">
          In nur 3 einfachen Schritten zum Tierarzttermin
        </p>

        <div className={styles.stepsGrid}>
          {steps.map((step) => (
            <div key={step.number} className={styles.stepCard}>
              <div className={styles.stepNumberBadge}>{step.number}</div>
              <div className={styles.stepIcon}>{step.icon}</div>
              <h3 className={styles.stepTitle}>{step.title}</h3>
              <p className={styles.stepDescription}>{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
