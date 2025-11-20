import type { AppointmentsType } from "../../../../shared/schemas/ZodSchemas"
import { AppointmentCard } from "./AppointmentCard"

type AppointmentListProps = {
    dataAppointments: AppointmentsType[],
    handleShowDetailsAppointment: (appointment: AppointmentsType) => void,
    selectedAppointment?: AppointmentsType,
    isPast: boolean
}

export function AppointmentList({ dataAppointments, handleShowDetailsAppointment, selectedAppointment, isPast }: AppointmentListProps) {

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
            </div>
        )
    }
}
