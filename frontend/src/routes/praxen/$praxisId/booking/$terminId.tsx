import { createFileRoute, useNavigate } from '@tanstack/react-router'
import '../../../../styles/routes/bookingPage.scss'
import { useEffect, useState } from 'react'
import { useMutation, useQuery } from '@tanstack/react-query'
import { SelectAppointmentType } from '../../../../components/booking/SelectAppointmentType'
import { SelectAnimal } from '../../../../components/booking/SelectAnimal'
import BookingStepper from '../../../../components/booking/BookingStepper'
import { getVeterinaryPracticesById } from '../../../../api/VeterinaryPracticeAPI'
import {
  bookAppointment,
  getAppointmentsById,
} from '../../../../api/AppointmentsAPI'
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
  const navigate = useNavigate()
  const { praxisId, terminId } = Route.useParams()
  const [selectedAppointmentType, setSelectedAppointmentType] =
    useState<ServiceType | null>(null)
  const [selectedAnimal, setSelectedAnimal] = useState<AnimalsType | null>(null) // aktuell ausgewaehltes Tier, bei null ist keins ausgewaehlt
  const [status, setStatus] = useState<StatusBooking>(
    StatusBooking.selectTerminArt,
  ) // State in the booking prozess, controls what is displayed

  // load VeterinaryPractice:
  let praxis: VeterinaryPracticesType | undefined
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
  let termin: AppointmentsType
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

  type AppoinmentBookingPayload = {
    appointmentID: number
    animalID: number
    serviceID: number | null
  }

  // edit appoinment, set animalID and serviceID
  const { mutate: mutateAppointment } = useMutation({
    mutationFn: ({
      appointmentID,
      animalID,
      serviceID,
    }: AppoinmentBookingPayload) =>
      bookAppointment(appointmentID, animalID, serviceID),
    onError: () => {
      // appoinment is not available anymore
      navigate({ to: '/praxen/' + praxisId })
    },
    onSuccess: () => {
      // appointment was successful booked
      navigate({ to: '/appointments', state: { appointment: termin } })
    },
  })

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
      const serviceID = selectedAppointmentType.id

      mutateAppointment({
        appointmentID: termin.id,
        animalID: selectedAnimal?.id,
        serviceID: serviceID,
      })
    }
  }

  const handleChangeAnimal = (animal: AnimalsType | null) => {
    setSelectedAnimal(animal)
  }

  if (!isSuccessAppointment || !isSuccessPractice) {
    return <></>
  }

  termin = dataAppointment
  praxis = dataPractice
  let aktuelleAnzeige
  let submitButton
  let currentStep: 1 | 2 | 3 = 1

  switch (status) {
    case StatusBooking.selectTerminArt:
      aktuelleAnzeige = (
        <SelectAppointmentType
          praxis={praxis}
          handleSelectTerminArt={handleSelectTerminArt}
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
            <i className="bi bi-check-circle"></i>
            Terminbuchung bestätigen
          </button>
        </div>
      )
      currentStep = 2
      break
    default:
      aktuelleAnzeige = (
        <SelectAppointmentType
          praxis={praxis}
          handleSelectTerminArt={handleSelectTerminArt}
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
          {aktuelleAnzeige}
          {submitButton}
        </div>

        <div className="booking-sidebar">
          <div className="sidebar-section-title">Buchungsübersicht</div>

          <div className="info-item">
            <i className="bi bi-hospital"></i>
            <div className="info-content">
              <div className="info-label">Praxis</div>
              <div className="info-value">{praxis.name}</div>
            </div>
          </div>

          <div className="info-item">
            <i className="bi bi-geo-alt"></i>
            <div className="info-content">
              <div className="info-label">Adresse</div>
              <div className="info-value">
                {praxis.addresses.street}, {praxis.addresses.citycode}{' '}
                {praxis.addresses.city}
              </div>
            </div>
          </div>

          <div className="info-item">
            <i className="bi bi-clock"></i>
            <div className="info-content">
              <div className="info-label">Termin</div>
              <div className="info-value">
                {dateToInfosString(termin.starttime)}
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
