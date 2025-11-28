import { createFileRoute, useLocation, useNavigate } from '@tanstack/react-router'
import '../../../../styles/routes/bookingPage.scss'
import { useEffect, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { SelectAppointmentType } from '../../../../components/booking/SelectAppointmentType'
import { SelectAnimal } from '../../../../components/booking/SelectAnimal'
import BookingStepper from '../../../../components/booking/BookingStepper'
import { getVeterinaryPracticesById } from '../../../../api/VeterinaryPracticeAPI'
import { getAppointmentsById } from '../../../../api/AppointmentsAPI'
import { getServicesFromPractice } from '../../../../api/ServicesAPI'
import type {
  AnimalsType,
  AppointmentsType,
  ServiceType,
  VeterinaryPracticesType,
} from '../../../../../../shared/schemas/ZodSchemas'
import { dateToInfosString } from '../../../../utils/DateToStringFormat'

export const Route = createFileRoute('/praxen/$praxisId/booking/$terminId')({
  component: BookingComponent,
})

enum StatusBooking {
  selectTerminArt = 'SELECT_APPOINTMENT_TYPE',
  selectAnimal = 'SELECT_ANIMAL',
  booked = 'BOOKED',
}

function BookingComponent() {
  const navigate = useNavigate();
  const location = useLocation();
  const serviceType = location.state?.serviceType;
  const { praxisId, terminId } = Route.useParams()
  const [selectedAppointmentType, setSelectedAppointmentType] =
    useState<ServiceType | null>(null)
  const [selectedAnimal, setSelectedAnimal] = useState<AnimalsType | null>(null) // aktuell ausgewaehltes Tier, bei null ist keins ausgewaehlt
  const [status, setStatus] = useState<StatusBooking>(
    StatusBooking.selectTerminArt,
  ) // State in the booking prozess, controls what is displayed
  const [filteredServices, setFilteredServices] = useState<ServiceType[] | null>(null); // if an filter was selected save which services have to been shown

  // load VeterinaryPractice:
  const {
    isError: isErrorPractice,
    isSuccess: isSuccessPractice,
    isPending: isPendingPractice,
    data: dataPractice,
  } = useQuery<VeterinaryPracticesType>({
    queryKey: ['tierarztpraxen', praxisId],
    queryFn: () => getVeterinaryPracticesById(praxisId),
    retry: false,
  })

  // load Appointment:
  const {
    isError: isErrorAppointment,
    isSuccess: isSuccessAppointment,
    isPending: isPendingAppointment,
    data: dataAppointment,
  } = useQuery<AppointmentsType>({
    queryKey: ['appointment', terminId],
    queryFn: () => getAppointmentsById(terminId),
    retry: false,
  })

  useEffect(() => {
    if(serviceType !== null && serviceType !== undefined && isSuccessPractice){
      const foundService = dataAppointment?.availableservices.filter((avaService) => {
        const x = serviceType.find((selServ) => {
          return avaService.id === selServ
        })
        return x !== undefined;
      }
      )
      if(foundService !== undefined){
        setFilteredServices(foundService)
        if(foundService.length === 1 && serviceType.length === 1){ // if only one ServiceType was selected, skip SelectAppointmentType component
            setFilteredServices(null);
            setSelectedAppointmentType(foundService[0]);
            setStatus(StatusBooking.selectAnimal);
        }
      } else {
        setFilteredServices(null);
      }
      
    }
  }, [serviceType, isSuccessAppointment, dataAppointment]);

  useEffect(() => {
    if(filteredServices !== null && serviceType !== null && serviceType !== undefined ){
      
    }
  }, [filteredServices, serviceType])

  useEffect(() => {
    if (isPendingPractice || isPendingAppointment) {
      return
    }

    if (
      isErrorPractice ||
      !isSuccessPractice ||
      isErrorAppointment ||
      !isSuccessAppointment
    ) {
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

  const handleClickBack = () => {
    // einmal auf der seite zurueck
    switch (status) {
      case StatusBooking.selectTerminArt:
        setSelectedAppointmentType(null)
        window.history.back()
        break
      case StatusBooking.selectAnimal:
        setSelectedAppointmentType(null)
        setStatus(StatusBooking.selectTerminArt)
        break
      default:
        setSelectedAppointmentType(null)
        setStatus(StatusBooking.selectTerminArt)
    }
  }

  const handleSelectTerminArt = (appointmenType: ServiceType) => {
    setSelectedAppointmentType(appointmenType)
    setStatus(StatusBooking.selectAnimal)
  }

  const handleBookAppoinment = () => {
    if (
      selectedAnimal === undefined ||
      selectedAnimal === null ||
      selectedAppointmentType === undefined ||
      selectedAppointmentType === null
    ) {
      // no animal or appointmentType was selected, booking is not possible
      navigate({ to: '/praxen/' + praxisId + '/booking/' + terminId })
    } else {
      // Navigate to confirmation page with all booking data
      navigate({
        to: '/booking/confirmation',
        state: {
          appointment: appointment,
          selectedAnimal: selectedAnimal,
          selectedService: selectedAppointmentType,
          practice: practice
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
  
  let appointment: AppointmentsType = dataAppointment
  let practice: VeterinaryPracticesType | undefined = dataPractice
  let aktuelleAnzeige
  let submitButton
  let currentStep: 1 | 2 | 3 = 1
  
  switch (status) {
    case StatusBooking.selectTerminArt:

      aktuelleAnzeige = (
        <SelectAppointmentType
        practice={practice}
          appointment={appointment}
          handleSelectTerminArt={handleSelectTerminArt}
          filterServices={filteredServices}
        />
      )
      submitButton = null
      currentStep = 1
      break
    case StatusBooking.selectAnimal:
      aktuelleAnzeige = <SelectAnimal handleChangeAnimal={handleChangeAnimal} />
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
      console.log("stop")
      aktuelleAnzeige = (
        <SelectAppointmentType
        practice={practice}
          appointment={appointment}
          handleSelectTerminArt={handleSelectTerminArt}
          filterServices={null} />
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
          {aktuelleAnzeige}
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
