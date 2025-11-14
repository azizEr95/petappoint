import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { Button, Card, Container } from 'react-bootstrap'
import '../../../../styles/bookingPage.modules.css'
import { useEffect, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { SelectAppointmentType } from '../../../../components/SelectAppointmentType'
import { SelectAnimal } from '../../../../components/SelectAnimal'
import BookingStepper from '../../../../components/BookingStepper'
import { getVeterinaryPracticesById } from '../../../../api/VeterinaryPracticeAPI'
import { getAppointmentsById } from '../../../../api/AppointmentsAPI'
import type {
  AnimalsType,
  AppointmentsType,
  VeterinaryPracticesType,
} from '../../../../../../shared/schemas/ZodSchemas'

export const Route = createFileRoute('/praxen/$praxisId/booking/$terminId')({
  component: BookingComponent,
})

enum StatusBooking {
  selectTerminArt = 'SELECT_TERMIN',
  selectAnimal = 'SELECT_ANIMAL',
  booked = 'BOOKED',
}

function BookingComponent() {
  const navigate = useNavigate()
  const { praxisId, terminId } = Route.useParams()
  const [selectedTerminArt, setSelectedTerminArt] = useState('') // ausgewaehlte Terminart, bei leerem String wurde noch ncihts ausgewaehlt
  const [selectedAnimal, setSelectedAnimal] = useState<AnimalsType | null>(null) // aktuell ausgewaehltes Tier, bei null ist keins ausgewaehlt
  const [status, setStatus] = useState<StatusBooking>(
    StatusBooking.selectTerminArt,
  ) // Status im Terminbuchungsprozess, damit wird gesteuert was gerade angezeigt wird

  // Tierarztpraxen laden:
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

  // Termine laden:
  let termin: AppointmentsType | undefined
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
        setSelectedTerminArt('')
        window.history.back()
        break
      case StatusBooking.selectAnimal:
        setSelectedTerminArt('')
        setStatus(StatusBooking.selectTerminArt)
        break
      default:
        setSelectedTerminArt('')
        setStatus(StatusBooking.selectTerminArt)
    }
  }

  const handleSelectTerminArt = (art: string) => {
    // wird an Select
    setSelectedTerminArt(art)
    setStatus(StatusBooking.selectAnimal)
  }

  const handleBookAppoinment = (termin: AppointmentsType) => {
    // hier Termin erstellen, Anfrage an Backend senden
    // TierID zu Termin hinzufuegen + weitere Infos mitschicken(Terminart??)
    if (selectedAnimal !== null) {
      navigate({ to: '/appointments' })
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
        <SelectAppointmentType handleSelectTerminArt={handleSelectTerminArt} />
      ) /* spater praxis hier uebergeben */
      submitButton = null
      currentStep = 1
      break
    case StatusBooking.selectAnimal:
      aktuelleAnzeige = <SelectAnimal handleChangeAnimal={handleChangeAnimal} />
      submitButton = (
        <Button
          id="bookAppointment"
          variant="success"
          size="lg"
          className="w-100 mt-3"
          onClick={() => handleBookAppoinment(termin)}
          disabled={!selectedAnimal}
        >
          <i className="bi bi-check-circle me-2"></i>
          Terminbuchung bestätigen
        </Button>
      )
      currentStep = 2
      break
    default:
      aktuelleAnzeige = (
        <SelectAppointmentType handleSelectTerminArt={handleSelectTerminArt} />
      ) /* spater praxis hier uebergeben */
      submitButton = null
      currentStep = 1
  }

  return (
    <Container className="my-4">
      <div className="position-relative mb-4">
        <Button
          id="BackButtonBookingPage"
          variant="outline-success"
          onClick={handleClickBack}
          className="mb-3"
        >
          <i className="bi bi-arrow-left me-2"></i>
          Zurück
        </Button>
        <h2 className="text-center fw-bold mb-4">
          <i className="bi bi-calendar-check text-success me-2"></i>
          Termin buchen
        </h2>
      </div>

      <BookingStepper currentStep={currentStep} />

      <div className="row mt-4">
        <div className="col-lg-8 mb-4">
          <Card className="shadow-sm border-0">
            <Card.Body className="p-4">
              {aktuelleAnzeige}
              {submitButton}
            </Card.Body>
          </Card>
        </div>

        <div className="col-lg-4">
          <Card
            className="shadow-sm border-0 sticky-top"
            style={{ top: '80px' }}
          >
            <Card.Header className="bg-success text-white">
              <i className="bi bi-info-circle me-2"></i>
              Terminübersicht
            </Card.Header>
            <Card.Body>
              <h5 className="mb-3">{praxis.name}</h5>
              <div className="mb-2">
                <i className="bi bi-geo-alt text-success me-2"></i>
                <small>
                  {praxis.addresses.street}, {praxis.addresses.citycode}{' '}
                  {praxis.addresses.city}
                </small>
              </div>
              <div className="mb-2">
                <i className="bi bi-clock text-success me-2"></i>
                <small>{dateToInfosString(termin.starttime)}</small>
              </div>
              {selectedTerminArt !== '' && (
                <div className="mb-2">
                  <i className="bi bi-card-list text-success me-2"></i>
                  <small>{selectedTerminArt}</small>
                </div>
              )}
              {selectedAnimal && (
                <div className="mb-2">
                  <i className="bi bi-paw text-success me-2"></i>
                  <small>{selectedAnimal.name}</small>
                </div>
              )}
            </Card.Body>
          </Card>
        </div>
      </div>
    </Container>
  )
}

/**
 * gibt die Uhrzeit des Datum Objekts als schoen formatierten String zurueck
 */
function dateToInfosString(date: Date): string {
  const options: Intl.DateTimeFormatOptions = {
    // Typ ist noetig damit kein Fehler kommt
    weekday: 'long',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }

  const datum = date.toLocaleDateString('de-DE', options)
  const zeit = date.toLocaleTimeString('de-DE', {
    hour: '2-digit',
    minute: '2-digit',
  })
  return datum + ' ' + zeit
}
