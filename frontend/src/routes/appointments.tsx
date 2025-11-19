import { createFileRoute, useLocation, useNavigate } from '@tanstack/react-router'
import { AppointmentList } from '../components/appointment/AppointmentList'
import type { AppointmentsType } from '../../../shared/schemas/ZodSchemas'
import { useQuery } from '@tanstack/react-query';
import { getFutureAppointmentsByUserId, getPastAppointmentsByUserId } from '../api/AppointmentsAPI';
import { Button } from 'react-bootstrap';
import { useEffect, useState } from 'react';
import { AppointmentDetails } from '../components/appointment/AppointmentDetails';

export const Route = createFileRoute('/appointments')({
    component: Appoinments,
})

function Appoinments() {
    const location = useLocation();
    const navigate = useNavigate();
    let bookedAppointment = location.state.appointment;
    const [showPastAppointments, setShowPastAppointments] = useState(false);
    const [showDetailsAppointment, setShowDetailsAppointment] = useState<AppointmentsType>(); //if no value is set, showDetailsAppointments undefined

    useEffect(() => {
        if (bookedAppointment !== undefined) {
            handleShowDetailsAppointment(bookedAppointment);
        }
        navigate({state: {appointment: undefined}});
    }, []);

    const userID = 6; //only for testing, later the userID from the user, who is logged in

    // all appointments in the future
    const { isError: isErrorFuture, isSuccess: isSuccessFuture, data: dataFuture } = useQuery<Array<AppointmentsType>>({
        queryKey: ['appointmentsFuture', userID],
        queryFn: () => getFutureAppointmentsByUserId(userID.toString()),
    })

    // all appointments in the past
    const { isError: isErrorPast, isSuccess: isSuccessPast, data: dataPast } = useQuery<Array<AppointmentsType>>({
        queryKey: ['appointmentsPast', userID],
        queryFn: () => getPastAppointmentsByUserId(userID.toString()),
    })

    const handleShowDetailsAppointment = (appointment: AppointmentsType) => {
        setShowDetailsAppointment(appointment);
    }

    if (isErrorPast) { // if is error, dont show past appointments
        setShowPastAppointments(false);
    }

    if (isSuccessFuture && isSuccessPast) {
        dataFuture.sort((zeitA, zeitB) => {
            // sort the appointments, next appointment first
            return zeitA.starttime.getTime() - zeitB.starttime.getTime();
        });
        dataPast.sort((zeitA, zeitB) => {
            // sort the appointments, first appointment in the past first
            return zeitB.starttime.getTime() - zeitA.starttime.getTime();
        });

        if (showDetailsAppointment === undefined && dataFuture.length > 0) {
            setShowDetailsAppointment(dataFuture[0]);
        }

        return (<div className='flex-row'>
            <div>
                <div>Meine nächsten Termine</div>
                {isErrorFuture && <div>konnte keine Termine laden</div>}
                {!isErrorFuture && <AppointmentList dataAppointments={dataFuture} handleShowDetailsAppointment={handleShowDetailsAppointment} />}
                {!showPastAppointments && <Button variant="primary" onClick={() => setShowPastAppointments(true)}>Meine vergangene Termine</Button>}
                {showPastAppointments && <>
                    <div>Meine vergangenen Termine</div>
                    <AppointmentList dataAppointments={dataPast} handleShowDetailsAppointment={handleShowDetailsAppointment} />
                </>
                }
            </div>
            {showDetailsAppointment !== undefined && <AppointmentDetails appointment={showDetailsAppointment}></AppointmentDetails>}
        </div>
        )
    }
}
