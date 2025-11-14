import type { VeterinaryPracticesType } from '../../../shared/schemas/ZodSchemas'
import '../styles/veterinaryPracticeCard.modules.css'
import type { MouseEvent } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { NextAvailableAppointments } from './NextAvailableAppointments'

type VeterinaryPracticeCardProps = {
  praxis: VeterinaryPracticesType
}

export function VeterinaryPracticeCard({
  praxis,
}: VeterinaryPracticeCardProps) {
  const navigate = useNavigate()

  const openPraxisPage = (e: MouseEvent<HTMLDivElement>) => {
    e.preventDefault()
    navigate({
      to: '/praxen/$praxisId',
      params: {
        praxisId: praxis.id.toString(),
      },
      state: {
        praxis: praxis,
      },
    })
  }

  return (
    <div className="praxis-card-modern">
      <div className="card-content">
        <div className="praxis-info-section">
          <div className="praxis-info-clickable" onClick={openPraxisPage}>
            <h3 className="praxis-name">{praxis.name}</h3>
            {praxis.info && <p className="praxis-description">{praxis.info}</p>}

            <div className="praxis-details">
              <div className="detail-item">
                <i className="bi bi-geo-alt"></i>
                <div>
                  <div>{praxis.addresses.street}</div>
                  <div>
                    {praxis.addresses.citycode} {praxis.addresses.city}
                  </div>
                </div>
              </div>

              <div className="detail-item">
                <i className="bi bi-telephone"></i>
                <a href={`tel:${praxis.phone}`}>{praxis.phone}</a>
              </div>

              <div className="detail-item">
                <i className="bi bi-envelope"></i>
                <a href={`mailto:${praxis.infoemail}`}>{praxis.infoemail}</a>
              </div>

              {praxis.website && (
                <div className="detail-item">
                  <i className="bi bi-globe"></i>
                  <a
                    href={praxis.website}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Website
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="calendar-section">
          <h4 className="calendar-title">
            <i className="bi bi-calendar-check"></i>
            Verfügbare Termine
          </h4>
          <div className="calendar-wrapper">
            <NextAvailableAppointments praxisID={praxis.id.toString()} />
          </div>
        </div>
      </div>

      <style>{`
        .praxis-card-modern {
          background: white;
          border-radius: var(--radius-lg);
          box-shadow: var(--shadow-md);
          min-height: 550px;
          width: 100%;
          overflow: visible;
          transition: all 0.3s ease;
          margin-bottom: var(--spacing-lg);
        }

        .praxis-card-modern:hover {
          transform: translateY(-4px);
          box-shadow: var(--shadow-lg);
        }

        .card-content {
          display: grid;
          grid-template-columns: 1fr 1fr;
          min-height: 550px;
          gap: 0;
        }

        .praxis-info-section {
          padding: var(--spacing-xl);
          border-right: 1px solid var(--color-border);
          display: flex;
          flex-direction: column;
        }

        .calendar-section {
          padding: var(--spacing-xl);
          display: flex;
          flex-direction: column;
          background: var(--color-bg-light);
        }

        .praxis-info-clickable {
          cursor: pointer;
          flex: 1;
        }

        .praxis-name {
          color: var(--color-primary);
          font-size: 1.5rem;
          font-weight: 700;
          margin-bottom: 0.75rem;
          transition: color 0.2s;
        }

        .praxis-info-clickable:hover .praxis-name {
          color: var(--color-primary-dark);
        }

        .praxis-description {
          color: var(--color-text-light);
          font-size: 0.95rem;
          margin-bottom: 1.5rem;
          line-height: 1.5;
        }

        .praxis-details {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .detail-item {
          display: flex;
          align-items: flex-start;
          gap: 0.75rem;
          font-size: 0.9rem;
        }

        .detail-item i {
          color: var(--color-primary);
          font-size: 1.1rem;
          margin-top: 0.1rem;
          flex-shrink: 0;
        }

        .detail-item a {
          color: var(--color-text-dark);
          text-decoration: none;
          transition: color 0.2s;
        }

        .detail-item a:hover {
          color: var(--color-primary);
        }

        .calendar-title {
          color: var(--color-primary);
          font-size: 1.1rem;
          font-weight: 600;
          margin-bottom: 1rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .calendar-title i {
          font-size: 1.2rem;
        }

        .calendar-wrapper {
          flex: 1;
          overflow-y: visible;
          overflow-x: hidden;
          min-height: 0;
          background: white;
          border-radius: var(--radius-md);
          padding: 1rem;
        }

        .calendar-wrapper::-webkit-scrollbar {
          width: 6px;
        }

        .calendar-wrapper::-webkit-scrollbar-track {
          background: var(--color-bg-light);
          border-radius: 3px;
        }

        .calendar-wrapper::-webkit-scrollbar-thumb {
          background: var(--color-primary-light);
          border-radius: 3px;
        }

        .calendar-wrapper::-webkit-scrollbar-thumb:hover {
          background: var(--color-primary);
        }

        @media (max-width: 768px) {
          .praxis-card-modern {
            height: auto;
          }

          .card-content {
            grid-template-columns: 1fr;
          }

          .praxis-info-section {
            border-right: none;
            border-bottom: 1px solid var(--color-border);
          }

          .calendar-wrapper {
            max-height: 400px;
          }
        }
      `}</style>
    </div>
  )
}
