import { useQuery } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import { Button, Form } from 'react-bootstrap'
import { useLoginContext } from '../../LoginContext'
import { getAllAnimalTypes } from '../../api/AnimalTypeAPI'
import { getAllAvailableServices } from '../../api/ServicesAPI'
import { getAnimalsFromUser } from '../../api/AnimalsAPI'
import type {
  AnimalTypeType,
  AnimalsType,
  ServiceType,
} from 'vetilib-shared/schemas/ZodSchemas'
import '../../styles/components/common/InlineFilterBar.scss'

type InlineFilterBarProps = {
  filterAnimalType: Array<number>
  filterServiceType: Array<number>
  filterLocation: string
  filterAnimal: number | undefined
  setFilterAnimalType: (types: Array<number>) => void
  setFilterServiceType: (services: Array<number>) => void
  setFilterLocation: (location: string) => void
  setFilterAnimal: (animal: number | undefined) => void
  setCurrentPageNumber: (page: number) => void
}

export function InlineFilterBar({
  filterAnimalType,
  filterServiceType,
  filterLocation,
  filterAnimal,
  setFilterAnimalType,
  setFilterServiceType,
  setFilterLocation,
  setFilterAnimal,
  setCurrentPageNumber,
}: InlineFilterBarProps) {
  const { login } = useLoginContext()
  const [isLoadingLocation, setIsLoadingLocation] = useState(false)
  const [selectedService, setSelectedService] = useState<number | undefined>()

  // Fetch animal types
  const { data: animalTypes = [] } = useQuery<Array<AnimalTypeType>>({
    queryKey: ['allAnimalTypes'],
    queryFn: () => getAllAnimalTypes(undefined),
    retry: false,
  })

  // Fetch services
  const { data: services = [] } = useQuery<Array<ServiceType>>({
    queryKey: ['allAvailableServiceTypes'],
    queryFn: () => getAllAvailableServices(undefined),
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

  const handleGetCurrentLocation = () => {
    setIsLoadingLocation(true)
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords
        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`,
            { headers: { 'Accept-Language': 'de' } },
          )
          const data = await response.json()
          const city =
            data.address?.city || data.address?.town || data.address?.village || ''
          setFilterLocation(city)
          setCurrentPageNumber(1)
        } catch (error) {
          console.error('Fehler beim Abrufen der Adresse:', error)
          alert('Standort konnte nicht ermittelt werden')
        } finally {
          setIsLoadingLocation(false)
        }
      },
      () => {
        setIsLoadingLocation(false)
        alert('Zugriff auf Standort wurde verweigert')
      },
    )
  }

  const handleApplyFilters = () => {
    setCurrentPageNumber(1)
  }

  const handleResetFilters = () => {
    setFilterAnimal(undefined)
    setFilterAnimalType([])
    setSelectedService(undefined)
    setFilterServiceType([])
    setCurrentPageNumber(1)
  }

  const handleLocationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilterLocation(e.target.value)
    setCurrentPageNumber(1)
  }

  const handleAnimalChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value
    setFilterAnimal(value ? parseInt(value) : undefined)
    setCurrentPageNumber(1)
  }

  const handleAnimalTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value
    setFilterAnimalType(value ? [parseInt(value)] : [])
    setCurrentPageNumber(1)
  }

  const handleServiceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value
    const serviceId = value ? parseInt(value) : undefined
    setSelectedService(serviceId)
    setFilterServiceType(serviceId ? [serviceId] : [])
    setCurrentPageNumber(1)
  }

  const hasAnimals = userAnimals.length > 0
  const activeFilters =
    filterAnimalType.length + filterServiceType.length + (filterLocation ? 1 : 0)

  return (
    <div className="inline-filter-bar">
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

        {/* Location */}
        <div className="location-input-group">
          <label>Standort:</label>
          <div className="input-wrapper">
            <Form.Control
              type="text"
              placeholder="Stadt, PLZ oder Standort"
              value={filterLocation}
              onChange={handleLocationChange}
            />
            <Button
              variant="outline-secondary"
              onClick={handleGetCurrentLocation}
              disabled={isLoadingLocation}
              className="location-btn"
              title="Aktuellen Standort verwenden"
            >
              <i
                className={
                  isLoadingLocation
                    ? 'bi bi-arrow-clockwise spin'
                    : 'bi bi-geo-alt'
                }
              ></i>
            </Button>
          </div>
        </div>

        {/* Action Buttons */}
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
          <Button
            variant="primary"
            size="sm"
            onClick={handleApplyFilters}
          >
            Anwenden
          </Button>
        </div>
      </div>
    </div>
  )
}
