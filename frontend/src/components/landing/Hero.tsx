import { useEffect, useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { Button, Form } from 'react-bootstrap'
import { useLoginContext } from '../../LoginContext'
import heroBg from '../../assets/hero-bg.png'
import '../../styles/components/landing/Hero.scss'
import { getAllAnimalTypes } from '../../api/AnimalTypeAPI'
import { getAllAvailableServices } from '../../api/ServicesAPI'
import { getAnimalsFromUser } from '../../api/AnimalsAPI'
import type {
  AnimalTypeType,
  AnimalsType,
  ServiceType,
} from 'vetilib-shared/schemas/ZodSchemas'
import Select from "react-select"

export default function Hero() {
  const navigate = useNavigate()
  const { login } = useLoginContext()
  const [location, setLocation] = useState('')
  const [isLoadingLocation, setIsLoadingLocation] = useState(false)
  const [filterAnimalType, setFilterAnimalType] = useState<Array<number>>([])
  const [filterAnimal, setFilterAnimal] = useState<number | undefined>(undefined)
  const [selectedService, setSelectedService] = useState<number | undefined>(undefined)

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
          setLocation(city)
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

  const handleSearch = () => {
    navigate({
      to: '/search',
      search: {
        address: location,
        animalType: filterAnimalType.join('-'),
        serviceType: selectedService ? selectedService.toString() : '',
      },
      state: {
        filterAnimalId: filterAnimal,
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

  // react-select options
  const animalTypeOptions = animalTypes.map(type => ({
    value: type.id,
    label: type.name
  }))

  const selectedAnimalTypeOption = animalTypeOptions.find(
    option => option.value === filterAnimalType[0]
  ) || null

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
              <Form.Group className="filter-group">
                <Form.Label>Tier:</Form.Label>
                {login && hasAnimals ? (
                  <Form.Control
                    as="select"
                    value={filterAnimal || ''}
                    onChange={(e) =>
                      setFilterAnimal(
                        e.target.value ? parseInt(e.target.value) : undefined,
                      )
                    }
                  >
                    <option value="">Tier auswählen</option>
                    {userAnimals.map((animal) => (
                      <option key={animal.id} value={animal.id}>
                        {animal.name}
                      </option>
                    ))}
                  </Form.Control>
                ) : (
                  <Select
                    options={animalTypeOptions}
                    value={selectedAnimalTypeOption}
                    onChange={(option) => 
                      setFilterAnimalType(option ? [option.value] : [])
                    }
                    placeholder="Tierart auswählen"
                    isClearable
                    isSearchable
                    noOptionsMessage={() => "Keine Tierart gefunden"}
                    menuPortalTarget={document.body}
                    menuPosition="fixed"
                    styles={{
                      control: (base) => ({
                        ...base,
                        minHeight: '38px',
                        borderRadius: '0.375rem',
                        border: '1px solid #dee2e6',
                        boxShadow: 'none',
                        '&:hover': {
                          border: '1px solid #dee2e6'
                        }
                      }),
                      valueContainer: (base) => ({
                        ...base,
                        padding: '0.375rem 0.75rem'
                      }),
                      placeholder: (base) => ({
                        ...base,
                        textAlign: 'left'
                      }),
                      input: (base) => ({
                        ...base,
                        margin: 0,
                        padding: 0
                      }),
                      indicatorSeparator: () => ({
                        display: 'none'
                      }),
                      dropdownIndicator: (base) => ({
                        ...base,
                        padding: '0.375rem 0.5rem'
                      }),
                      menuPortal: (base) => ({
                        ...base,
                        zIndex: 9999
                      }),
                      menu: (base) => ({
                        ...base,
                        zIndex: 9999
                      }),
                      option: (base, state) => ({
                        ...base,
                        backgroundColor: state.isSelected 
                          ? '#0d6efd' 
                          : state.isFocused 
                          ? '#e9ecef' 
                          : 'white',
                        color: state.isSelected ? 'white' : '#212529',
                        cursor: 'pointer',
                        padding: '0.375rem 0.75rem',
                        textAlign: 'left'
                      })
                    }}
                  />
                )}
              </Form.Group>

              {/* Service/Treatment Selection */}
              <Form.Group className="filter-group">
                <Form.Label>Behandlung:</Form.Label>
                <Form.Control
                  as="select"
                  value={selectedService || ''}
                  onChange={(e) =>
                    setSelectedService(
                      e.target.value ? parseInt(e.target.value) : undefined,
                    )
                  }
                >
                  <option value="">Behandlung auswählen</option>
                  {services.map((service) => (
                    <option key={service.id} value={service.id}>
                      {service.name}
                    </option>
                  ))}
                </Form.Control>
              </Form.Group>

              {/* Location Selection */}
              <div className="location-input-group">
                <label>Standort:</label>
                <div className="input-wrapper">
                  <Form.Control
                    type="text"
                    placeholder="Stadt, PLZ oder Standort"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                  />
                  <Button
                    variant="outline-secondary"
                    onClick={handleGetCurrentLocation}
                    disabled={isLoadingLocation}
                    className="location-btn"
                  >
                    <i
                      className={
                        isLoadingLocation ? 'bi bi-arrow-clockwise spin' : 'bi bi-geo-alt'
                      }
                    ></i>
                  </Button>
                </div>
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
                <a href="#" onClick={handleLoginRedirect} className="hero-filter-link">
                  Tier hinzufügen
                </a>
                {' '}- Anmelden erforderlich
              </small>
            )}
            {login && !hasAnimals && (
              <small className="hero-filter-help">
                Du hast noch keine Tiere angelegt.{' '}
                <a href="#" onClick={handleNavigateToAnimalCreate} className="hero-filter-link">
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