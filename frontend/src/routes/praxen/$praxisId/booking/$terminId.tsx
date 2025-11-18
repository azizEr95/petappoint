import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { Button, Card, Container } from 'react-bootstrap'
import '../../../../styles/bookingPage.modules.css'
import { useEffect, useState } from 'react'
import { useMutation, useQuery } from '@tanstack/react-query'
import { SelectAppointmentType } from '../../../../components/SelectAppointmentType'
import { SelectAnimal } from '../../../../components/SelectAnimal'
import BookingStepper from '../../../../components/BookingStepper'
import { getVeterinaryPracticesById } from '../../../../api/VeterinaryPracticeAPI'
import { bookAppointment, getAppointmentsById } from '../../../../api/AppointmentsAPI'
import type {
    AnimalsType,
    AppointmentsType,
    ServiceType,
    VeterinaryPracticesType,
} from '../../../../../../shared/schemas/ZodSchemas'

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
    const [selectedAppointmentType, setSelectedAppointmentType] = useState<ServiceType | null>(null);
    const [selectedAnimal, setSelectedAnimal] = useState<AnimalsType | null>(null) // aktuell ausgewaehltes Tier, bei null ist keins ausgewaehlt
    const [status, setStatus] = useState<StatusBooking>(
        StatusBooking.selectTerminArt,
    ) // State in the booking prozess, controls what is displayed

    // load VeterinaryPractice:
    let praxis: VeterinaryPracticesType | undefined
    const { isError: isErrorPractice, isSuccess: isSuccessPractice, isPending: isPendingPractice, data: dataPractice } = useQuery<VeterinaryPracticesType>({
        queryKey: ['tierarztpraxen', praxisId],
        queryFn: () => getVeterinaryPracticesById(praxisId),
        retry: false,
    })

    // load Appointment:
    let termin: AppointmentsType
    const { isError: isErrorAppointment, isSuccess: isSuccessAppointment, isPending: isPendingAppointment, data: dataAppointment } = useQuery<AppointmentsType>({
        queryKey: ['appointment', terminId],
        queryFn: () => getAppointmentsById(terminId),
        retry: false,
    })

    type AppoinmentBookingPayload = {
        appointmentID: number,
        animalID: number,
        serviceID: number | null
    }

    //edit appoinment, set animalID and serviceID
    const { mutate: mutateAppointment } = useMutation({
        mutationFn: ({ appointmentID, animalID, serviceID }: AppoinmentBookingPayload) => bookAppointment(appointmentID, animalID, serviceID),
        onError: () => { //appoinment is not available anymore
            navigate({ to: "/praxen/" + praxisId });
        },
        onSuccess: () => { //appointment was successful booked
            navigate({ to: "/appointments" });
        },
    });

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
        if (selectedAnimal === undefined || selectedAnimal === null || selectedAppointmentType === undefined || selectedAppointmentType === null) {
            //no animal or appointmentType was selected, booking is not possible
            navigate({ to: "/praxen/" + praxisId + "/booking/" + terminId })

        } else {
            const serviceID = selectedAppointmentType.id;

            mutateAppointment({ appointmentID: termin.id, animalID: selectedAnimal?.id, serviceID: serviceID });
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
                <SelectAppointmentType praxis={praxis} handleSelectTerminArt={handleSelectTerminArt} />
            )
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
                    onClick={handleBookAppoinment}
                    disabled={!selectedAnimal}
                >
                    <i className="bi bi-check-circle me-2"></i>
                    Terminbuchung bestätigen
                </Button>
            )
            currentStep = 2
            break
        default:
            aktuelleAnzeige = <SelectAppointmentType praxis={praxis} handleSelectTerminArt={handleSelectTerminArt} />

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
                            {selectedAppointmentType !== null && (
                                <div className="mb-2">
                                    <i className="bi bi-card-list text-success me-2"></i>
                                    <small>{selectedAppointmentType.name}</small>
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
 * returns the time as formated string
 */
function dateToInfosString(date: Date): string {
    const options: Intl.DateTimeFormatOptions = {
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
