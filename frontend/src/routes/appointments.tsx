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
    const justBooked = location.state?.justBooked;
    const [activeTab, setActiveTab] = useState<'upcoming' | 'past'>('upcoming');
    const [selectedAppointment, setSelectedAppointment] = useState<AppointmentsType | undefined>(bookedAppointment);
    const [showSuccessNotification, setShowSuccessNotification] = useState(false);
    const [hasJustBooked, setHasJustBooked] = useState(justBooked === true);

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
        let timer: NodeJS.Timeout | undefined;

        if (justBooked) {
            setActiveTab('upcoming');
            setShowSuccessNotification(true);
            // Auto-dismiss after 5 seconds
            timer = setTimeout(() => {
                setShowSuccessNotification(false);
            }, 5000);
        }

        // Clear state to prevent re-triggering on navigation
        navigate({ state: {} }, { replace: true });

        return () => {
            if (timer) clearTimeout(timer);
        };
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
        // Only auto-select if no appointment is currently selected AND user hasn't just booked
        if (isSuccessFuture && sortedFuture.length > 0 && !selectedAppointment && !hasJustBooked && activeTab === "upcoming" ) {
            setSelectedAppointment(sortedFuture[0]);
        }
    }, [isSuccessFuture, sortedFuture, selectedAppointment, hasJustBooked, activeTab]);

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

                <div className="appointments-details-column">
                    {showSuccessNotification && (
                        <div className="booking-success-notification">
                            <div className="notification-icon">
                                <i className="bi bi-check-circle-fill"></i>
                            </div>
                            <div className="notification-content">
                                <h3>Termin erfolgreich gebucht!</h3>
                                <p>Ihr Termin wurde bestätigt und erscheint nun in Ihrer Übersicht.</p>
                            </div>
                            <button
                                className="notification-close"
                                onClick={() => setShowSuccessNotification(false)}
                            >
                                <i className="bi bi-x"></i>
                            </button>
                        </div>
                    )}
                    {selectedAppointment && (
                        <AppointmentDetails
                            appointment={selectedAppointment}
                            onAppointmentCancelled={handleAppointmentCancelled}
                        />
                    )}
                </div>
            </div>
        </div>
    )
}
