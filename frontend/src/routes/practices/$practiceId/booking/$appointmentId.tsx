import {
  createFileRoute,
  useLocation,
  useNavigate,
} from '@tanstack/react-router'
import '../../../../styles/routes/bookingPage.scss'
import { useEffect, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { SelectAppointmentType } from '../../../../components/booking/SelectAppointmentType'
import { SelectAnimal } from '../../../../components/booking/SelectAnimal'
import BookingStepper from '../../../../components/booking/BookingStepper'
import { getVeterinaryPracticesById } from '../../../../api/VeterinaryPracticeAPI'
import { getAppointmentsById } from '../../../../api/AppointmentsAPI'
import { dateToInfosString } from '../../../../utils/DateToStringFormat'
import { useLoginContext } from '../../../../LoginContext'
import { getAnimalsFromUser } from '../../../../api/AnimalsAPI'
import type {
  AnimalsType,
  AppointmentsType,
  ServiceType,
  VeterinaryPracticesType,
} from '../../../../../../shared/schemas/ZodSchemas'

export const Route = createFileRoute('/practices/$practiceId/booking/$appointmentId')({
  component: BookingComponent,
})

enum StatusBooking {
  selectAppointmentType = 'SELECT_APPOINTMENT_TYPE',
  selectAnimal = 'SELECT_ANIMAL',
  booked = 'BOOKED',
}

function BookingComponent() {
  const navigate = useNavigate()
  const location = useLocation()
  const { login } = useLoginContext()
  const serviceType = location.state.serviceType
  const animalId = location.state.filterAnimalId
  const animalTypeId = location.state.filterAnimalTypeId
  const { practiceId, appointmentId } = Route.useParams()
  const [selectedAppointmentType, setSelectedAppointmentType] =
    useState<ServiceType | null>(null)
  const [selectedAnimal, setSelectedAnimal] = useState<AnimalsType | null>(null) // aktuell ausgewaehltes Tier, bei null ist keins ausgewaehlt
  const [status, setStatus] = useState<StatusBooking>(
    StatusBooking.selectAppointmentType,
  ) // State in the booking prozess, controls what is displayed
  const [foundFilteredServices, setFoundFilteredServices] =
    useState<Array<ServiceType> | null>(null) // if an filter was selected save which services have to been shown and available
  const [notFoundFilteredServices, setNotFoundFilteredServices] =
    useState<Array<ServiceType> | null>(null) // if filter was selected all services from the filter that are not available

  // load VeterinaryPractice:
  const {
    isError: isErrorPractice,
    isSuccess: isSuccessPractice,
    isPending: isPendingPractice,
    data: dataPractice,
  } = useQuery<VeterinaryPracticesType>({
    queryKey: ['veterinaryPractices', practiceId],
    queryFn: () => getVeterinaryPracticesById(practiceId),
    retry: false,
  })

  // load Appointment:
  const {
    isError: isErrorAppointment,
    isSuccess: isSuccessAppointment,
    isPending: isPendingAppointment,
    data: dataAppointment,
  } = useQuery<AppointmentsType>({
    queryKey: ['appointment', appointmentId],
    queryFn: () => getAppointmentsById(appointmentId),
    retry: false,
  })

  // load animal if it was in filter selected:
  const userId = login ? login.id : -1
  const { isSuccess: isSuccessAnimal, data: dataAnimal } = useQuery<
    Array<AnimalsType>
  >({
    queryKey: ['animal', userId],
    queryFn: () => getAnimalsFromUser(userId),
    retry: false,
    enabled: userId !== -1,
  })

  useEffect(() => {
    if (
      serviceType !== null &&
      serviceType !== undefined &&
      isSuccessAppointment
    ) {
      const uniqueService = new Set(serviceType)
      const foundService = dataAppointment.availableServices.filter(
        (avaService) => {
          // all services that are filtered and for this appointment are available
          return uniqueService.has(avaService.id)
        },
      )
      const notFoundService = dataAppointment.availableServices.filter(
        (avaService) => {
          // all services that are filtered and for this appointment not available
          // should be from all services from the veterinary
          return !uniqueService.has(avaService.id)
        },
      )
      setFoundFilteredServices(foundService)
      if (foundService.length === 1 && serviceType.length === 1) {
        // if only one ServiceType was selected, skip SelectAppointmentType component
        setFoundFilteredServices(null)
        setSelectedAppointmentType(foundService[0])
        setStatus(StatusBooking.selectAnimal)
      }
      setNotFoundFilteredServices(notFoundService)
    }
  }, [serviceType, isSuccessAppointment, dataAppointment])

  useEffect(() => {
    if (isPendingPractice || isPendingAppointment) {
      return
    }

    if (isErrorPractice || isErrorAppointment) {
      navigate({ to: '/' })
    }
  }, [
    isErrorPractice,
    isSuccessPractice,
    isPendingPractice,
    isErrorAppointment,
    isSuccessAppointment,
    isPendingAppointment,
  ])

  useEffect(() => {
    if (isSuccessAnimal) {
      const animal = dataAnimal.find((x) => {
        return x.id === animalId
      })
      if (animal !== undefined) {
        setSelectedAnimal(animal)
      }
    }
  }, [isSuccessAnimal, dataAnimal])

  useEffect(() => {
    if (status === 'SELECT_ANIMAL' && selectedAnimal !== null) {
      // if animal was selected in filter book appointment immediately
      handleBookAppoinment()
    }
  }, [status])

  const handleClickBack = () => {
    // einmal auf der seite zurueck
    switch (status) {
      case StatusBooking.selectAppointmentType:
        setSelectedAppointmentType(null)
        window.history.back()
        break
      case StatusBooking.selectAnimal:
        setSelectedAppointmentType(null)
        setStatus(StatusBooking.selectAppointmentType)
        break
      default:
        setSelectedAppointmentType(null)
        setStatus(StatusBooking.selectAppointmentType)
    }
  }

  const handleSelectAppointmentType = (appointmentType: ServiceType) => {
    setSelectedAppointmentType(appointmentType)
    setStatus(StatusBooking.selectAnimal)
  }

  const handleBookAppoinment = () => {
    if (selectedAnimal === null || selectedAppointmentType === null) {
      // no animal or appointmentType was selected, booking is not possible
      navigate({ to: '/practices/' + practiceId + '/booking/' + appointmentId })
    } else {
      // Navigate to confirmation page with all booking data
      navigate({
        to: '/booking/confirmation',
        state: {
          appointment: appointment,
          selectedAnimal: selectedAnimal,
          selectedService: selectedAppointmentType,
          practice: practice,
        },
      })
    }
  }

  const handleChangeAnimal = (animal: AnimalsType | null) => {
    setSelectedAnimal(animal)
  }

  if (!isSuccessAppointment || !isSuccessPractice) {
    return <></>
  }

  const appointment: AppointmentsType = dataAppointment
  const practice: VeterinaryPracticesType | undefined = dataPractice
  let currentDisplay
  let submitButton
  let currentStep: 1 | 2 | 3 = 1

  switch (status) {
    case StatusBooking.selectAppointmentType:
      currentDisplay = (
        <SelectAppointmentType
          practice={practice}
          appointment={appointment}
          handleSelectAppointmentType={handleSelectAppointmentType}
          foundFilterServices={foundFilteredServices}
          notFoundFilterServices={notFoundFilteredServices}
        />
      )
      submitButton = null
      currentStep = 1
      break
    case StatusBooking.selectAnimal:
      currentDisplay = (
        <SelectAnimal
          handleChangeAnimal={handleChangeAnimal}
          filteredAnimalType={animalTypeId}
        />
      )
      submitButton = (
        <div className="select-animal-actions">
          <button
            id="bookAppointment"
            className="booking-confirm-button"
            onClick={handleBookAppoinment}
            disabled={!selectedAnimal}
          >
            <i className="bi bi-arrow-right-circle"></i>
            Weiter zur Zusammenfassung
          </button>
        </div>
      )
      currentStep = 2
      break
    default:
      currentDisplay = (
        <SelectAppointmentType
          practice={practice}
          appointment={appointment}
          handleSelectAppointmentType={handleSelectAppointmentType}
          foundFilterServices={null}
          notFoundFilterServices={null}
        />
      )

      submitButton = null
      currentStep = 1
  }

  return (
    <div className="booking-page">
      <div className="booking-header">
        <button className="back-button" onClick={handleClickBack}>
          <i className="bi bi-arrow-left"></i>
          Zurück
        </button>
        <h1>Termin buchen</h1>
      </div>

      <BookingStepper currentStep={currentStep} />

      <div className="booking-layout">
        <div className="booking-main">
          {currentDisplay}
          {submitButton}
        </div>

        <div className="booking-sidebar">
          <div className="sidebar-section-title">Buchungsübersicht</div>

          <div className="info-item">
            <i className="bi bi-hospital"></i>
            <div className="info-content">
              <div className="info-label">Praxis</div>
              <div className="info-value">{practice.name}</div>
            </div>
          </div>

          <div className="info-item">
            <i className="bi bi-geo-alt"></i>
            <div className="info-content">
              <div className="info-label">Adresse</div>
              <div className="info-value">
                {practice.addresses.street}, {practice.addresses.citycode}{' '}
                {practice.addresses.city}
              </div>
            </div>
          </div>

          <div className="info-item">
            <i className="bi bi-clock"></i>
            <div className="info-content">
              <div className="info-label">Termin</div>
              <div className="info-value">
                {dateToInfosString(appointment.starttime)}
              </div>
            </div>
          </div>

          {selectedAppointmentType !== null && (
            <div className="info-item">
              <i className="bi bi-card-list"></i>
              <div className="info-content">
                <div className="info-label">Leistung</div>
                <div className="info-value">{selectedAppointmentType.name}</div>
              </div>
            </div>
          )}

          {selectedAnimal && (
            <div className="info-item">
              <i className="bi bi-paw"></i>
              <div className="info-content">
                <div className="info-label">Tier</div>
                <div className="info-value">{selectedAnimal.name}</div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
