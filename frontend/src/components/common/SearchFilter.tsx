import { useLocation, useNavigate } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { useEffect, useMemo, useState } from 'react'
import Select from 'react-select'
import { Button, Form, Modal } from 'react-bootstrap'
import { getAllAnimalTypes } from '../../api/AnimalTypeAPI'
import { getAllAvailableServices } from '../../api/ServicesAPI'
import { useLoginContext } from '../../LoginContext'
import { getAnimalsFromUser } from '../../api/AnimalsAPI'
import type { MultiValue } from 'react-select'
import type { ChangeEvent } from 'react'
import type {
  AnimalTypeType,
  AnimalsType,
  AppointmentFilterType,
  ServiceType,
  VeterinaryPracticeSearchQueryType,
  VeterinaryPracticesType,
} from '../../../../shared/schemas/ZodSchemas'
import '../../styles/components/common/SearchFilter.scss'

type SearchFilterProps = {
  searchFilter: VeterinaryPracticeSearchQueryType | null
  filterOptions: AppointmentFilterType
  setFilterServiceType: (newServices: Array<number>) => void
  setFilterAnimalType: (newAnimalType: Array<number>) => void
  setFilterAnimal: (animal: number | undefined) => void
  practicePage: VeterinaryPracticesType | null
  landingPage: boolean
}

export function SearchFilter({
  searchFilter,
  filterOptions,
  setFilterServiceType,
  setFilterAnimalType,
  setFilterAnimal,
  practicePage,
  landingPage,
}: SearchFilterProps) {
  const navigate = useNavigate()
  const location = useLocation()
  const stateAnimal = location.state.filterAnimalId
  const [showFilterDialog, setShowFilterDialog] = useState<boolean>(false)
  const [filterAnimalTypeLocal, setFilterAnimalTypeLocal] = useState<
    Array<number>
  >(
    searchFilter !== null && searchFilter.animalTypeIds !== undefined
      ? searchFilter.animalTypeIds
      : [],
  )
  const [filterAnimalLocal, setFilterAnimalLocal] = useState<
    number | undefined
  >(filterOptions.animal)
  const { login } = useLoginContext()
  const [selectedServiceType, setSelectedServiceType] = useState<
    MultiValue<{ value: ServiceType; label: string }>
  >([])
  const [animalText, setAnimalText] = useState('') // name from seleted animaltype
  const [animals, setAnimals] = useState<Array<AnimalsType>>([])

  // get Animaltypes
  const { isSuccess: isSuccessAnimalType, data: dataAnimalType } = useQuery<
    Array<AnimalTypeType>
  >({
    queryKey: ['allAnimalTypes', practicePage?.id],
    queryFn: () => getAllAnimalTypes(practicePage?.id.toString()), // if id is not undefined API calls animaltypes for practice, otherwise all animaltypes
    retry: false,
  })

  // get ServiceType
  const {
    isSuccess: isSuccessAllAvailableServices,
    data: dataAllAvailableServices,
  } = useQuery<Array<ServiceType>>({
    queryKey: ['allAvailableServiceTypes', practicePage?.id],
    queryFn: () => getAllAvailableServices(practicePage?.id.toString()), // if id is not undefined API calls servicetypes for practice, otherwise all servicetypes
    retry: false,
  })

  // get all Animals
  const userId = login ? login.id : -1
  const { isSuccess: isSuccessAnimals, data: dataAnimals } = useQuery<
    Array<AnimalsType>
  >({
    queryKey: ['animals', userId],
    queryFn: () => getAnimalsFromUser(userId),
    retry: false,
    enabled: userId !== -1, // only get animals if the user is logged in
  })

  useEffect(() => {
    if (isSuccessAnimals) {
      setAnimals(dataAnimals)
    }
  }, [isSuccessAnimals, dataAnimals])

  useEffect(() => {
    if (stateAnimal !== undefined && isSuccessAnimals) {
      setFilterAnimalLocal(stateAnimal)
      setFilterAnimal(stateAnimal)
      const findAnimal = dataAnimals.find((x) => {
        return filterAnimalLocal === x.id
      })
      if (findAnimal !== undefined) {
        setFilterAnimalTypeLocal([findAnimal.animalTypeId])
      }
    }
  }, [stateAnimal, isSuccessAnimals])

  useEffect(() => { // init selected servicetypes from before filter
    const searchService = searchFilter?.serviceTypeIds;
    if (isSuccessAllAvailableServices && searchService !== undefined && searchService.length > 0) {
      const selectedServices = dataAllAvailableServices.filter((x) => {
        const serv = searchService.find((y) => {
          return x.id === y
        })
        if (serv !== undefined) {
          return true
        } else {
          return false
        }
      })
      const service = selectedServices.map((serv) => ({
        value: serv,
        label: serv.name,
      }))
      setSelectedServiceType(service)
    }
  }, [
    isSuccessAllAvailableServices,
    dataAllAvailableServices,
    filterAnimalTypeLocal,
  ])

  useEffect(() => {
    const animalsByCorrectType = dataAnimals?.filter((x) => {
      return x.animalTypeId === filterAnimalTypeLocal[0]
    })
    if (filterAnimalLocal === undefined) {
      if (filterAnimalTypeLocal.length > 0) {
        const getCurrentAnimaltype = dataAnimalType?.find((x) => {
          return x.id === filterAnimalTypeLocal[0]
        })
        setAnimalText(getCurrentAnimaltype?.name ?? '')
      } else {
        setAnimalText('')
      }

      if (
        animalsByCorrectType !== undefined &&
        filterAnimalTypeLocal.length > 0
      ) {
        setAnimals(animalsByCorrectType)
      }
    }
  }, [filterAnimalTypeLocal])

  // for multiselect from servicetypes
  const serviceTypeOptions = useMemo(() => {
    if (!isSuccessAllAvailableServices || dataAllAvailableServices.length === 0) {
      return []
    }
    let options = dataAllAvailableServices
    options = options.filter((service) => {
      const sameService = selectedServiceType.find((serv) => {
        if (serv.value.id === service.id) {
          return true
        }
      })
      if (sameService !== undefined) {
        return false
      } else {
        return true
      }
    })
    if (selectedServiceType.length + options.length !== dataAllAvailableServices.length){// || selectedServiceType.length !== filterServiceTypeLocal.length) {
      // not all options are currently shown
      dataAllAvailableServices.map((service) => {
        const findOptions = selectedServiceType.find((selService) => {
          if (selService.value.id === service.id) {
            return true
          }
        })
        if (findOptions !== undefined) {
          options.push(service)
        }
      })
    }
    return options.map((x) => ({
      value: x,
      label: x.name,
    }))
  }, [
    isSuccessAllAvailableServices,
    dataAllAvailableServices,
    selectedServiceType,
  ])

  const handleOpenFilterDialog = () => {
    setShowFilterDialog(true)
  }

  const handleCloseFilterDialog = () => {
    if (!landingPage) {
      handleSubmitFilterDialog()
    } else {
      const filteredServices = selectedServiceType.map((service) => service.value.id)
      setFilterAnimal(filterAnimalLocal)
      setFilterServiceType(filteredServices)
      setFilterAnimalType(filterAnimalTypeLocal)
      setShowFilterDialog(false)
    }
  }

  const handleSubmitFilterDialog = () => {
    const filteredServices = selectedServiceType.map((service) => service.value.id).sort((a,b) => a - b)
    setFilterServiceType(filteredServices)
    setFilterAnimalType(filterAnimalTypeLocal)
    setFilterAnimal(filterAnimalLocal)
    if (practicePage === null && searchFilter !== null) {
      // searchFilter is null when it is an practicePage
      navigate({
        to: '/search',
        search: {
          name: searchFilter.name,
          address: searchFilter.address,
          animalType: filterAnimalTypeLocal.join('-'),
          serviceType: filteredServices.join('-'),
        },
        state: {
          filterAnimalId: filterAnimalLocal,
        },
      })
    }
    setShowFilterDialog(false)
  }

  const handleDeleteFilter = () => {
    setSelectedServiceType([])
    setFilterAnimalLocal(undefined)
    setFilterAnimalTypeLocal([])
    // setFilterServiceTypeLocal([])
  }

  const handleChangeAnimal = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value
    if (value === '') {
      setFilterAnimalLocal(undefined)
      setFilterAnimalTypeLocal([])
    } else {
      const selectedAnimalId = parseInt(value)
      setFilterAnimalLocal(selectedAnimalId)
      const findAnimal = dataAnimals?.find((x) => {
        return selectedAnimalId === x.id
      })
      if (findAnimal !== undefined) {
        setFilterAnimalTypeLocal([findAnimal.animalTypeId])
      }
    }
  }

  const handleChangeAnimaltype = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value
    if (value === '') {
      setFilterAnimalTypeLocal([])
      if (isSuccessAnimals) {
        setAnimals(dataAnimals)
      }
    } else {
      const selectedAnimaltypeId = parseInt(value)
      setFilterAnimalTypeLocal([selectedAnimaltypeId])
    }
  }

  const handleSelectServiceTypes = (
    serviceSelect: MultiValue<{ value: AnimalTypeType; label: string }>,
  ) => {
    setSelectedServiceType(serviceSelect)
  }

  let animaltypes: Array<AnimalTypeType> = []
  if (isSuccessAnimalType) {
    animaltypes = dataAnimalType
  }

  let activeFilter = 0
  if (
    filterOptions.animalTypeIds?.length !== undefined &&
    filterOptions.animalTypeIds.length > 0
  ) {
    activeFilter++
  }
  if (
    filterOptions.serviceTypeIds?.length !== undefined &&
    filterOptions.serviceTypeIds.length > 0
  ) {
    activeFilter++
  }

  return (
    <>
      <Button
        id="FilterButton"
        variant="white"
        onClick={handleOpenFilterDialog}
      >
        <i className="bi bi-sliders"></i> Filter{' '}
        {activeFilter > 0 && <span>({activeFilter})</span>}
      </Button>
      <Modal
        show={showFilterDialog}
        onHide={handleCloseFilterDialog}
        className="animal-dialog"
      >
        <Modal.Header closeButton>
          <Modal.Title>Filter</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          {/* if user is logged in */}
          {login && (
            <div className="filter-group">
              <Form.Group className="mb-3">
                <Form.Label>Tier:</Form.Label>
                <Form.Control
                  as="select"
                  name="animal"
                  value={filterAnimalLocal || ''}
                  onChange={handleChangeAnimal}
                >
                  {animalText === '' && (
                    <option value={''}>Tier auswählen</option>
                  )}
                  {animalText !== '' && (
                    <option value={''}>{animalText} auswählen</option>
                  )}
                  {animals.map((animal) => (
                    <option key={animal.id} value={animal.id}>
                      {animal.name}
                    </option>
                  ))}
                </Form.Control>
                {animalText !== '' && (
                  <div>Wähle das Tier zur Tierart aus.</div>
                )}
              </Form.Group>
            </div>
          )}
          <div className="filter-group">
            <Form.Group className="mb-3">
              <Form.Label>Tierart:</Form.Label>
              <Form.Control
                as="select"
                name="animaltype"
                value={
                  filterAnimalTypeLocal.length > 0
                    ? filterAnimalTypeLocal[0]
                    : ''
                }
                onChange={handleChangeAnimaltype}
                disabled={filterAnimalLocal !== undefined}
              >
                <option value={''}>Tierart auswählen</option>
                {animaltypes.map((animaltype) => (
                  <option key={animaltype.id} value={animaltype.id}>
                    {animaltype.name}
                  </option>
                ))}
              </Form.Control>
              {filterAnimalLocal !== undefined && (
                <div>Tierart automatisch durch Tier festgelegt.</div>
              )}
            </Form.Group>
          </div>

          <div className="filter-group">
            <Form.Group className="mb-3">
              <Form.Label>Behandlungen:</Form.Label>
              <Select
                closeMenuOnSelect={false}
                isMulti={true}
                placeholder="Behandlungen auswählen"
                options={serviceTypeOptions}
                value={selectedServiceType}
                onChange={handleSelectServiceTypes}
              />
            </Form.Group>
          </div>
        </Modal.Body>

        <Modal.Footer>
          <Button
            onClick={handleDeleteFilter}
            variant="secondary"
            disabled={
              serviceTypeOptions.length === 0 &&
              filterAnimalTypeLocal.length === 0 &&
              filterAnimalLocal === undefined
            }
          >
            Filter entfernen
          </Button>
          <Button onClick={handleSubmitFilterDialog} variant="primary">
            Ergebnisse anzeigen
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}
