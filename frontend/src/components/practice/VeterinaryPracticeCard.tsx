import '../../styles/components/practice/VeterinaryPracticeCard.scss'
import { useNavigate } from '@tanstack/react-router'
import { NextAvailableAppointments } from './NextAvailableAppointments.tsx'
import type { MouseEvent } from 'react'
import type { VeterinaryPracticesType } from '../../../../shared/schemas/ZodSchemas'

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
    </div>
  )
}
