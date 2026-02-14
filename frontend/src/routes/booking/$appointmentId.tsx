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
} from 'petappoint-shared/schemas/ZodSchemas'
import { useTitle } from '@/utils/useTitle'
import { SuccessNotificationToast } from '@/components/SuccessNotificationToast'

export const Route = createFileRoute('/booking/$appointmentId')({
  validateSearch: (search: Record<string, unknown>) => {
    return {
      address: search.address as string | undefined,
      animalType: search.animalType as string | undefined,
      serviceType: search.serviceType as string | undefined,
      animal: search.animal as string | undefined,
    }
  },
  component: BookingComponent,
})

function BookingComponent() {
  useTitle('Termin buchen');
  const navigate = useNavigate()
  const location = useLocation()
  const queryClient = useQueryClient()
  const { login } = useLoginContext()
  const state = location.state
  const serviceType = state.serviceType
  const animalId = state.filterAnimalId
  const animalTypeId = state.filterAnimalTypeId
  const selectedService = state.selectedService
  const { address, animalType, serviceType: serviceTypeParam, animal } = Route.useSearch()

  // Use URL search params if available (e.g., from browser back), otherwise use state
  const searchParams = {
    address: address || state.searchParams?.address || '',
    animalType: animalType ? animalType : state.searchParams?.animalType || '',
    serviceType: serviceTypeParam ? serviceTypeParam : state.searchParams?.serviceType || '',
    animal: animal ? animal : state.searchParams?.animal || '',
  }
  const { appointmentId } = Route.useParams()
  const [selectedAppointmentType, setSelectedAppointmentType] =
    useState<ServiceType | null>(null)
  const [selectedAnimal, setSelectedAnimal] = useState<AnimalsType | null>(
    state.selectedAnimal || null
  )
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
  const [allAnimaltypesString, setAllAnimaltypesString] = useState<string>("");
  const [showSuccessNotification, setShowSuccessNotification] = useState<boolean>(false);

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
        const allAnimaltypeIds = dataAnimaltypesVeterinary.map((animalTypeMap) => animalTypeMap.id);
        setFilterTreatAnimaltypes(allAnimaltypeIds);
      }
      setAllAnimaltypesString(dataAnimaltypesVeterinary.map((at) => at.name).join(", "));
    }
  }, [isSuccessAnimaltypesVeterinary, dataAnimaltypesVeterinary])

  // load animal if it was in filter selected:
  const { isSuccess: isSuccessAnimal, data: dataAnimal } = useQuery<
    Array<AnimalsType>
  >({
    queryKey: ['animals', userId],
    queryFn: () => getAnimalsFromUser(userId ?? -1),
    retry: false,
    enabled: userId !== undefined,
  })

  useEffect(() => {
    setUserId(login ? login.id : undefined)
  }, [login])

  // Determine if user needs to create animal (only when in selectAnimal status)
  useEffect(() => {
    if (userId === undefined || !isSuccessAnimal || status !== StatusBooking.selectAnimal) return;
    if (filterTreatAnimaltypes.length === 0) return;

    const hasMatchingAnimal = dataAnimal.some(
      (animalFilter) => filterTreatAnimaltypes.includes(animalFilter.animalTypeId)
    );

    if (dataAnimal.length === 0 || !hasMatchingAnimal) {
      setStatus(StatusBooking.createAnimal);
    } else {
      setShowCreateAnimalDialog(false);
    }
  }, [userId, isSuccessAnimal, dataAnimal, filterTreatAnimaltypes, status]);

  useEffect(() => {
    if (status !== StatusBooking.createAnimal) return;
    if (!isSuccessAnimal || filterTreatAnimaltypes.length === 0) return;

    const hasMatchingAnimal = dataAnimal.some(
      (animalMatch) => filterTreatAnimaltypes.includes(animalMatch.animalTypeId)
    );

    if (hasMatchingAnimal) {
      setStatus(StatusBooking.selectAnimal);
      setShowCreateAnimalDialog(false);
    }
  }, [status, isSuccessAnimal, dataAnimal, filterTreatAnimaltypes])

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
      const animalFound = dataAnimal.find((x) => {
        return x.id === animalId
      })
      if (animalId !== undefined && animalFound) {
        setSelectedAnimal(animalFound)
        if (login) {
          setStatus(StatusBooking.selectAppointmentType)
        } else {
          setStatus(StatusBooking.login)
        }
      }
    }
  }, [isSuccessAnimal, dataAnimal])

  useEffect(() => {
    // Only auto-progress if we have BOTH selections and appointment is ready
    if (
      status === StatusBooking.selectAppointmentType &&
      selectedAppointmentType !== null &&
      selectedAnimal !== null &&
      isSuccessAppointment
    ) {
      handleBookAppoinment()
    }
  }, [status, isSuccessAppointment, selectedAppointmentType, selectedAnimal])


  const handleClickBack = () => {
    // Convert numbers to strings for URL params
    const searchParamsForUrl = {
      address: String(searchParams.address || ''),
      animalType: searchParams.animalType ? String(searchParams.animalType) : '',
      serviceType: searchParams.serviceType ? String(searchParams.serviceType) : '',
      animal: searchParams.animal ? String(searchParams.animal) : '',
    }

    switch (status) {
      case StatusBooking.selectAnimal:
        setSelectedAnimal(null);
        navigate({ to: '/search', search: searchParamsForUrl });
        break
      case StatusBooking.selectAppointmentType:
        if(searchParams.animal) { // if animal was in filter selected, go back to search page
          navigate({ to: '/search', search: searchParamsForUrl });
          return;
        }
        setSelectedAppointmentType(null);
        setStatus(StatusBooking.selectAnimal);
        break
      case StatusBooking.createAnimal:
        setShowCreateAnimalDialog(false);
        navigate({ to: '/search', search: searchParamsForUrl });
        break
      case StatusBooking.login:
        navigate({ to: '/search', search: searchParamsForUrl });
        break
      default:
        setSelectedAnimal(null)
        setStatus(StatusBooking.selectAnimal);
    }
  }

  const handleSelectAppointmentType = (appointmentType: ServiceType) => {
    setSelectedAppointmentType(appointmentType)

    const searchParamsForUrl = {
      address: String(searchParams.address || ''),
      animalType: searchParams.animalType ? String(searchParams.animalType) : '',
      serviceType: searchParams.serviceType ? String(searchParams.serviceType) : '',
      animal: searchParams.animal ? String(searchParams.animal) : '',
    }

    // Check for animal in both local state AND navigation state
    const currentAnimal = selectedAnimal || state.selectedAnimal

    if (currentAnimal === null) {
      navigate({
        to: '/booking/$appointmentId',
        params: { appointmentId },
        search: searchParamsForUrl,
        state: {
          selectedService: appointmentType,
          serviceType: serviceType,
          filterAnimalTypeId: animalTypeId,
          searchParams: searchParams,
        },
      })
      return
    }

    // Proceed to confirmation with both animal and service
    navigate({
      to: '/booking/confirmation',
      search: searchParamsForUrl,
      state: {
        appointment: appointment,
        selectedAnimal: currentAnimal,
        selectedService: appointmentType,
        practice: practice,
        searchParams: searchParams,
      },
    })
  }

  const handleBookAppoinment = () => {
    const searchParamsForUrl = {
      address: String(searchParams.address || ''),
      animalType: searchParams.animalType ? String(searchParams.animalType) : '',
      serviceType: searchParams.serviceType ? String(searchParams.serviceType) : '',
      animal: searchParams.animal ? String(searchParams.animal) : '',
    }

    if (selectedAnimal === null || selectedAppointmentType === null) {
      navigate({ to: '/booking/$appointmentId', params: { appointmentId }, search: searchParamsForUrl })
    } else {
      navigate({
        to: '/booking/confirmation',
        search: searchParamsForUrl,
        state: {
          appointment: appointment,
          selectedAnimal: selectedAnimal,
          selectedService: selectedAppointmentType,
          practice: practice,
          searchParams: searchParams,
        },
      })
    }
  }

  const handleChangeAnimal = (newAnimal: AnimalsType | null) => {
    setSelectedAnimal(newAnimal)
  }

  const handleAnimalCreated = () => {
    queryClient.invalidateQueries({ queryKey: ['animals', userId] });
    setShowCreateAnimalDialog(false);
  }

  const handleSelectAnimal = () => {
    if (selectedAnimal === null) {
      return
    }

    const searchParamsForUrl = {
      address: String(searchParams.address || ''),
      animalType: searchParams.animalType ? String(searchParams.animalType) : '',
      serviceType: searchParams.serviceType ? String(searchParams.serviceType) : '',
      animal: searchParams.animal ? String(searchParams.animal) : '',
    }

    navigate({
      to: '/booking/$appointmentId',
      params: { appointmentId },
      search: searchParamsForUrl,
      state: {
        selectedAnimal: selectedAnimal,
        serviceType: serviceType,
        filterAnimalId: selectedAnimal.id,
        filterAnimalTypeId: animalTypeId,
        searchParams: searchParams,
      },
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

  let plural = '';
  if (dataAnimal && dataAnimal.length > 1) {
    plural = 'en';
  }
  const textTiere = dataAnimal?.length === 0 ? 'Du hast noch keine Tiere angelegt. Bitte erstelle ein neues Tier, um fortzufahren.'
    : `Für diesen Termin benötigst du ein Tier der Tierart${plural}: ${allAnimaltypesString}.`;
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
              : `Kein passendes Tier gefunden`}
          </h5>
          <div className="section-description">
            <div>{textTiere}</div>
            {dataAnimal && dataAnimal.length > 0 && <div>
              Bitte erstelle ein neues Tier oder wähle einen anderen Termin.
            </div>}
          </div>
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
          showSuccessNotification={() => setShowSuccessNotification(true)}
        />
      )}

      {showSuccessNotification &&
        <SuccessNotificationToast
          message={"Das Tier wurde erfolgreich angelegt."}
          onClose={() => setShowSuccessNotification(false)} />
      }
    </div>
  )
}
