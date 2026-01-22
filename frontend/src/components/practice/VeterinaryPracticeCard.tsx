import { useQuery, useQueryClient } from '@tanstack/react-query'
import '../../styles/components/practice/VeterinaryPracticeCard.scss'
import { useNavigate } from '@tanstack/react-router'
import { getAnimaltypesFromPractice } from '../../api/AnimalTypeAPI.ts'
import { NextAvailableAppointments } from './NextAvailableAppointments.tsx'
import { FavoritePractice } from './FavoritePractice.tsx'
import type { MouseEvent } from 'react'
import type {
  AnimalTypeType,
  AppointmentFilterType,
  VeterinaryPracticesType,
} from 'vetilib-shared/schemas/ZodSchemas'
import { useLoginContext } from '@/LoginContext.ts'

type VeterinaryPracticeCardProps = {
  practice: VeterinaryPracticesType
  filterOptions: AppointmentFilterType
}

export function VeterinaryPracticeCard({
  practice,
  filterOptions,
}: VeterinaryPracticeCardProps) {
   const {login} = useLoginContext();
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  const openPraxisPage = (e: MouseEvent<HTMLDivElement>) => {
    e.preventDefault()
    queryClient.invalidateQueries({ queryKey: ['AnimaltypesPractice'] })
    queryClient.invalidateQueries({ queryKey: ['allAvailableServiceTypes'] })
    navigate({
      to: '/practices/$practiceId',
      params: {
        practiceId: practice.id.toString(),
      },
      state: {
        practice: practice,
        filterOptions: filterOptions,
      },
    })
  }

  // get all AnimalTypes from practice
  const {
    isSuccess: isSuccessAnimaltypesPractice,
    data: dataAnimaltypesPractice,
  } = useQuery<Array<AnimalTypeType>>({
    queryKey: ['AnimaltypesPractice', practice.id],
    queryFn: () => getAnimaltypesFromPractice(practice.id.toString()),
    retry: false
  })

  let animalTypesString = ''
  if (isSuccessAnimaltypesPractice) {
    for (const animalType of dataAnimaltypesPractice) {
      if (animalTypesString !== '') {
        animalTypesString = animalTypesString + ', '
      }
      animalTypesString = animalTypesString + animalType.name
    }
  }

  return (
    <div className="praxis-card-modern">
      <div className="card-content" data-testid={`practice-card-${practice.id}`}>
        <div className="praxis-info-section">
          <div className="praxis-info-clickable" onClick={openPraxisPage}>
            <h3 className="praxis-name">
              {practice.name}
              <FavoritePractice practice={practice} />
            </h3>
            <>
              {practice.info && <p className="praxis-description">{practice.info}</p>}
              {animalTypesString !== "" && <p>Tierarten: {animalTypesString}</p>}
            </>


            <div className="praxis-details">
              <div className="detail-item">
                <i className="bi bi-geo-alt"></i>
                <div>
                  <div>{practice.address.street}</div>
                  <div>
                    {practice.address.cityCode} {practice.address.city}
                  </div>
                </div>
              </div>

              <div className="detail-item">
                <i className="bi bi-telephone"></i>
                <a href={`tel:${practice.phone}`}>{practice.phone}</a>
              </div>

              <div className="detail-item">
                <i className="bi bi-envelope"></i>
                <a href={`mailto:${practice.infoEmail}`}>
                  {practice.infoEmail}
                </a>
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
            {login === false || login.role === 'person' && (<>
        <div className="calendar-section">
          <h4 className="calendar-title">
            <i className="bi bi-calendar-check"></i>
            Verfügbare Termine
          </h4>
          <div className="calendar-wrapper">
            <NextAvailableAppointments
              practiceId={practice.id.toString()}
              filterOptions={filterOptions}
            />
          </div>
        </div>
        </>)}
        <div className="calendar-section">
    <div className="alert alert-info d-flex align-items-center" role="alert">
      <i className="bi bi-info-circle me-3" style={{fontSize: '1.5rem'}}></i>
      <p className="mb-0">Als Praxis können Sie keine Termine bei anderen Praxen buchen.</p>
    </div>
  </div>
      </div>
    </div>
  )
}
