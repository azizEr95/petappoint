import { useEffect, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
import type { VeterinariansType } from 'petappoint-shared/schemas/ZodSchemas'
import { getPicturePlaceholderAnimal } from '@/api/AnimalsAPI'
import { getAnimaltypesFromVeterinary } from '@/api/AnimalTypeAPI'
import { getServicesFromVeterinary } from '@/api/ServicesAPI'

type VeterinarianCardProps = {
  veterinarian: VeterinariansType
}

export function VeterinarianCard({ veterinarian }: VeterinarianCardProps) {
  const navigate = useNavigate()
  const [pictureUrl, setPictureUrl] = useState<string>()

  const { data: placeholderPicture, isSuccess: isSuccessPlaceholder } = useQuery(
    {
      queryKey: ['placeholderAnimal'],
      queryFn: () => getPicturePlaceholderAnimal(),
      staleTime: 0,
    }
  )

  const { data: animalTypes = [] } = useQuery({
    queryKey: ['veterinarianAnimalTypes', veterinarian.id],
    queryFn: () => getAnimaltypesFromVeterinary(veterinarian.id.toString()),
    staleTime: 0,
  })

  const { data: services = [] } = useQuery({
    queryKey: ['veterinarianServices', veterinarian.id],
    queryFn: () => getServicesFromVeterinary(veterinarian.id.toString()),
    staleTime: 0,
  })

  useEffect(() => {
    if (isSuccessPlaceholder && placeholderPicture) {
      setPictureUrl(placeholderPicture)
    }
  }, [isSuccessPlaceholder, placeholderPicture])

  const handleClickVeterinarian = () => {
    navigate({
      to: '/veterinarians/$veterinarianId',
      params: { veterinarianId: veterinarian.id.toString() },
    })
  }

  return (
    <div className="veterinarian-card-wrapper">
      <div className="card veterinarian-card" onClick={handleClickVeterinarian}>
        {/* Zeile 1: Bild + Name/Email/Telefon */}
        <div className="row g-0 d-flex align-items-center mb-3">
          <div className="col-auto">
            <img
              src={pictureUrl}
              width={100}
              height={100}
              alt={`${veterinarian.firstName} ${veterinarian.lastName}`}
              className="rounded-circle"
              style={{ objectFit: 'cover' }}
            />
          </div>
          <div className="col ps-3">
            <div className="fw-bold card-title-text">
              {veterinarian.firstName} {veterinarian.lastName}
            </div>
            {veterinarian.infoEmail && (
              <div className="text-muted small">{veterinarian.infoEmail}</div>
            )}
          </div>
        </div>

        {/* Zeile 2: Tierarten */}
        {animalTypes.length > 0 && (
          <div className="mb-2">
            <div className="fw-bold card-title-text small">Tierarten</div>
            <div className="text-muted small">
              {animalTypes.map((at) => at.name).join(', ')}
            </div>
          </div>
        )}

        {/* Zeile 3: Services */}
        {services.length > 0 && (
          <div>
            <div className="fw-bold card-title-text small">Services</div>
            <div className="text-muted small">
              {services.map((s) => s.name).join(', ')}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
