import { useEffect, useState } from 'react'
import {
  createFileRoute,
  useLocation,
  useNavigate,
} from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { NextAvailableAppointments } from '../../components/practice/NextAvailableAppointments'
import '../../styles/routes/praxisPage.scss'
import { getVeterinaryPracticesById } from '../../api/VeterinaryPracticeAPI'
import { PracticeFilterBar } from '../../components/practice/PracticeFilterBar'
import { getAnimaltypesFromPractice } from '../../api/AnimalTypeAPI'
import { FavoritePractice } from '../../components/practice/FavoritePractice'
import type {
  AnimalTypeType,
  VeterinaryPracticesType,
} from 'vetilib-shared/schemas/ZodSchemas'
import { useTitle } from '@/utils/useTitle'
import { useLoginContext } from '@/LoginContext'

export const Route = createFileRoute('/practices/$practiceId')({
  component: VeterinaryPractice,
})

function VeterinaryPractice() {
  const {login} = useLoginContext();
  // useTitle is called later with practice name
  const navigate = useNavigate()
  const location = useLocation()
  const { practiceId } = Route.useParams()
  let filterOptions = location.state.filterOptions
  const [filterServiceType, setFilterServiceType] = useState<Array<number>>(
    filterOptions?.serviceTypeIds !== undefined
      ? filterOptions.serviceTypeIds
      : [],
  )
  const [filterAnimalType, setFilterAnimalType] = useState<Array<number>>(
    filterOptions?.animalTypeIds !== undefined
      ? filterOptions.animalTypeIds
      : [],
  )
  const [filterAnimal, setFilterAnimal] = useState<number | undefined>(
    filterOptions?.animal,
  )

  filterOptions = {
    animalTypeIds: filterAnimalType,
    serviceTypeIds: filterServiceType,
    animal: filterAnimal,
  }

  // load VeterinaryPractices:
  const { isError: isErrorPractice, isSuccess: isSuccessPractice, isPending: isPendingPractice, data: dataPractice } =
    useQuery<VeterinaryPracticesType>({
      queryKey: ['veterinaryPractices', practiceId],
      queryFn: () => getVeterinaryPracticesById(practiceId),
      retry: false
    })

  // get all AnimalTypes from practice
  const {
    isSuccess: isSuccessAnimaltypesPractice,
    data: dataAnimaltypesPractice,
  } = useQuery<Array<AnimalTypeType>>({
    queryKey: ['AnimaltypesPractice', practiceId],
    queryFn: () => getAnimaltypesFromPractice(practiceId),
    retry: false
  })

  useEffect(() => {
    if (isPendingPractice) {
      return
    }

    if (isErrorPractice) {
      navigate({ to: '/' })
    }
  }, [isErrorPractice, isSuccessPractice, isPendingPractice])

  const handleClickBack = () => {
    window.history.back()
  }

  let practice: VeterinaryPracticesType | undefined = undefined;
  useTitle(isSuccessPractice ? dataPractice.name : 'Praxis');
  if (isSuccessPractice) {
    practice = dataPractice
  }

  // practice is here always defined, because of the state or useQuery is success
  if (practice === undefined) {
    return
  }

  let animalTypesString = ''
  if (isSuccessAnimaltypesPractice) {
    for (const animalType of dataAnimaltypesPractice) {
      if (animalTypesString !== '') {
        animalTypesString = animalTypesString + ', '
      }
      animalTypesString = animalTypesString + animalType.name
    }
    if (animalTypesString === '') {
      animalTypesString = 'keine'
    }
  }

  return (
    <div className="praxis-page">
      <div className="praxis-header">
        <button className="back-button" onClick={handleClickBack}>
          <i className="bi bi-arrow-left"></i>
          Zurück
        </button>
        <h1 className="headerPracticePage">
          {practice.name}
          <FavoritePractice practice={practice} />
        </h1>
      </div>

      <div className="praxis-layout">
        <div className="praxis-info-sidebar">
          <div className="info-description">
            {practice.info && <>
              <p>{practice.info}</p>
              <br />
            </>}
            <p>Tierarten: {animalTypesString}</p>
          </div>

          <div className="info-section">
            <div className="section-title">
              <i className="bi bi-geo-alt"></i>
              Adresse
            </div>
            <div className="info-content">
              <p>{practice.address.street}</p>
              <p>
                {practice.address.cityCode} {practice.address.city}
              </p>
              <p>{practice.address.country}</p>
            </div>
          </div>

          <div className="info-section">
            <div className="section-title">
              <i className="bi bi-telephone"></i>
              Kontakt
            </div>
            <div className="info-content">
              <p>
                <a href={`tel:${practice.phone}`}>{practice.phone}</a>
              </p>
              <p>
                <a href={`mailto:${practice.infoEmail}`}>
                  {practice.infoEmail}
                </a>
              </p>
              {practice.website && (
                <p>
                  <a
                    href={practice.website}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <i className="bi bi-globe"></i>
                    Website
                  </a>
                </p>
              )}
            </div>
          </div>
        </div>
              {((login && login.role === 'person')  || (login === false))&& (<>
        <div className="praxis-appointments">
          <div className="appointments-header-section">

            <h2>Verfügbare Termine</h2>
           
          </div>
           
          <PracticeFilterBar
            filterAnimalType={filterAnimalType}
            filterServiceType={filterServiceType}
            filterAnimal={filterAnimal}
            setFilterAnimalType={setFilterAnimalType}
            setFilterServiceType={setFilterServiceType}
            setFilterAnimal={setFilterAnimal}
            practiceId={practiceId}
          />
          <NextAvailableAppointments
            practiceId={practiceId}
            filterOptions={filterOptions}
          />
        </div>
        </>)}<div className="calendar-section">
    <div className="alert alert-info d-flex align-items-center" role="alert">
      <i className="bi bi-info-circle me-3" style={{fontSize: '1.5rem'}}></i>
      <p className="mb-0">Als Praxis können Sie keine Termine bei anderen Praxen buchen.</p>
    </div>
  </div>
      </div>
    </div>
  )
}
