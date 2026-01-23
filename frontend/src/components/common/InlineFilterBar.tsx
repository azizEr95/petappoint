import { useQuery } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { Button } from 'react-bootstrap'
import { useLoginContext } from '../../LoginContext'
import { getAllAnimalTypes } from '../../api/AnimalTypeAPI'
import { getAllAvailableServices } from '../../api/ServicesAPI'
import { getAnimalsFromUser } from '../../api/AnimalsAPI'
import { Autocomplete } from './Autocomplete'
import { LocationAutocomplete } from './LocationAutocomplete'
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
  const navigate = useNavigate()
  const { login } = useLoginContext()
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

  const handleApplyFilters = () => {
    setCurrentPageNumber(1)
    navigate({
      to: '/search',
      search: {
        animalType: filterAnimalType.join('-'),
        animal: filterAnimal ? filterAnimal.toString() : '',
        serviceType: filterServiceType.join('-'),
        address: filterLocation,
      },
    })
  }

  const handleResetFilters = () => {
    setFilterAnimal(undefined)
    setFilterAnimalType([])
    setSelectedService(undefined)
    setFilterServiceType([])
    setCurrentPageNumber(1)
    navigate({
      to: '/search',
      search: {
        animalType: '',
        animal: '',
        serviceType: '',
        address: '',
      },
    })
  }

  const handleAnimalChange = (id: number | undefined) => {
    setFilterAnimal(id)
    if (id === undefined) {
      setFilterAnimalType([])
    }
  }

  const handleAnimalTypeChange = (id: number | undefined) => {
    setFilterAnimalType(id ? [id] : [])
  }

  const handleServiceChange = (id: number | undefined) => {
    setSelectedService(id)
    setFilterServiceType(id ? [id] : [])
  }

  const hasAnimals = userAnimals.length > 0
  const activeFilters =
    filterAnimalType.length +
    filterServiceType.length +
    (filterLocation ? 1 : 0)

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
        <div className="filter-item">
          {login && hasAnimals ? (
            <Autocomplete
              options={userAnimals.map((a) => ({ id: a.id, name: a.name }))}
              value={filterAnimal}
              onChange={handleAnimalChange}
              placeholder="Nach Tier suchen..."
              label="Tier"
            />
          ) : (
            <Autocomplete
              options={animalTypes.map((t) => ({ id: t.id, name: t.name }))}
              value={filterAnimalType[0]}
              onChange={handleAnimalTypeChange}
              placeholder="Nach Tierart suchen..."
              label="Tierart"
            />
          )}
        </div>

        {/* Services */}
        <div className="filter-item">
          <Autocomplete
            options={services.map((s) => ({ id: s.id, name: s.name }))}
            value={selectedService}
            onChange={handleServiceChange}
            placeholder="Nach Behandlung suchen..."
            label="Service"
          />
        </div>

        {/* Location */}
        <div className="location-input-group">
          <label>Standort:</label>
          <div className="input-wrapper">
            <LocationAutocomplete
              value={filterLocation}
              onChange={setFilterLocation}
              placeholder={'Nach Stadt suchen...'}
              label="Standort"
              showGeolocationButton={true}
            />
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
          <Button variant="primary" size="sm" onClick={handleApplyFilters}>
            Anwenden
          </Button>
        </div>
      </div>
    </div>
  )
}
