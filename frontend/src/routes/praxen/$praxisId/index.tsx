import { useEffect } from 'react'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { NextAvailableAppointments } from '../../../components/practice/NextAvailableAppointments'
import '../../../styles/routes/praxisPage.scss'
import { getVeterinaryPracticesById } from '../../../api/VeterinaryPracticeAPI'
import type { VeterinaryPracticesType } from '../../../../../shared/schemas/ZodSchemas'


export const Route = createFileRoute('/praxen/$praxisId/')({
  component: VeterinaryPractice,
})

function VeterinaryPractice() {
  const navigate = useNavigate()
  const { praxisId } = Route.useParams()

  // load VeterinaryPractices:
  const { isError, isSuccess, isPending, data } =
    useQuery<VeterinaryPracticesType>({
      queryKey: ['tierarztpraxen', praxisId],
      queryFn: () => getVeterinaryPracticesById(praxisId),
      retry: false,
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

  if (!isSuccess) {
    return
  }

  const praxis: VeterinaryPracticesType = data

  return (
    <div className="praxis-page">
      <div className="praxis-header">
        <button className="back-button" onClick={handleClickBack}>
          <i className="bi bi-arrow-left"></i>
          Zurück
        </button>
        <h1>{praxis.name}</h1>
      </div>

      <div className="praxis-layout">
        <div className="praxis-info-sidebar">
          {praxis.info && (
            <div className="info-description">
              <p>{praxis.info}</p>
            </div>
          )}

          <div className="info-section">
            <div className="section-title">
              <i className="bi bi-geo-alt"></i>
              Adresse
            </div>
            <div className="info-content">
              <p>{praxis.addresses.street}</p>
              <p>
                {praxis.addresses.citycode} {praxis.addresses.city}
              </p>
              <p>{praxis.addresses.country}</p>
            </div>
          </div>

          <div className="info-section">
            <div className="section-title">
              <i className="bi bi-telephone"></i>
              Kontakt
            </div>
            <div className="info-content">
              <p>
                <a href={`tel:${praxis.phone}`}>{praxis.phone}</a>
              </p>
              <p>
                <a href={`mailto:${praxis.infoemail}`}>{praxis.infoemail}</a>
              </p>
              {praxis.website && (
                <p>
                  <a
                    href={praxis.website}
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
          </div>
          <NextAvailableAppointments praxisID={praxis.id.toString()} />
        </div>
      </div>
    </div>
  )
}
