import { useQuery } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import { Button, Form } from 'react-bootstrap'
import { useLoginContext } from '../../LoginContext'
import { getAllAnimalTypes } from '../../api/AnimalTypeAPI'
import { getServicesFromPractice } from '../../api/ServicesAPI'
import { getAnimalsFromUser } from '../../api/AnimalsAPI'
import type {
  AnimalTypeType,
  AnimalsType,
  ServiceType,
} from 'vetilib-shared/schemas/ZodSchemas'
import '../../styles/components/practice/PracticeFilterBar.scss'

type PracticeFilterBarProps = {
  filterAnimalType: Array<number>
  filterServiceType: Array<number>
  filterAnimal: number | undefined
  setFilterAnimalType: (types: Array<number>) => void
  setFilterServiceType: (services: Array<number>) => void
  setFilterAnimal: (animal: number | undefined) => void
  practiceId: string
}

export function PracticeFilterBar({
  filterAnimalType,
  filterServiceType,
  filterAnimal,
  setFilterAnimalType,
  setFilterServiceType,
  setFilterAnimal,
  practiceId
}: PracticeFilterBarProps) {
  const { login } = useLoginContext()
  const [selectedService, setSelectedService] = useState<number | undefined>()

  // Fetch animal types
  const { data: animalTypes = [] } = useQuery<Array<AnimalTypeType>>({
    queryKey: ['allAnimalTypes'],
    queryFn: () => getAllAnimalTypes(practiceId),
    retry: false,
  })

  // Fetch services
  const { data: services = [] } = useQuery<Array<ServiceType>>({
    queryKey: ['allAvailableServiceTypes'],
    queryFn: () => getServicesFromPractice(practiceId),
    retry: false,
  })

  // Fetch user's animals
  const userId = login ? login.id : -1
  const { data: userAnimals = [] } = useQuery<Array<AnimalsType>>({
    queryKey: ['animals', userId],
    queryFn: () => getAnimalsFromUser(userId),
    retry: false,
    enabled: userId !== -1,
  })

  // Initialize selected service from filter
  useEffect(() => {
    if (filterServiceType.length > 0) {
      setSelectedService(filterServiceType[0])
    }
  }, [filterServiceType])

  // Auto-set animal type when specific animal selected
  useEffect(() => {
    if (filterAnimal !== undefined) {
      const selectedAnimal = userAnimals.find((a) => a.id === filterAnimal)
      if (selectedAnimal) {
        setFilterAnimalType([selectedAnimal.animalTypeId])
      }
    }
  }, [filterAnimal, userAnimals, setFilterAnimalType])

  const handleResetFilters = () => {
    setFilterAnimal(undefined)
    setFilterAnimalType([])
    setSelectedService(undefined)
    setFilterServiceType([])
  }

  const handleAnimalChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value
    setFilterAnimal(value ? parseInt(value) : undefined)
    if (!value) {
      setFilterAnimalType([])
    }
  }

  const handleAnimalTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value
    setFilterAnimalType(value ? [parseInt(value)] : [])
  }

  const handleServiceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value
    const serviceId = value ? parseInt(value) : undefined
    setSelectedService(serviceId)
    setFilterServiceType(serviceId ? [serviceId] : [])
  }

  const hasAnimals = userAnimals.length > 0
  const activeFilters = filterAnimalType.length + filterServiceType.length

  return (
    <div className="practice-filter-bar">
      <div className="filter-bar-title">
        <h5>Filter anpassen</h5>
        {activeFilters > 0 && (
          <span className="badge bg-primary">{activeFilters} aktiv</span>
        )}
      </div>

      <div className="filter-controls">
        {/* Animal / Animal Type */}
        <Form.Group className="filter-item">
          <Form.Label>Tier:</Form.Label>
          {login && hasAnimals ? (
            <Form.Select
              value={filterAnimal || ''}
              onChange={handleAnimalChange}
            >
              <option value="">Tier auswählen</option>
              {userAnimals.map((animal) => (
                <option key={animal.id} value={animal.id}>
                  {animal.name}
                </option>
              ))}
            </Form.Select>
          ) : (
            <Form.Select
              value={filterAnimalType[0] || ''}
              onChange={handleAnimalTypeChange}
            >
              <option value="">Tierart auswählen</option>
              {animalTypes.map((type) => (
                <option key={type.id} value={type.id}>
                  {type.name}
                </option>
              ))}
            </Form.Select>
          )}
        </Form.Group>

        {/* Services */}
        <Form.Group className="filter-item">
          <Form.Label>Behandlung:</Form.Label>
          <Form.Select
            value={selectedService || ''}
            onChange={handleServiceChange}
          >
            <option value="">Behandlung auswählen</option>
            {services.map((service) => (
              <option key={service.id} value={service.id}>
                {service.name}
              </option>
            ))}
          </Form.Select>
        </Form.Group>

        {/* Reset Button */}
        <div className="filter-actions">
          <Button
            variant="secondary"
            size="sm"
            onClick={handleResetFilters}
            disabled={activeFilters === 0}
            title="Alle Filter zurücksetzen"
          >
            Zurücksetzen
          </Button>
        </div>
      </div>
    </div>
  )
}
