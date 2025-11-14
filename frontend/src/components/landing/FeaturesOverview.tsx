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

        <div className="steps-grid">
          {steps.map((step) => (
            <div key={step.number} className="step-card">
              <div className="step-number-badge">{step.number}</div>
              <div className="step-icon">{step.icon}</div>
              <h3 className="step-title">{step.title}</h3>
              <p className="step-description">{step.description}</p>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        .steps-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: var(--spacing-lg);
          margin-top: var(--spacing-xl);
        }

        .step-card {
          background: white;
          padding: var(--spacing-xl);
          border-radius: var(--radius-lg);
          box-shadow: var(--shadow-sm);
          text-align: center;
          transition: transform 0.3s, box-shadow 0.3s;
        }

        .step-card:hover {
          transform: translateY(-5px);
          box-shadow: var(--shadow-lg);
        }

        .step-number-badge {
          width: 50px;
          height: 50px;
          margin: 0 auto 1.5rem;
          background: var(--color-primary);
          color: white;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          font-size: 1.5rem;
        }

        .step-icon {
          font-size: 3.5rem;
          margin-bottom: 1rem;
        }

        .step-title {
          font-size: 1.5rem;
          font-weight: 600;
          color: var(--color-primary);
          margin-bottom: 0.75rem;
        }

        .step-description {
          color: var(--color-text-light);
          font-size: 1rem;
          line-height: 1.6;
          margin: 0;
        }

        @media (max-width: 768px) {
          .steps-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </section>
  )
}
