import { useEffect, useMemo, useState } from 'react'
import { useMutation, useQuery } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
import { Alert, Button, Form } from 'react-bootstrap'
import Select from 'react-select'
import type { MultiValue } from 'react-select'
import type { AnimalTypeType, ServiceType } from 'vetilib-shared/schemas/ZodSchemas'
import { getVeterinarianById, updateVeterinarian } from '@/api/VeterinarianAPI'
import { getAllAnimalTypes, getAnimaltypesFromVeterinary  } from '@/api/AnimalTypeAPI'
import { getAllAvailableServices, getServicesFromVeterinary  } from '@/api/ServicesAPI'

type VeterinarianEditFormProps = {
  veterinarianId: number
}

export function VeterinarianEditForm({
  veterinarianId,
}: VeterinarianEditFormProps) {
  const navigate = useNavigate()

  const [infoEmail, setInfoEmail] = useState('')
  const [selectedAnimalTypes, setSelectedAnimalTypes] = useState<Array<number>>([])
  const [selectedServices, setSelectedServices] = useState<Array<number>>([])
  const [errors, setErrors] = useState<{ [key: string]: string }>({})

  // Fetch vet data
  const { data: veterinarian, isSuccess: isSuccessVet } = useQuery({
    queryKey: ['veterinarian', veterinarianId],
    queryFn: () => getVeterinarianById(veterinarianId),
  })

  // Fetch all animal types
  const { data: allAnimalTypes = [] } = useQuery({
    queryKey: ['allAnimalTypes'],
    queryFn: () => getAllAnimalTypes(undefined),
  })

  // Fetch all services
  const { data: allServices = [] } = useQuery({
    queryKey: ['allServices'],
    queryFn: () => getAllAvailableServices(undefined),
  })

  // Fetch current vet's animal types
  const { data: vetAnimalTypes = [] } = useQuery({
    queryKey: ['veterinarianAnimalTypes', veterinarianId],
    queryFn: () => getAnimaltypesFromVeterinary(veterinarianId.toString()),
  })

  // Fetch current vet's services
  const { data: vetServices = [] } = useQuery({
    queryKey: ['veterinarianServices', veterinarianId],
    queryFn: () => getServicesFromVeterinary(veterinarianId.toString()),
  })

  // Initialize form with vet data
  useEffect(() => {
    if (isSuccessVet) {
      setInfoEmail(veterinarian.infoEmail || '')
    }
  }, [isSuccessVet, veterinarian])

  // Initialize selected animal types
  useEffect(() => {
    if (vetAnimalTypes.length > 0) {
      setSelectedAnimalTypes(vetAnimalTypes.map((at) => at.id))
    }
  }, [vetAnimalTypes])

  // Initialize selected services
  useEffect(() => {
    if (vetServices.length > 0) {
      setSelectedServices(vetServices.map((s) => s.id))
    }
  }, [vetServices])

  const { mutate: mutateUpdate, isPending } = useMutation({
    mutationFn: (data: any) => updateVeterinarian(veterinarianId, data),
    onSuccess: () => {
      navigate({
        to: '/veterinarians/$veterinarianId',
        params: { veterinarianId: veterinarianId.toString() },
      })
    },
    onError: (error: any) => {
      setErrors({ general: error.message || 'Fehler beim Speichern' })
    },
  })

  const handleAnimalTypesChange = (
    selectedOptions: MultiValue<{ value: number; label: string }>,
  ) => {
    setSelectedAnimalTypes(selectedOptions.map((opt) => opt.value))
  }

  const handleServicesChange = (
    selectedOptions: MultiValue<{ value: number; label: string }>,
  ) => {
    setSelectedServices(selectedOptions.map((opt) => opt.value))
  }

  const handleSubmit = () => {
    const newErrors: { [key: string]: string } = {}

    if (!infoEmail) {
      newErrors.infoEmail = 'Info Email ist erforderlich'
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    mutateUpdate({
      infoEmail,
      animalTypeIds: selectedAnimalTypes,
      serviceIds: selectedServices,
    })
  }

  const handleCancel = () => {
    navigate({
      to: '/veterinarians/$veterinarianId',
      params: { veterinarianId: veterinarianId.toString() },
    })
  }

  if (!isSuccessVet) {
    return <div>Lade Tierarztdaten...</div>
  }

  const animalTypeOptions = useMemo(() => {
    return allAnimalTypes.map((type: AnimalTypeType) => ({
      value: type.id,
      label: type.name,
    }))
  }, [allAnimalTypes])

  const serviceOptions = useMemo(() => {
    return allServices.map((service: ServiceType) => ({
      value: service.id,
      label: service.name,
    }))
  }, [allServices])

  const selectedAnimalTypesOptions = useMemo(
    () =>
      animalTypeOptions.filter((opt) => selectedAnimalTypes.includes(opt.value)),
    [selectedAnimalTypes, animalTypeOptions],
  )

  const selectedServicesOptions = useMemo(
    () =>
      serviceOptions.filter((opt) => selectedServices.includes(opt.value)),
    [selectedServices, serviceOptions],
  )

  return (
    <>
      <button className="back-button" onClick={handleCancel}>
        <i className="bi bi-arrow-left"></i>
        Zurück
      </button>
      <h2 className="mb-4 text-center">
        {veterinarian.firstName} {veterinarian.lastName} bearbeiten
      </h2>

      {errors.general && <Alert variant="danger">{errors.general}</Alert>}

      <div style={{ maxWidth: '600px', margin: '0 auto' }}>
        <Form.Group className="mb-3">
          <Form.Label className="fw-bold">Info Email</Form.Label>
          <Form.Control
            type="email"
            value={infoEmail}
            onChange={(e) => {
              setInfoEmail(e.target.value)
              setErrors({ ...errors, infoEmail: '' })
            }}
            isInvalid={!!errors.infoEmail}
            placeholder="z.B. info@praxis.de"
          />
          {errors.infoEmail && (
            <Form.Control.Feedback type="invalid">
              {errors.infoEmail}
            </Form.Control.Feedback>
          )}
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label className="fw-bold">Behandelbare Tierarten</Form.Label>
          <Select
            isMulti
            options={animalTypeOptions}
            value={selectedAnimalTypesOptions}
            onChange={handleAnimalTypesChange}
            placeholder="Tierarten auswählen..."
          />
        </Form.Group>

        <Form.Group className="mb-4">
          <Form.Label className="fw-bold">Services</Form.Label>
          <Select
            isMulti
            options={serviceOptions}
            value={selectedServicesOptions}
            onChange={handleServicesChange}
            placeholder="Services auswählen..."
          />
        </Form.Group>

        <div className="d-flex gap-2">
          <Button
            variant="secondary"
            onClick={handleCancel}
            disabled={isPending}
            className="flex-grow-1"
          >
            Abbrechen
          </Button>
          <Button
            variant="primary"
            onClick={handleSubmit}
            disabled={isPending}
            className="flex-grow-1"
            style={{ color: 'white' }}
          >
            {isPending ? 'Speichert...' : 'Speichern'}
          </Button>
        </div>
      </div>
    </>
  )
}
