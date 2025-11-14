import styles from '../styles/bookingStepper.modules.css'

interface BookingStepperProps {
  currentStep: 1 | 2 | 3
}

export default function BookingStepper({ currentStep }: BookingStepperProps) {
  const steps = [
    { number: 1, label: 'Terminart' },
    { number: 2, label: 'Tier auswählen' },
    { number: 3, label: 'Bestätigung' },
  ]

  return (
    <div className={`${styles.bookingStepper} mb-4`}>
      <div className={styles.stepperContainer}>
        {steps.map((step, index) => (
          <div key={step.number} className={styles.stepperStep}>
            <div className={styles.stepperItem}>
              <div
                className={`${styles.stepperCircle} ${currentStep >= step.number ? styles.active : ''} ${currentStep > step.number ? styles.completed : ''}`}
              >
                {currentStep > step.number ? (
                  <i className="bi bi-check-lg"></i>
                ) : (
                  step.number
                )}
              </div>
              <div className={styles.stepperLabel}>{step.label}</div>
            </div>
            {index < steps.length - 1 && (
              <div
                className={`${styles.stepperLine} ${currentStep > step.number ? styles.active : ''}`}
              ></div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
