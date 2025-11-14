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

      <style>{`
        .booking-stepper {
          background: white;
          padding: 1.5rem;
          border-radius: 12px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
        }

        .stepper-container {
          display: flex;
          align-items: center;
          justify-content: space-between;
          max-width: 600px;
          margin: 0 auto;
        }

        .stepper-step {
          display: flex;
          align-items: center;
          flex: 1;
        }

        .stepper-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          position: relative;
        }

        .stepper-circle {
          width: 48px;
          height: 48px;
          border-radius: 50%;
          background: #e9ecef;
          color: #6c757d;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
          font-size: 1.2rem;
          transition: all 0.3s;
          border: 3px solid #e9ecef;
        }

        .stepper-circle.active {
          background: var(--primary-green);
          color: white;
          border-color: var(--primary-green);
          box-shadow: 0 4px 12px rgba(88, 192, 88, 0.3);
        }

        .stepper-circle.completed {
          background: var(--primary-green-dark);
          border-color: var(--primary-green-dark);
        }

        .stepper-label {
          margin-top: 0.75rem;
          font-size: 0.85rem;
          color: #6c757d;
          font-weight: 500;
          text-align: center;
          white-space: nowrap;
        }

        .stepper-line {
          flex: 1;
          height: 3px;
          background: #e9ecef;
          margin: 0 0.5rem;
          margin-bottom: 2rem;
          transition: background 0.3s;
        }

        .stepper-line.active {
          background: var(--primary-green);
        }

        @media (max-width: 576px) {
          .stepper-circle {
            width: 36px;
            height: 36px;
            font-size: 1rem;
          }

          .stepper-label {
            font-size: 0.75rem;
            max-width: 60px;
            white-space: normal;
          }

          .stepper-line {
            margin: 0 0.25rem;
          }
        }
      `}</style>
    </div>
  )
}
