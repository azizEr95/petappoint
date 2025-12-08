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
import { getAllAvailableServices, getServicesFromVeterinary } from '../../../../api/ServicesAPI'
import { LoginForm } from '../../../../components/Login'
import { StatusBooking } from '../../../../types/booking'
import { getAnimaltypesFromVeterinary } from '../../../../api/AnimalTypeAPI'
import type {
  AnimalTypeType,
  AnimalsType,
  AppointmentsType,
  ServiceType,
  VeterinaryPracticesType,
} from '../../../../../../shared/schemas/ZodSchemas'

export const Route = createFileRoute(
  '/practices/$practiceId/booking/$appointmentId',
)({
  component: BookingComponent,
})

function BookingComponent() {
  const navigate = useNavigate()
  const location = useLocation()
  const { login } = useLoginContext()
  const serviceType = location.state.serviceType
  const animalId = location.state.filterAnimalId
  const animalTypeId = location.state.filterAnimalTypeId
  const selectedService = location.state.selectedService
  const { practiceId, appointmentId } = Route.useParams()
  const [selectedAppointmentType, setSelectedAppointmentType] =
    useState<ServiceType | null>(null)
  const [selectedAnimal, setSelectedAnimal] = useState<AnimalsType | null>(null) // aktuell ausgewaehltes Tier, bei null ist keins ausgewaehlt
  const [status, setStatus] = useState<StatusBooking>(
    StatusBooking.selectAnimal,
  ) // State in the booking prozess, controls what is displayed
  const [foundFilteredServices, setFoundFilteredServices] =
    useState<Array<ServiceType> | null>(null) // if an filter was selected save which services have to been shown and available
  const [notFoundFilteredServices, setNotFoundFilteredServices] =
    useState<Array<ServiceType> | null>(null) // if filter was selected all services from the filter that are not available
  const [filterTreatAnimaltypes, setFilterTreatAnimaltypes] = useState<Array<number>>(animalTypeId !== undefined ? [animalTypeId] : []);
  const [userId, setUserId] = useState(login ? login.id : undefined)

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

  const appointment: AppointmentsType | undefined = dataAppointment
  const practice: VeterinaryPracticesType | undefined = dataPractice

  // load all Services
  const {
    isSuccess: isSuccessAllServices,
    data: dataAllServices,
  } = useQuery<Array<ServiceType>>({
    queryKey: ['allServices'],
    queryFn: () => getAllAvailableServices(undefined),
    retry: false,
  })

  // load all Services from veterinary
  const {
    isSuccess: isSuccessServicesVeterinary,
    data: dataServicesVeterinary,
  } = useQuery<Array<ServiceType>>({
    queryKey: ['allServicesVeterinary', appointment?.veterinary.id],
    queryFn: () => getServicesFromVeterinary(appointment?.veterinary.id.toString() ?? ""), // appointment is always defined if enabled
    retry: false,
    enabled: appointment !== undefined,
  })

  // load all Animaltypes from veterinary
  const {
    isSuccess: isSuccessAnimaltypesVeterinary,
    data: dataAnimaltypesVeterinary,
  } = useQuery<Array<AnimalTypeType>>({
    queryKey: ['allAnimaltypesVeterinary', appointment?.veterinary.id],
    queryFn: () => getAnimaltypesFromVeterinary(appointment?.veterinary.id.toString() ?? ""), // appointment is always defined if enabled
    retry: false,
    enabled: appointment !== undefined,
  })

  useEffect(() => {
    if (isSuccessAnimaltypesVeterinary) {
      if (filterTreatAnimaltypes.length === 0) {
        const allAnimaltypeIds = dataAnimaltypesVeterinary.map((animalType) => animalType.id);
        setFilterTreatAnimaltypes(allAnimaltypeIds);
      }
    }
  }, [isSuccessAnimaltypesVeterinary, dataAnimaltypesVeterinary])

  // load animal if it was in filter selected:
  const { isSuccess: isSuccessAnimal, data: dataAnimal } = useQuery<
    Array<AnimalsType>
  >({
    queryKey: ['animal', userId],
    queryFn: () => getAnimalsFromUser(userId ?? -1),
    retry: false,
    enabled: userId !== undefined,
  })

  useEffect(() => {
    setUserId(login ? login.id : undefined)
  }, [login])

  useEffect(() => {
    if (userId === undefined && status === StatusBooking.selectAnimal) {
      setStatus(StatusBooking.login)
    }
  }, [userId])

  useEffect(() => {
    if (selectedService !== undefined && selectedAnimal === null) {
      handleSelectAppointmentType(selectedService)
    }
  }, [selectedService])

  useEffect(() => {
    if (
      serviceType !== null &&
      serviceType !== undefined &&
      serviceType.length > 0 &&
      isSuccessAppointment && isSuccessAllServices
    ) {
      const uniqueService = new Set(serviceType)
      const foundService = dataAppointment.availableServices.filter(
        (avaService) => {
          // all services that are filtered and for this appointment are available
          return uniqueService.has(avaService.id)
        },
      )
      const setFoundService = new Set(foundService.map((s) => s.id));
      const notFoundService = dataAllServices.filter(
        (avaService) => {
          // all services that are filtered and for this appointment not available
          // should be from all services from the veterinary
          return uniqueService.has(avaService.id) && !setFoundService.has(avaService.id);
        },
      )
      setFoundFilteredServices(foundService)
      setNotFoundFilteredServices(notFoundService);
      if (foundService.length === 1 && serviceType.length === 1) {
        // if only one ServiceType was selected, skip SelectAppointmentType component
        setFoundFilteredServices(null)
        setSelectedAppointmentType(foundService[0])
        if (login !== undefined && login !== false) {
          setStatus(StatusBooking.selectAnimal)
        } else {
          setStatus(StatusBooking.login)
        }
      }
      if (foundService.length === 0 && isSuccessServicesVeterinary) { // no services found, set all services from the veterinary
        setFoundFilteredServices(dataServicesVeterinary);
      }
    } else if (serviceType?.length === 0) { // if no filter was selected, show all available services
      if (isSuccessAppointment) {
        setFoundFilteredServices(dataAppointment.availableServices);
      }
    }
  }, [serviceType, isSuccessAppointment, dataAppointment, selectedService, isSuccessAllServices, dataAllServices, isSuccessServicesVeterinary, dataServicesVeterinary])

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
        // Skip to service selection if animal is pre-selected
        if (login !== undefined && login !== false) {
          setStatus(StatusBooking.selectAppointmentType)
        } else {
          setStatus(StatusBooking.login)
        }
      }
    }
  }, [isSuccessAnimal, dataAnimal])

  useEffect(() => {
    if (status === StatusBooking.selectAnimal && selectedAnimal !== null && isSuccessAppointment && isSuccessPractice) {
      // if animal was selected in filter book appointment immediately
      handleBookAppoinment()
    }
  }, [status, isSuccessAppointment, isSuccessPractice])

  const handleClickBack = () => {
    // einmal auf der seite zurueck
    switch (status) {
      case StatusBooking.selectAnimal:
        setSelectedAnimal(null)
        window.history.back();
        break
      case StatusBooking.selectAppointmentType:
        setSelectedAppointmentType(null)
        setStatus(StatusBooking.selectAnimal)
        break
      case StatusBooking.login:
        setStatus(StatusBooking.selectAnimal)
        break
      default:
        setSelectedAnimal(null)
        setStatus(StatusBooking.selectAnimal)
    }
  }

  const handleSelectAppointmentType = (appointmentType: ServiceType) => {
    setSelectedAppointmentType(appointmentType)

    // Navigate to confirmation page with all booking data
    if (selectedAnimal === null) {
      navigate({ to: '/practices/' + practiceId + '/booking/' + appointmentId })
      return
    }

    navigate({
      to: '/booking/confirmation',
      state: {
        appointment: appointment,
        selectedAnimal: selectedAnimal,
        selectedService: appointmentType,
        practice: practice,
      },
    })
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

  const handleSelectAnimal = () => {
    if (selectedAnimal === null) {
      return
    }
    navigate({
      state: {
        selectedAnimal: selectedAnimal,
        serviceType: serviceType // only to save in state
      }
    })

    if (login !== undefined && login !== false) {
      setStatus(StatusBooking.selectAppointmentType)
    } else {
      setStatus(StatusBooking.login)
    }
  }

  if (!isSuccessAppointment || !isSuccessPractice || appointment === undefined || practice === undefined) {
    return <></>
  }


  let currentDisplay
  let submitButton
  let currentStep: 1 | 2 | 3 = 1

  switch (status) {
    case StatusBooking.selectAnimal:
      currentDisplay = (
        <SelectAnimal
          handleChangeAnimal={handleChangeAnimal}
          filteredAnimalTypeId={filterTreatAnimaltypes}
        />
      )
      submitButton = (
        <div className="select-animal-actions">
          <button
            id="selectAnimalButton"
            className="booking-confirm-button"
            onClick={handleSelectAnimal}
            disabled={!selectedAnimal}
          >
            <i className="bi bi-arrow-right-circle"></i>
            Weiter zur Leistungsauswahl
          </button>
        </div>
      )
      currentStep = 1
      break
    case StatusBooking.login:
      currentDisplay = (
        <LoginForm
          setStatusBookingProcess={setStatus}
          appointment={appointment}
        />
      )
      break
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
      currentStep = 2
      break
    default:
      currentDisplay = (
        <SelectAnimal
          handleChangeAnimal={handleChangeAnimal}
          filteredAnimalTypeId={filterTreatAnimaltypes}
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

      {status !== StatusBooking.login && (
        <BookingStepper currentStep={currentStep} />
      )}

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
                {practice.address.street}, {practice.address.cityCode}{' '}
                {practice.address.city}
              </div>
            </div>
          </div>

          <div className="info-item">
            <i className="bi bi-clock"></i>
            <div className="info-content">
              <div className="info-label">Termin</div>
              <div className="info-value">
                {dateToInfosString(appointment.startTime)}
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

          <div className="info-item">
            <i className="bi bi-paw"></i>
            <div className="info-content">
              <div className="info-label">Tier</div>
              <div className="info-value">{selectedAnimal ? selectedAnimal.name : '-'}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
