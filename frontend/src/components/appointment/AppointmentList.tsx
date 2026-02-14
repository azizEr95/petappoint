import { AppointmentCard } from './AppointmentCard'
import type { AppointmentsType } from 'petappoint-shared/schemas/ZodSchemas'

type AppointmentListProps = {
  dataAppointments: Array<AppointmentsType>
  handleShowDetailsAppointment: (appointment: AppointmentsType) => void
  selectedAppointment?: AppointmentsType
  isPast: boolean
}

export function AppointmentList({
  dataAppointments,
  handleShowDetailsAppointment,
  selectedAppointment,
  isPast,
}: AppointmentListProps) {

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
              compact={true}
            />
          )
        })}
      </div>
    )
  } else {
    return (
      <div className="empty-state">
        <i className="bi bi-calendar-x"></i>
        <p>
          {isPast ? 'Keine vergangenen Termine' : 'Keine anstehenden Termine'}
        </p>
        <p className="empty-state-hint">
          {isPast
            ? 'Buchen Sie Ihren ersten Termin bei einer Tierarztpraxis.'
            : 'Buchen Sie jetzt einen Termin bei einer Tierarztpraxis in Ihrer Nähe.'}
        </p>
      </div>
    )
  }
}
