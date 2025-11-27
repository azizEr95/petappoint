import type { AppointmentsType } from "../../../../shared/schemas/ZodSchemas"
import { AppointmentCard } from "./AppointmentCard"
import { useNavigate } from "@tanstack/react-router"

type AppointmentListProps = {
    dataAppointments: AppointmentsType[],
    handleShowDetailsAppointment: (appointment: AppointmentsType) => void,
    selectedAppointment?: AppointmentsType,
    isPast: boolean
}

export function AppointmentList({ dataAppointments, handleShowDetailsAppointment, selectedAppointment, isPast }: AppointmentListProps) {
    const navigate = useNavigate();

    if (dataAppointments.length !== 0) {
        return (
            <div className="appointments-list">
                {dataAppointments.map((appointment) => {
                    return (
                        <AppointmentCard
                            key={appointment.id}
                            appointment={appointment}
                            handleShowDetailsAppointment={handleShowDetailsAppointment}
                            isActive={selectedAppointment?.id === appointment.id}
                            isPast={isPast}
                        />
                    )
                })}
            </div>
        )
    } else {
        return (
            <div className="empty-state">
                <i className="bi bi-calendar-x"></i>
                <p>{isPast ? 'Keine vergangenen Termine' : 'Keine anstehenden Termine'}</p>
                <p className="empty-state-hint">
                    {isPast
                        ? 'Buchen Sie Ihren ersten Termin bei einer Tierarztpraxis.'
                        : 'Buchen Sie jetzt einen Termin bei einer Tierarztpraxis in Ihrer Nähe.'}
                </p>
                <button
                    className="btn btn-secondary"
                    onClick={() => navigate({ to: '/search' })}
                >
                    <i className="bi bi-calendar-plus"></i>
                    Termin buchen
                </button>
            </div>
        )
    }
}
