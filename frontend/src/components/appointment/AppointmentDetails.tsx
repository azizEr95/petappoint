import { Button, Card } from "react-bootstrap";
import type { AppointmentsType, ServiceType, VeterinaryPracticesType } from "../../../../shared/schemas/ZodSchemas"
import { dateToInfosString } from "../../utils/DateToStringFormat";
import { useQuery } from "@tanstack/react-query";
import { getVeterinaryPracticesById } from "../../api/VeterinaryPracticeAPI";
import { useEffect, useState } from "react";

type AppointmentDetailsProps = {
    appointment: AppointmentsType
}

export function AppointmentDetails({ appointment }: AppointmentDetailsProps) {
    const [futureAppointment, setFutureAppointment] = useState(true);

    // load VeterinaryPractice, remove if it is in appointmentsType #96
    const practiceID = appointment.fk_veterinarypracticeid;
    const { isSuccess, data } = useQuery<VeterinaryPracticesType>({
        queryKey: ['veterinaryPractice', practiceID],
        queryFn: () => getVeterinaryPracticesById(practiceID.toString()),
        retry: false,
    });

    useEffect(() => {
        if (appointment.endtime < new Date()) {
            setFutureAppointment(false);
        } else {
            setFutureAppointment(true);
        }
    }, [appointment]);

    if (isSuccess) {
        const practice = data;
        let appointmentType: ServiceType | undefined;
        if (practice.services !== null && practice.services !== undefined) { // can be removed if the types in ZodSchemas are changed
            appointmentType = practice.services.find((x) => {
                if (x.id === appointment.fk_serviceid) {
                    return x;
                }
            });
        }

        return <Card style={{ width: '30rem' }}>
            <Card.Body style={{ position: "fixed" }}>
                <Card.Title>{dateToInfosString(appointment.starttime)}</Card.Title>
                <Card.Text>{practice.name}</Card.Text>
                <Card.Text>{appointmentType?.name}</Card.Text>
                {futureAppointment &&
                    <Card.Text>
                        <Button>Verschieben</Button>
                        <Button>Termin absagen</Button>
                    </Card.Text>
                }
                <Card.Text>Tier: TODO feature folgt  ID: {appointment.fk_animalid}</Card.Text>
                <Card.Text>{practice.addresses.street}</Card.Text>
                <Card.Text>{practice.addresses.citycode} {practice.addresses.city}</Card.Text>
            </Card.Body>
        </Card>;
    }
}