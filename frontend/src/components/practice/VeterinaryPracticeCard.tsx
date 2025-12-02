import { useQueryClient } from '@tanstack/react-query'
import '../../styles/components/practice/VeterinaryPracticeCard.scss'
import { useNavigate } from '@tanstack/react-router'
import { NextAvailableAppointments } from './NextAvailableAppointments.tsx'
import { FavoritePractice } from './FavoritePractice.tsx'
import type { MouseEvent } from 'react'
import type { AppointmentFilterType, VeterinaryPracticesType } from '../../../../shared/schemas/ZodSchemas'


type VeterinaryPracticeCardProps = {
  practice: VeterinaryPracticesType
  filterOptions: AppointmentFilterType
}

export function VeterinaryPracticeCard({
  practice,
  filterOptions
}: VeterinaryPracticeCardProps) {
  const queryClient = useQueryClient();
  const navigate = useNavigate()

  const openPraxisPage = (e: MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    queryClient.invalidateQueries({ queryKey: ['AnimaltypesPractice'] });
    queryClient.invalidateQueries({ queryKey: ['allAvailableServiceTypes'] });
    navigate({
      to: '/practices/$practiceId',
      params: {
        practiceId: practice.id.toString(),
      },
      state: {
        practice: practice,
        filterOptions: filterOptions
      },
    })
  }

  return (
    <div className="praxis-card-modern">
      <div className="card-content">
        <div className="praxis-info-section">
          <div className="praxis-info-clickable" onClick={openPraxisPage}>
            <h3 className="praxis-name">
              {practice.name} 
              <FavoritePractice practice={practice}/>
              </h3>
            {practice.info && <p className="praxis-description">{practice.info}</p>}
            
            <div className="praxis-details">
              <div className="detail-item">
                <i className="bi bi-geo-alt"></i>
                <div>
                  <div>{practice.addresses.street}</div>
                  <div>
                    {practice.addresses.citycode} {practice.addresses.city}
                  </div>
                </div>
              </div>

              <div className="detail-item">
                <i className="bi bi-telephone"></i>
                <a href={`tel:${practice.phone}`}>{practice.phone}</a>
              </div>

              <div className="detail-item">
                <i className="bi bi-envelope"></i>
                <a href={`mailto:${practice.infoemail}`}>{practice.infoemail}</a>
              </div>

              {practice.website && (
                <div className="detail-item">
                  <i className="bi bi-globe"></i>
                  <a
                    href={practice.website}
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
            <NextAvailableAppointments practiceId={practice.id.toString()} filterOptions={filterOptions}/>
          </div>
        </div>
      </div>
    </div>
  )
}
