import '../../styles/components/booking/BookingStepper.scss'

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
    <div className="booking-stepper mb-4">
      <div className="stepper-container">
        {steps.map((step, index) => (
          <div key={step.number} className="stepper-step">
            <div className="stepper-item">
              <div
                className={`stepper-circle ${currentStep >= step.number ? 'active' : ''} ${currentStep > step.number ? 'completed' : ''}`}
              >
                {currentStep > step.number ? (
                  <i className="bi bi-check-lg"></i>
                ) : (
                  step.number
                )}
              </div>
              <div className="stepper-label">{step.label}</div>
            </div>
            {index < steps.length - 1 && (
              <div
                className={`stepper-line ${currentStep > step.number ? 'active' : ''}`}
              ></div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
