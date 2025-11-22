import { useEffect, useState } from 'react'
import { createFileRoute, useLocation, useNavigate } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { NextAvailableAppointments } from '../../../components/practice/NextAvailableAppointments'
import '../../../styles/routes/praxisPage.scss'
import { getVeterinaryPracticesById } from '../../../api/VeterinaryPracticeAPI'
import type { AnimalTypeType, ServiceType, VeterinaryPracticesType } from '../../../../../shared/schemas/ZodSchemas'
import { SearchFilter } from '../../../components/common/SearchFilter'


export const Route = createFileRoute('/praxen/$praxisId/')({
  component: VeterinaryPractice,
})

function VeterinaryPractice() {
  const navigate = useNavigate()
  const location = useLocation();
  const { praxisId } = Route.useParams()
  let practice = location.state?.practice
  let filterOptions = location.state?.filterOptions
  const [filterServiceType, setFilterServiceType] = useState<ServiceType[] | null>(filterOptions?.filterServiceType !== undefined ? filterOptions.filterServiceType : null); // if null there is no filter
  const [filterAnimalType, setFilterAnimalType] = useState<AnimalTypeType| null>(filterOptions?.filterAnimalType !== undefined ? filterOptions.filterAnimalType : null); // if null there is no filter
  
  filterOptions = {
    filterAnimalType: filterAnimalType,
    filterServiceType: filterServiceType
  }

  // load VeterinaryPractices:
  const { isError, isSuccess, isPending, data } =
    useQuery<VeterinaryPracticesType>({
      queryKey: ['tierarztpraxen', praxisId],
      queryFn: () => getVeterinaryPracticesById(praxisId),
      retry: false,
      enabled: practice === undefined
    })

  useEffect(() => {
    if (isPending) {
      return;
    }

    if (isError) {
      navigate({ to: '/' });
    }
  }, [isError, isSuccess, isPending])

  const handleClickBack = () => {
    window.history.back()
  }

  if (!isSuccess && practice !== undefined) {
    return;
  }

  practice = data;
  //practice is here always defined, because of the state or useQuery is success
  if(practice=== undefined){
    return;
  }

  return (
    <div className="praxis-page">
      <div className="praxis-header">
        <button className="back-button" onClick={handleClickBack}>
          <i className="bi bi-arrow-left"></i>
          Zurück
        </button>
        <h1>{practice.name}</h1>
      </div>

      <div className="praxis-layout">
        <div className="praxis-info-sidebar">
          {practice.info && (
            <div className="info-description">
              <p>{practice.info}</p>
            </div>
          )}

          <div className="info-section">
            <div className="section-title">
              <i className="bi bi-geo-alt"></i>
              Adresse
            </div>
            <div className="info-content">
              <p>{practice.addresses.street}</p>
              <p>
                {practice.addresses.citycode} {practice.addresses.city}
              </p>
              <p>{practice.addresses.country}</p>
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
                <a href={`mailto:${practice.infoemail}`}>{practice.infoemail}</a>
              </p>
              {practice?.website && (
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

        <div className="praxis-appointments">
          <div className="appointments-header-section">
            <h2>Verfügbare Termine</h2>
            <SearchFilter filterOptions={filterOptions} setFilterServiceType={setFilterServiceType} setFilterAnimalType={setFilterAnimalType} practicePage={practice}/>
          </div>
          <NextAvailableAppointments praxisID={practice.id.toString()}  filterOptions={filterOptions}/>
        </div>
      </div>
    </div>
  )
}
