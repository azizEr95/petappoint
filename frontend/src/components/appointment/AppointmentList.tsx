import type { AppointmentsType } from "../../../../shared/schemas/ZodSchemas"
import { AppointmentCard } from "./AppointmentCard"

type AppointmentListProps = {
    dataAppointments: AppointmentsType[],
    handleShowDetailsAppointment: (appointment: AppointmentsType) => void
}

export function AppointmentList({ dataAppointments, handleShowDetailsAppointment }: AppointmentListProps) {

    if (dataAppointments.length !== 0) {
        return (
            <div id="VeterinaryPracticeList">
                {dataAppointments.map((appointment) => {
                    return <AppointmentCard key={appointment.id} appointment={appointment} handleShowDetailsAppointment={handleShowDetailsAppointment} /> //onClick definieren!!
                })}
            </div>
        )
    } else {
        return <div>keine anstehenden/vergangenen Termine</div>
    }
}

