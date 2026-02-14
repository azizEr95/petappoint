import { useEffect, useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { Button } from 'react-bootstrap'
import { useLoginContext } from '../../LoginContext'
import heroBg from '../../assets/hero-bg.png'
import '../../styles/components/landing/Hero.scss'
import { getAllAnimalTypes } from '../../api/AnimalTypeAPI'
import { getAllAvailableServices } from '../../api/ServicesAPI'
import { getAnimalsFromUser } from '../../api/AnimalsAPI'
import { Autocomplete } from '../common/Autocomplete'
import { LocationAutocomplete } from '../common/LocationAutocomplete'
import type {
  AnimalTypeType,
  AnimalsType,
  ServiceType,
} from 'petappoint-shared/schemas/ZodSchemas'

export default function Hero() {
  const navigate = useNavigate()
  const { login } = useLoginContext()
  const [location, setLocation] = useState('')
  const [filterAnimalType, setFilterAnimalType] = useState<Array<number>>([])
  const [filterAnimal, setFilterAnimal] = useState<number | undefined>(
    undefined,
  )
  const [selectedService, setSelectedService] = useState<number | undefined>(
    undefined,
  )

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

  // Auto-set animal type when specific animal selected
  useEffect(() => {
    if (filterAnimal !== undefined) {
      const selectedAnimal = userAnimals.find((a) => a.id === filterAnimal)
      if (selectedAnimal) {
        setFilterAnimalType([selectedAnimal.animalTypeId])
      }
    }
  }, [filterAnimal, userAnimals])

  const handleSearch = () => {
    navigate({
      to: '/search',
      search: {
        animalType: filterAnimalType.join('-'),
        animal: filterAnimal ? filterAnimal.toString() : '',
        serviceType: selectedService ? selectedService.toString() : '',
        address: location,
      },
    })
  }

  const handleNavigateToAnimalCreate = () => {
    navigate({ to: '/animals' })
  }

  const handleLoginRedirect = () => {
    navigate({ to: '/login' })
  }

  const hasAnimals = userAnimals.length > 0

  return (
    <section
      id="hero"
      className="hero-clean"
      style={{ backgroundImage: `url(${heroBg})` }}
    >
      <div className="container">
        <div className="hero-content">
          <h1>Tierarzttermine einfach online buchen</h1>
          <p className="hero-subtitle-clean">
            Finden Sie den passenden Tierarzt in Ihrer Nähe und vereinbaren Sie
            direkt einen Termin
          </p>

          <div className="hero-filters">
            {/* Filters Row */}
            <div className="hero-filters-row">
              {/* Animal / Animal Type Selection */}
              <div className="filter-group">
                {login && hasAnimals ? (
                  <Autocomplete
                    options={userAnimals.map((a) => ({
                      id: a.id,
                      name: a.name,
                    }))}
                    value={filterAnimal}
                    onChange={setFilterAnimal}
                    placeholder="Nach Tier suchen..."
                    label="Tier"
                  />
                ) : (
                  <Autocomplete
                    options={animalTypes.map((t) => ({
                      id: t.id,
                      name: t.name,
                    }))}
                    value={filterAnimalType[0]}
                    onChange={(id) => setFilterAnimalType(id ? [id] : [])}
                    placeholder="Nach Tierart suchen..."
                    label="Tierart"
                  />
                )}
              </div>

              {/* Service/Treatment Selection */}
              <div className="filter-group">
                <Autocomplete
                  options={services.map((s) => ({ id: s.id, name: s.name }))}
                  value={selectedService}
                  onChange={setSelectedService}
                  placeholder="Nach Behandlung suchen..."
                  label="Service"
                />
              </div>

              {/* Location Selection */}
              <div className="filter-group">
                <LocationAutocomplete
                  value={location}
                  onChange={setLocation}
                  placeholder="Nach Stadt suchen..."
                  label="Standort"
                  showGeolocationButton={true}
                />
              </div>

              {/* Search Button */}
              <Button
                variant="primary"
                onClick={handleSearch}
                className="w-100"
                disabled={!location}
              >
                Suchen
              </Button>
            </div>

            {/* Helper Text Below Filters */}
            {!login && (
              <small className="hero-filter-help">
                <a
                  href="#"
                  onClick={handleLoginRedirect}
                  className="hero-filter-link"
                >
                  Tier hinzufügen
                </a>{' '}
                - Anmelden erforderlich
              </small>
            )}
            {login && !hasAnimals && (
              <small className="hero-filter-help">
                Du hast noch keine Tiere angelegt.{' '}
                <a
                  href="#"
                  onClick={handleNavigateToAnimalCreate}
                  className="hero-filter-link"
                >
                  Tier hinzufügen
                </a>
              </small>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
