import { Card } from "react-bootstrap"
import type { AppointmentsType, ServiceType, VeterinaryPracticesType } from "../../../../shared/schemas/ZodSchemas"
import { dateToInfosString } from "../../utils/DateToStringFormat"
import { useQuery } from "@tanstack/react-query"
import { getVeterinaryPracticesById } from "../../api/VeterinaryPracticeAPI"

type AppointmentCardProps = {
    appointment: AppointmentsType,
    handleShowDetailsAppointment: (appointment: AppointmentsType) => void
}

export function AppointmentCard({ appointment, handleShowDetailsAppointment}: AppointmentCardProps) {
    const practiceID = appointment.fk_veterinarypracticeid;

    // load VeterinaryPractice, remove if it is in appointmentsType Issue #96
    const { isError, isSuccess, data } = useQuery<VeterinaryPracticesType>({
        queryKey: ['veterinaryPractice', practiceID],
        queryFn: () => getVeterinaryPracticesById(practiceID.toString()),
    });

    // can not find the practice to the appointment
    if(isError){
        return <Card style={{ width: '18rem' }}>
            <Card.Body>
                <Card.Title>{dateToInfosString(appointment.starttime)}</Card.Title>
                <Card.Text>
                    <div>Praxis unbekannt</div>
                </Card.Text>
            </Card.Body>
        </Card>;
    }

    if (isSuccess) {
        const practice: VeterinaryPracticesType = data;
        let appointmentType: ServiceType | undefined
        if (practice.services !== null && practice.services !== undefined) {
            appointmentType = practice.services.find((x) => {
                if (x.id === appointment.fk_serviceid) {
                    return x;
                }
            });
        }

        return <Card style={{ width: '18rem' }} onClick={() => handleShowDetailsAppointment(appointment)}>
            <Card.Body>
                <Card.Title>{dateToInfosString(appointment.starttime)}</Card.Title>
                <Card.Text>{practice.name}</Card.Text>
                <Card.Text>{appointmentType?.name}</Card.Text>
                <Card.Text>Tier: TODO feature folgt {appointment.fk_animalid}</Card.Text>
            </Card.Body>
        </Card>;
    }
}