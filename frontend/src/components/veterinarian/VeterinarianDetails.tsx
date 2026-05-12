import { useEffect, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
import { Button, OverlayTrigger, Tooltip } from 'react-bootstrap'
import type { VeterinariansType } from 'petappoint-shared/schemas/ZodSchemas'
import { getVeterinarianById } from '@/api/VeterinarianAPI'
import { getAnimaltypesFromVeterinary } from '@/api/AnimalTypeAPI'
import { getServicesFromVeterinary } from '@/api/ServicesAPI'
import { getPicturePlaceholderAnimal } from '@/api/AnimalsAPI'
import '@/styles/components/veterinarian/VeterinarianDetails.scss'

type VeterinarianDetailsProps = {
  veterinarianId: number
}

export function VeterinarianDetails({
  veterinarianId,
}: VeterinarianDetailsProps) {
  const navigate = useNavigate()
  const [veterinarian, setVeterinarian] = useState<VeterinariansType | null>(
    null,
  )
  const [pictureUrl, setPictureUrl] = useState<string>()

  const { data, isSuccess, isLoading, isError } = useQuery({
    queryKey: ['veterinarian', veterinarianId],
    queryFn: () => getVeterinarianById(veterinarianId),
    retry: false,
  })

  const { data: animalTypes = [] } = useQuery({
    queryKey: ['veterinarianAnimalTypes', veterinarianId],
    queryFn: () => getAnimaltypesFromVeterinary(veterinarianId.toString()),
    staleTime: 0,
  })

  const { data: services = [] } = useQuery({
    queryKey: ['veterinarianServices', veterinarianId],
    queryFn: () => getServicesFromVeterinary(veterinarianId.toString()),
    staleTime: 0,
  })

  const { data: placeholderPicture, isSuccess: isSuccessPlaceholder } = useQuery(
    {
      queryKey: ['placeholderAnimal'],
      queryFn: () => getPicturePlaceholderAnimal(),
      staleTime: 0,
    }
  )

  useEffect(() => {
    if (isSuccess) {
      setVeterinarian(data)
    }
  }, [isSuccess, data])

  useEffect(() => {
    if (isSuccessPlaceholder && placeholderPicture) {
      setPictureUrl(placeholderPicture)
    }
  }, [isSuccessPlaceholder, placeholderPicture])

  const handleClickBack = () => {
    navigate({
      to: '/veterinarians',
      search: { veterinarianName: '', sortBy: 'name-asc', specialization: '' },
    })
  }

  const handleClickEdit = () => {
    navigate({
      to: '/veterinarians/$veterinarianId/edit',
      params: { veterinarianId: veterinarianId.toString() },
    })
  }

  const appointmentTooltip = (
    <Tooltip id={`tooltip-appointments-${veterinarianId}`}>
      Wird in separatem Issue implementiert
    </Tooltip>
  )

  if (isLoading) {
    return <div>Lade Tierarztdetails ...</div>
  }

  if (isError || !veterinarian) {
    return (
      <div>
        <button className="back-button" onClick={handleClickBack}>
          <i className="bi bi-arrow-left"></i>
          Zurück
        </button>
        <div className="alert alert-danger">
          Tierarzt konnte nicht geladen werden
        </div>
      </div>
    )
  }

  return (
    <div className="veterinarian-detail-wrapper">
      <button className="back-button" onClick={handleClickBack}>
        <i className="bi bi-arrow-left"></i>
        Zurück
      </button>
      <h2 className="mb-3 veterinarian-heading text-center">
        Tierarzt: {veterinarian.firstName} {veterinarian.lastName}
      </h2>
      <div className="card veterinarian-detail-card">
        <div className="row g-0">
          <div className="col-auto veterinarian-image-col">
            <img
              src={pictureUrl}
              alt={`${veterinarian.firstName} ${veterinarian.lastName}`}
              className="veterinarian-detail-image"
            />
          </div>

          <div className="col ps-4">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-start mb-3">
                <div>
                  <div className="mb-2">
                    <div className="fw-bold">Name:</div>
                    <div className="text-success">
                      {veterinarian.firstName} {veterinarian.lastName}
                    </div>
                  </div>

                  {veterinarian.infoEmail && (
                    <div>
                      <div className="fw-bold">Info Email:</div>
                      <div className="text-success">{veterinarian.infoEmail}</div>
                    </div>
                  )}
                </div>

                <Button
                  variant="primary"
                  onClick={handleClickEdit}
                  className="ms-3"
                  style={{ color: 'white', whiteSpace: 'nowrap' }}
                >
                  Bearbeiten
                </Button>
              </div>

              {animalTypes.length > 0 && (
                <div className="mb-3">
                  <div className="fw-bold">Behandelbare Tierarten:</div>
                  <div className="text-success">
                    {animalTypes.map((at) => at.name).join(', ')}
                  </div>
                </div>
              )}

              {services.length > 0 && (
                <div className="mb-3">
                  <div className="fw-bold">Services:</div>
                  <div className="text-success">
                    {services.map((s) => s.name).join(', ')}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="mt-4 d-flex gap-2">
                <OverlayTrigger placement="top" overlay={appointmentTooltip}>
                  <span>
                    <Button variant="outline-secondary" disabled className="flex-grow-1">
                      <i className="bi bi-calendar-check"></i> Termine anzeigen
                    </Button>
                  </span>
                </OverlayTrigger>
                <OverlayTrigger placement="top" overlay={appointmentTooltip}>
                  <span>
                    <Button variant="outline-primary" disabled className="flex-grow-1">
                      <i className="bi bi-calendar-plus"></i> Termin erstellen
                    </Button>
                  </span>
                </OverlayTrigger>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
