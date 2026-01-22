import {
  Alert,
  Button,
  Form,
  FormGroup,
  ListGroup,
  Modal,
  Spinner,
} from 'react-bootstrap'
import { useMemo, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import Select from 'react-select'
import {
  dateToDateString,
  dateToTimeString,
} from '../../utils/DateToStringFormat'
import { getCustomersFromPractice } from '../../api/CustomerAPI'
import {
  getAllAnimalTypes,
  getAnimaltypesFromVeterinary,
} from '../../api/AnimalTypeAPI'
import { bookAppointment } from '../../api/AppointmentsAPI'
import { getAnimalsFromUser } from '../../api/AnimalsAPI'
import { getPersonById } from '../../api/PersonsAPI'
import { AnimalEditNewDialog } from '../animal/AnimalEditNewDialog'
import { PersonEditNewDialog } from '../person/PersonEditNewDialog'
import type {
  AnimalTypeType,
  AppointmentsType,
  PersonsType,
} from 'vetilib-shared/schemas/ZodSchemas'
import type { SingleValue } from 'react-select'

type AppointmentBookDialogPracticeProps = {
  hideDialogBookAppointment: () => void
  appointmentDetail: AppointmentsType
}

export function AppointmentBookDialogPractice({
  hideDialogBookAppointment,
  appointmentDetail,
}: AppointmentBookDialogPracticeProps) {
  const [selectedServiceId, setSelectedServiceId] = useState<string>('')
  const [selectedPersonId, setSelectedPersonId] = useState<number | null>(null)
  const [selectedAnimalId, setSelectedAnimalId] = useState<number | null>(null)
  const [errorMessage, setErrorMessage] = useState<string>('')
  const [showAnimalDialog, setShowAnimalDialog] = useState<boolean>(false)
  const [showPersonDialog, setShowPersonDialog] = useState<boolean>(false)
  const [showSuccessNotification, setShowSuccessNotification] =
    useState<boolean>(false)
  const [successNotificationMessage, setSuccessNotificationMessage] =
    useState<string>('')
  const [newlyCreatedPerson, setNewlyCreatedPerson] = useState<PersonsType | null>(null)

  const queryClient = useQueryClient()
  const practiceId = appointmentDetail.veterinaryPractice.id
  const vetId = appointmentDetail.veterinary.id

  const { data: customersData, isLoading: isLoadingCustomers } = useQuery({
    queryKey: ['customers', practiceId],
    queryFn: () => getCustomersFromPractice(practiceId.toString()),
    retry: false,
  })

  const { data: treatableAnimalTypesData, isLoading: isLoadingAnimalTypes } =
    useQuery({
      queryKey: ['treatableAnimalTypes', vetId],
      queryFn: () => getAnimaltypesFromVeterinary(vetId.toString()),
      retry: false,
    })

  const { data: allAnimalTypesData, isLoading: isLoadingAllAnimalTypes } =
    useQuery<Array<AnimalTypeType>>({
      queryKey: ['allAnimalTypes'],
      queryFn: () => getAllAnimalTypes(undefined),
      retry: false,
    })

  const { data: personAnimalsData } = useQuery({
    queryKey: ['personAnimals', selectedPersonId],
    queryFn: () => getAnimalsFromUser(selectedPersonId!),
    retry: false,
    enabled: selectedPersonId !== null,
  })

  const treatableAnimalTypeIds = useMemo(() => {
    return treatableAnimalTypesData?.map((at) => at.id) || []
  }, [treatableAnimalTypesData])

  const uniquePersons = useMemo(() => {
    if (!customersData) return []
    const personMap = new Map<number, PersonsType>()
    customersData.forEach((c) => {
      if (!personMap.has(c.person.id)) {
        personMap.set(c.person.id, c.person)
      }
    })
    return Array.from(personMap.values())
  }, [customersData])

  const personOptions = useMemo(() => {
    let persons = [...uniquePersons]

    // Add newly created person if not already in list
    if (
      newlyCreatedPerson &&
      !persons.some((p) => p.id === newlyCreatedPerson.id)
    ) {
      persons.push(newlyCreatedPerson)
    }

    return persons
      .map((person) => ({
        value: person.id,
        label: `${person.firstName} ${person.lastName} - ${person.email}`,
      }))
      .sort((a, b) => a.label.localeCompare(b.label))
  }, [uniquePersons, newlyCreatedPerson])

  const filteredAnimals = useMemo(() => {
    if (
      !selectedPersonId ||
      !personAnimalsData ||
      treatableAnimalTypeIds.length === 0
    )
      return []
    return personAnimalsData.filter((animal) =>
      treatableAnimalTypeIds.includes(animal.animalTypeId),
    )
  }, [selectedPersonId, personAnimalsData, treatableAnimalTypeIds])

  const getAnimalTypeName = (animalTypeId: number): string => {
    const animalType = allAnimalTypesData?.find((at) => at.id === animalTypeId)
    return animalType?.name || ''
  }

  const animalOptions = useMemo(() => {
    return filteredAnimals
      .map((animal) => ({
        value: animal.id,
        label: `${animal.name} - ${getAnimalTypeName(animal.animalTypeId)}`,
      }))
      .sort((a, b) => a.label.localeCompare(b.label))
  }, [filteredAnimals, allAnimalTypesData])

  const validateForm = (): boolean => {
    if (!selectedPersonId) {
      setErrorMessage('Bitte wählen Sie einen Tierbesitzer aus')
      return false
    }
    if (!selectedAnimalId) {
      setErrorMessage('Bitte wählen Sie ein Tier aus')
      return false
    }
    if (!selectedServiceId) {
      setErrorMessage('Bitte wählen Sie eine Behandlung aus')
      return false
    }
    setErrorMessage('')
    return true
  }

  const { mutate: mutateBookAppointment, isPending: isBookingPending } =
    useMutation({
      mutationFn: () =>
        bookAppointment(
          appointmentDetail.id,
          selectedAnimalId!,
          parseInt(selectedServiceId),
        ),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['appointments'] })
        queryClient.invalidateQueries({ queryKey: ['appointmentsFuture'] })
        queryClient.invalidateQueries({ queryKey: ['appointmentsPast'] })
        queryClient.invalidateQueries({
          queryKey: ['nextAvailableAppointments'],
        })
        queryClient.invalidateQueries({
          queryKey: ['bookedAppointmentsPractice'],
        })
        queryClient.invalidateQueries({
          queryKey: ['availableAppointmentsPractice'],
        })
        hideDialogBookAppointment()
      },
      onError: (error: Error) => {
        setErrorMessage(error.message || 'Fehler beim Buchen des Termins')
      },
    })

  const isDataLoading =
    isLoadingCustomers || isLoadingAnimalTypes || isLoadingAllAnimalTypes
  const isFormInvalid =
    !selectedServiceId || !selectedPersonId || !selectedAnimalId
  const isSubmitDisabled = isDataLoading || isBookingPending || isFormInvalid

  const customSelectStyles = {
    control: (base: any, state: any) => ({
      ...base,
      borderColor: state.isFocused ? '#2c8a59' : base.borderColor,
      boxShadow: state.isFocused
        ? '0 0 0 0.2rem rgba(44, 138, 89, 0.25)'
        : base.boxShadow,
      '&:hover': {
        borderColor: state.isFocused ? '#2c8a59' : base.borderColor,
      },
    }),
    option: (base: any, state: any) => ({
      ...base,
      backgroundColor: state.isSelected
        ? '#2c8a59'
        : state.isFocused
          ? 'rgba(125, 216, 159, 0.2)'
          : base.backgroundColor,
      color: state.isSelected ? 'white' : base.color,
      '&:active': {
        backgroundColor: 'rgba(44, 138, 89, 0.3)',
      },
    }),
  }

  const handleCloseDialog = () => {
    setNewlyCreatedPerson(null)
    setSelectedPersonId(null)
    setSelectedAnimalId(null)
    setSelectedServiceId('')
    setErrorMessage('')
    hideDialogBookAppointment()
  }

  const handleSubmitBookAppointment = () => {
    if (validateForm()) {
      mutateBookAppointment()
    }
  }

  const handleServiceChange = (
    selectedOption: SingleValue<{ value: number; label: string }>,
  ) => {
    setSelectedServiceId(selectedOption?.value.toString() || '')
  }

  const handlePersonChange = (
    selectedOption: SingleValue<{ value: number; label: string }>,
  ) => {
    setSelectedPersonId(selectedOption?.value || null)
    setSelectedAnimalId(null)
  }

  const handleAnimalChange = (
    selectedOption: SingleValue<{ value: number; label: string }>,
  ) => {
    setSelectedAnimalId(selectedOption?.value || null)
    setSelectedServiceId('')
  }

  const handleOpenPersonDialog = () => {
    setShowPersonDialog(true)
  }

  const handleClosePersonDialog = () => {
    setShowPersonDialog(false)
  }

  const handlePersonCreated = async (personId: number) => {
    try {
      // Fetch newly created person
      const person = await getPersonById(personId)
      setNewlyCreatedPerson(person)
    } catch (error) {
      console.error('Failed to fetch newly created person:', error)
    }

    queryClient.invalidateQueries({ queryKey: ['customers', practiceId] })
    setSelectedPersonId(personId)
    setSuccessNotificationMessage('Tierbesitzer erfolgreich angelegt')
    setShowSuccessNotification(true)
    setTimeout(() => setShowSuccessNotification(false), 3000)
  }

  const handleOpenAnimalDialog = () => {
    setShowAnimalDialog(true)
  }

  const handleCloseAnimalDialog = () => {
    setShowAnimalDialog(false)
  }

  const handleAnimalCreated = () => {
    queryClient.invalidateQueries({ queryKey: ['customers', practiceId] })
    queryClient.invalidateQueries({
      queryKey: ['personAnimals', selectedPersonId],
    })
    setSuccessNotificationMessage('Tier erfolgreich angelegt')
    setShowSuccessNotification(true)
    setTimeout(() => setShowSuccessNotification(false), 3000)
  }

  const handleShowSuccessNotification = () => {
    setShowSuccessNotification(true)
    setTimeout(() => setShowSuccessNotification(false), 3000)
  }

  const selectedAnimal = useMemo(() => {
    if (!selectedAnimalId || !personAnimalsData) return null
    return (
      personAnimalsData.find((animal) => animal.id === selectedAnimalId) || null
    )
  }, [selectedAnimalId, personAnimalsData])

  const canTreatSelectedAnimal = useMemo(() => {
    if (!selectedAnimal) return false
    return treatableAnimalTypeIds.includes(selectedAnimal.animalTypeId)
  }, [selectedAnimal, treatableAnimalTypeIds])

  const serviceOptions = useMemo(() => {
    return [...appointmentDetail.availableServices]
      .sort((a, b) => a.name.localeCompare(b.name))
      .map((service) => ({
        value: service.id,
        label: service.name,
      }))
  }, [appointmentDetail.availableServices])

  return (
    <Modal
      className="appointment-detail-modal"
      show={true}
      onHide={handleCloseDialog}
    >
      <Modal.Header closeButton>
        <Modal.Title>
          Termin buchen
          <div className="modal-subtitle">
            {dateToDateString(appointmentDetail.startTime)} ·{' '}
            {dateToTimeString(appointmentDetail.startTime)} -{' '}
            {dateToTimeString(appointmentDetail.endTime)}
          </div>
        </Modal.Title>
      </Modal.Header>

      <Modal.Body>
        {errorMessage && (
          <Alert
            variant="danger"
            dismissible
            onClose={() => setErrorMessage('')}
          >
            {errorMessage}
          </Alert>
        )}

        {isDataLoading && (
          <div className="text-center my-3">
            <Spinner animation="border" role="status">
              <span className="visually-hidden">Laden...</span>
            </Spinner>
          </div>
        )}

        {!customersData?.length && !isLoadingCustomers && (
          <Alert variant="info">
            Keine Kunden gefunden. Diese Praxis hat noch keine Kunden mit
            gebuchten Terminen.
          </Alert>
        )}

        <ListGroup className="list-group-flush">
          <ListGroup.Item>
            <strong>Tierarzt</strong>
            <p>
              {appointmentDetail.veterinary.firstName}{' '}
              {appointmentDetail.veterinary.lastName}
            </p>
          </ListGroup.Item>

          <ListGroup.Item>
            <FormGroup>
              <div className="d-flex justify-content-between align-items-center mb-2">
                <Form.Label className="mb-0">Tierbesitzer:</Form.Label>
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault()
                    handleOpenPersonDialog()
                  }}
                  style={{
                    color: '#2c8a59',
                    textDecoration: 'none',
                    fontSize: '0.875rem',
                  }}
                >
                  <i className="bi bi-plus-circle me-1"></i>
                  Neu anlegen
                </a>
              </div>
              <Select
                options={personOptions}
                value={
                  personOptions.find((opt) => opt.value === selectedPersonId) ||
                  null
                }
                onChange={handlePersonChange}
                placeholder="Tierbesitzer auswählen..."
                isClearable
                isDisabled={isDataLoading || isBookingPending}
                styles={customSelectStyles}
              />
            </FormGroup>
          </ListGroup.Item>

          <ListGroup.Item>
            <FormGroup>
              <div className="d-flex justify-content-between align-items-center mb-2">
                <Form.Label className="mb-0">Tier:</Form.Label>
                {selectedPersonId && (
                  <a
                    href="#"
                    onClick={(e) => {
                      e.preventDefault()
                      handleOpenAnimalDialog()
                    }}
                    style={{
                      color: '#2c8a59',
                      textDecoration: 'none',
                      fontSize: '0.875rem',
                    }}
                  >
                    <i className="bi bi-plus-circle me-1"></i>
                    Neu anlegen
                  </a>
                )}
              </div>
              {selectedPersonId && filteredAnimals.length === 0 ? (
                <Select
                  options={[]}
                  value={null}
                  isDisabled={true}
                  placeholder="Dieser Tierarzt kann keine Tiere dieses Besitzers behandeln"
                  styles={customSelectStyles}
                />
              ) : (
                <Select
                  options={animalOptions}
                  value={
                    animalOptions.find(
                      (opt) => opt.value === selectedAnimalId,
                    ) || null
                  }
                  onChange={handleAnimalChange}
                  placeholder="Tier auswählen..."
                  isClearable
                  isDisabled={
                    !selectedPersonId || isDataLoading || isBookingPending
                  }
                  styles={customSelectStyles}
                />
              )}
            </FormGroup>
          </ListGroup.Item>

          <ListGroup.Item>
            <FormGroup>
              <Form.Label>Behandlung:</Form.Label>
              {selectedAnimalId && !canTreatSelectedAnimal ? (
                <Select
                  options={[]}
                  value={null}
                  isDisabled={true}
                  placeholder="Keine Behandlungen verfügbar"
                  styles={customSelectStyles}
                />
              ) : (
                <Select
                  options={serviceOptions}
                  value={
                    serviceOptions.find(
                      (opt) => opt.value.toString() === selectedServiceId,
                    ) || null
                  }
                  onChange={handleServiceChange}
                  placeholder="Behandlung auswählen..."
                  isClearable
                  isDisabled={
                    !selectedAnimalId || isDataLoading || isBookingPending
                  }
                  styles={customSelectStyles}
                />
              )}
            </FormGroup>
          </ListGroup.Item>
        </ListGroup>
      </Modal.Body>

      <Modal.Footer>
        <Button
          variant="secondary"
          onClick={handleCloseDialog}
          disabled={isBookingPending}
          data-testid="animal-cancel-button"
        >
          Abbrechen
        </Button>
        <Button
          variant="primary"
          onClick={handleSubmitBookAppointment}
          disabled={isSubmitDisabled}
          data-testid="animal-delete-button"
        >
          {isBookingPending ? (
            <>
              <Spinner
                as="span"
                animation="border"
                size="sm"
                role="status"
                aria-hidden="true"
                className="me-2"
              />
              Wird gebucht...
            </>
          ) : (
            'Buchen'
          )}
        </Button>
      </Modal.Footer>

      {showPersonDialog && (
        <PersonEditNewDialog
          hideDialogNewPerson={handleClosePersonDialog}
          onPersonCreated={handlePersonCreated}
          showSuccessNotification={handleShowSuccessNotification}
        />
      )}

      {showAnimalDialog && selectedPersonId && (
        <AnimalEditNewDialog
          hideDialogNewAnimal={handleCloseAnimalDialog}
          animalEdit={undefined}
          onAnimalCreated={handleAnimalCreated}
          showSuccessNotification={handleShowSuccessNotification}
        />
      )}

      {showSuccessNotification && (
        <div
          style={{
            position: 'fixed',
            top: '20px',
            right: '20px',
            zIndex: 9999,
            backgroundColor: '#2c8a59',
            color: 'white',
            padding: '1rem 1.5rem',
            borderRadius: '8px',
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
          }}
        >
          <i className="bi bi-check-circle me-2"></i>
          {successNotificationMessage}
        </div>
      )}
    </Modal>
  )
}
