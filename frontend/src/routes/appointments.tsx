import { createFileRoute, useLocation, useNavigate } from '@tanstack/react-router'
import { AppointmentList } from '../components/appointment/AppointmentList'
import type { AppointmentsType } from '../../../shared/schemas/ZodSchemas'
import { useQuery } from '@tanstack/react-query';
import { getFutureAppointmentsByUserId, getPastAppointmentsByUserId } from '../api/AppointmentsAPI';
import { useEffect, useState, useMemo } from 'react';
import { AppointmentDetails } from '../components/appointment/AppointmentDetails';
import '../styles/routes/appointments.scss';

export const Route = createFileRoute('/appointments')({
    component: Appointments,
})

function Appointments() {
    const location = useLocation();
    const navigate = useNavigate();
    const bookedAppointment = location.state?.appointment;
    const [activeTab, setActiveTab] = useState<'upcoming' | 'past'>('upcoming');
    const [selectedAppointment, setSelectedAppointment] = useState<AppointmentsType | undefined>();

    const userID = 6; // TODO: get from auth context

    const { isError: isErrorFuture, isSuccess: isSuccessFuture, data: dataFuture } = useQuery<Array<AppointmentsType>>({
        queryKey: ['appointmentsFuture', userID],
        queryFn: () => getFutureAppointmentsByUserId(userID.toString()),
    })

    const { isError: isErrorPast, isSuccess: isSuccessPast, data: dataPast } = useQuery<Array<AppointmentsType>>({
        queryKey: ['appointmentsPast', userID],
        queryFn: () => getPastAppointmentsByUserId(userID.toString()),
    })

    useEffect(() => {
        if (bookedAppointment !== undefined) {
            setSelectedAppointment(bookedAppointment);
            setActiveTab('upcoming');
        }
        navigate({ state: { appointment: undefined } });
    }, []);

    // Create sorted copies (don't mutate original arrays)
    const sortedFuture = useMemo(() =>
        dataFuture ? [...dataFuture].sort((a, b) => a.starttime.getTime() - b.starttime.getTime()) : [],
        [dataFuture]
    );
    const sortedPast = useMemo(() =>
        dataPast ? [...dataPast].sort((a, b) => b.starttime.getTime() - a.starttime.getTime()) : [],
        [dataPast]
    );

    useEffect(() => {
        // Only auto-select if no appointment was booked and none is currently selected
        if (isSuccessFuture && sortedFuture.length > 0 && !selectedAppointment && !bookedAppointment && activeTab === "upcoming" ) {
            setSelectedAppointment(sortedFuture[0]);
        }
    }, [isSuccessFuture, sortedFuture, selectedAppointment, bookedAppointment]);

    useEffect(() => {
        // If selected appointment no longer exists in current list, select next one
        if (selectedAppointment) {
            const currentList = activeTab === 'upcoming' ? sortedFuture : sortedPast;
            const stillExists = currentList?.some(apt => apt.id === selectedAppointment.id);

            if (!stillExists && currentList && currentList.length > 0) {
                setSelectedAppointment(currentList[0]);
            } else if (!stillExists) {
                setSelectedAppointment(undefined);
            }
        }
    }, [activeTab, sortedFuture, sortedPast, selectedAppointment]);

    const handleShowDetailsAppointment = (appointment: AppointmentsType) => {
        setSelectedAppointment(appointment);
    };

    const handleAppointmentCancelled = () => {
        // useEffect will handle selecting next appointment after query invalidation
    };

    const currentData = activeTab === 'upcoming' ? sortedFuture : sortedPast;
    const isCurrentError = activeTab === 'upcoming' ? isErrorFuture : isErrorPast;
    const isCurrentSuccess = activeTab === 'upcoming' ? isSuccessFuture : isSuccessPast;

    return (
        <div className='appointments-page'>
            <div className="appointments-header">
                <h1>Meine Termine</h1>
            </div>

            <div className="appointments-tabs">
                <button
                    className={`tab-button ${activeTab === 'upcoming' ? 'active' : ''}`}
                    onClick={() => setActiveTab('upcoming')}
                >
                    Bevorstehend
                    {isSuccessFuture && dataFuture && dataFuture.length > 0 && ` (${dataFuture.length})`}
                </button>
                <button
                    className={`tab-button ${activeTab === 'past' ? 'active' : ''}`}
                    onClick={() => setActiveTab('past')}
                >
                    Vergangen
                    {isSuccessPast && dataPast && dataPast.length > 0 && ` (${dataPast.length})`}
                </button>
            </div>

            <div className='appointments-layout'>
                <div className="appointments-list-section">
                    {isCurrentError && (
                        <div className="empty-state">
                            <i className="bi bi-exclamation-triangle"></i>
                            <p>Termine konnten nicht geladen werden</p>
                        </div>
                    )}
                    {isCurrentSuccess && currentData && (
                        <AppointmentList
                            dataAppointments={currentData}
                            handleShowDetailsAppointment={handleShowDetailsAppointment}
                            selectedAppointment={selectedAppointment}
                            isPast={activeTab === 'past'}
                        />
                    )}
                </div>

                {selectedAppointment && (
                    <AppointmentDetails
                        appointment={selectedAppointment}
                        onAppointmentCancelled={handleAppointmentCancelled}
                    />
                )}
            </div>
        </div>
    )
}
