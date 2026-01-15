import {
  createFileRoute,
  useLocation,
  useNavigate,
} from '@tanstack/react-router'
import '../../styles/routes/bookingPage.scss'
import { useEffect, useState } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { Button } from 'react-bootstrap'
import { SelectAppointmentType } from '../../components/booking/SelectAppointmentType'
import { SelectAnimal } from '../../components/booking/SelectAnimal'
import BookingStepper from '../../components/booking/BookingStepper'
import { getAppointmentsById } from '../../api/AppointmentsAPI'
import { dateToInfosString } from '../../utils/DateToStringFormat'
import { useLoginContext } from '../../LoginContext'
import { getAnimalsFromUser } from '../../api/AnimalsAPI'
import { getAllAvailableServices, getServicesFromVeterinary } from '../../api/ServicesAPI'
import { LoginForm } from '../../components/registration/Login'
import { StatusBooking } from '../../types/booking'
import { getAnimaltypesFromVeterinary } from '../../api/AnimalTypeAPI'
import { AnimalEditNewDialog } from '../../components/animal/AnimalEditNewDialog'
import type {
  AnimalTypeType,
  AnimalsType,
  AppointmentsType,
  ServiceType,
} from 'vetilib-shared/schemas/ZodSchemas'
import { useTitle } from '@/utils/useTitle'

export const Route = createFileRoute('/booking/$appointmentId')({
  component: BookingComponent,
})

function BookingComponent() {
  useTitle('Termin buchen');
  const navigate = useNavigate()
  const location = useLocation()
  const queryClient = useQueryClient()
  const { login } = useLoginContext()
  const serviceType = location.state.serviceType
  const animalId = location.state.filterAnimalId
  const animalTypeId = location.state.filterAnimalTypeId
  const selectedService = location.state.selectedService
  const { appointmentId } = Route.useParams()
  const [selectedAppointmentType, setSelectedAppointmentType] =
    useState<ServiceType | null>(null)
  const [selectedAnimal, setSelectedAnimal] = useState<AnimalsType | null>(null)
  const [status, setStatus] = useState<StatusBooking>(
    StatusBooking.selectAnimal,
  )
  const [foundFilteredServices, setFoundFilteredServices] =
    useState<Array<ServiceType> | null>(null)
  const [notFoundFilteredServices, setNotFoundFilteredServices] =
    useState<Array<ServiceType> | null>(null)
  const [filterTreatAnimaltypes, setFilterTreatAnimaltypes] = useState<Array<number>>(animalTypeId !== undefined ? [animalTypeId] : []);
  const [userId, setUserId] = useState(login ? login.id : undefined)
  const [showCreateAnimalDialog, setShowCreateAnimalDialog] = useState(false)

  // load Appointment (contains practice info via veterinaryPractice relation):
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
  const practice = appointment?.veterinaryPractice

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
    queryFn: () => getServicesFromVeterinary(appointment?.veterinary.id.toString() ?? ""),
    retry: false,
    enabled: appointment !== undefined,
  })

  // load all Animaltypes from veterinary
  const {
    isSuccess: isSuccessAnimaltypesVeterinary,
    data: dataAnimaltypesVeterinary,
  } = useQuery<Array<AnimalTypeType>>({
    queryKey: ['allAnimaltypesVeterinary', appointment?.veterinary.id],
    queryFn: () => getAnimaltypesFromVeterinary(appointment?.veterinary.id.toString() ?? ""),
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

  // Determine if user needs to create animal (only when in selectAnimal status)
  useEffect(() => {
    if (userId !== undefined && isSuccessAnimal && status === StatusBooking.selectAnimal) {
      const hasMatchingAnimal = dataAnimal.some(
        (animal) => filterTreatAnimaltypes.includes(animal.animalTypeId)
      )

      if (dataAnimal.length === 0 || !hasMatchingAnimal) {
        // No animals or wrong type - need to create
        setStatus(StatusBooking.createAnimal)
      } else {
        // Has matching animals - stay in select animal
        setShowCreateAnimalDialog(false)
      }
    }
  }, [userId, isSuccessAnimal, dataAnimal, filterTreatAnimaltypes, status])

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
          return uniqueService.has(avaService.id)
        },
      )
      const setFoundService = new Set(foundService.map((s) => s.id));
      const notFoundService = dataAllServices.filter(
        (avaService) => {
          return uniqueService.has(avaService.id) && !setFoundService.has(avaService.id);
        },
      )
      setFoundFilteredServices(foundService)
      setNotFoundFilteredServices(notFoundService);
      if (foundService.length === 1 && serviceType.length === 1) {
        setFoundFilteredServices(null)
        setSelectedAppointmentType(foundService[0])
        if (login) {
          setStatus(StatusBooking.selectAnimal)
        } else {
          setStatus(StatusBooking.login)
        }
      }
      if (foundService.length === 0 && isSuccessServicesVeterinary) {
        setFoundFilteredServices(dataServicesVeterinary);
      }
    } else if (serviceType?.length === 0) {
      if (isSuccessAppointment) {
        setFoundFilteredServices(dataAppointment.availableServices);
      }
    }
  }, [serviceType, isSuccessAppointment, dataAppointment, selectedService, isSuccessAllServices, dataAllServices, isSuccessServicesVeterinary, dataServicesVeterinary, selectedAnimal])

  useEffect(() => {
    if (isPendingAppointment) {
      return
    }

    if (isErrorAppointment) {
      navigate({ to: '/' })
    }
  }, [
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
        if (login) {
          setStatus(StatusBooking.selectAppointmentType)
        } else {
          setStatus(StatusBooking.login)
        }
      }
    }
  }, [isSuccessAnimal, dataAnimal])

  useEffect(() => {
    if (status === StatusBooking.selectAppointmentType && selectedAppointmentType !== null && isSuccessAppointment) {
      handleBookAppoinment()
    }
  }, [status, isSuccessAppointment, selectedService])

  const handleClickBack = () => {
    switch (status) {
      case StatusBooking.selectAnimal:
        setSelectedAnimal(null);
        window.history.back();
        break
      case StatusBooking.selectAppointmentType:
        setSelectedAppointmentType(null);
        setStatus(StatusBooking.selectAnimal);
        break
      case StatusBooking.createAnimal:
        setShowCreateAnimalDialog(false);
        window.history.back();
        break
      case StatusBooking.login:
        window.history.back();
        break
      default:
        setSelectedAnimal(null)
        setStatus(StatusBooking.selectAnimal);
    }
  }

  const handleSelectAppointmentType = (appointmentType: ServiceType) => {
    setSelectedAppointmentType(appointmentType)

    if (selectedAnimal === null) {
      navigate({ to: '/booking/$appointmentId', params: { appointmentId } })
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
      navigate({ to: '/booking/$appointmentId', params: { appointmentId } })
    } else {
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

  const handleAnimalCreated = () => {
    // Refetch animals after creation
    queryClient.invalidateQueries({ queryKey: ['animals', userId] })
    // Dialog will close automatically via AnimalEditNewDialog's hideDialogNewAnimal
    setShowCreateAnimalDialog(false)
    // Status will transition automatically via useEffect when animals are refetched
  }

  const handleSelectAnimal = () => {
    if (selectedAnimal === null) {
      return
    }
    navigate({
      state: {
        selectedAnimal: selectedAnimal,
        serviceType: serviceType
      }
    })

    if (login) {
      setStatus(StatusBooking.selectAppointmentType)
    } else {
      setStatus(StatusBooking.login)
    }
  }

  if (!isSuccessAppointment || appointment === undefined || practice === undefined) {
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
    case StatusBooking.createAnimal:
      currentDisplay = (
        <div className="create-animal-section">
          <h5 className="section-title">
            {dataAnimal?.length === 0
              ? 'Neues Tier anlegen'
              : `Tier vom benötigten Typ erforderlich`}
          </h5>
          <p className="section-description">
            {dataAnimal?.length === 0
              ? 'Du hast noch keine Tiere angelegt. Bitte erstelle ein neues Tier, um fortzufahren.'
              : 'Für diesen Termin benötigst du ein Tier von einem anderen Typ. Bitte erstelle ein neues Tier oder wähle einen anderen Termin.'}
          </p>
          <Button
            variant="primary"
            onClick={() => setShowCreateAnimalDialog(true)}
            className="mt-3"
          >
            <i className="bi bi-plus-circle me-2"></i>
            Neues Tier anlegen
          </Button>
        </div>
      )
      submitButton = null
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

      {status !== StatusBooking.login && status !== StatusBooking.createAnimal && status !== StatusBooking.booked && (
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

      {status === StatusBooking.createAnimal && showCreateAnimalDialog && (
        <AnimalEditNewDialog
          hideDialogNewAnimal={() => setShowCreateAnimalDialog(false)}
          animalEdit={undefined}
          preselectedAnimalTypeId={filterTreatAnimaltypes.length > 0 ? filterTreatAnimaltypes[0] : undefined}
          onAnimalCreated={handleAnimalCreated}
        />
      )}
    </div>
  )
}
