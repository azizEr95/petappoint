import type {
  AppointmentsType,
  ServiceType,
  VeterinaryPracticesType,
} from '../../../../shared/schemas/ZodSchemas'
import { useQuery } from '@tanstack/react-query'
import { getVeterinaryPracticesById } from '../../api/VeterinaryPracticeAPI'

type AppointmentCardProps = {
  appointment: AppointmentsType
  handleShowDetailsAppointment: (appointment: AppointmentsType) => void
  isActive: boolean
  isPast: boolean
}

export function AppointmentCard({
  appointment,
  handleShowDetailsAppointment,
  isActive,
  isPast,
}: AppointmentCardProps) {
  const practiceID = appointment.veterinaryPractice.id

  const { isError, isSuccess, data } = useQuery<VeterinaryPracticesType>({
    queryKey: ['veterinaryPractice', practiceID],
    queryFn: () => getVeterinaryPracticesById(practiceID.toString()),
  })

  if (isError) {
    return (
      <div
        className={`appointment-card ${isActive ? 'active' : ''}`}
        onClick={() => handleShowDetailsAppointment(appointment)}
      >
        <div className="card-header">
          <div className="date-time">
            <div className="date">Termin</div>
            <div className="time">Praxis nicht gefunden</div>
          </div>
        </div>
      </div>
    )
  }

  if (isSuccess) {
    const practice: VeterinaryPracticesType = data
    let appointmentType: ServiceType | undefined

    if (
      appointment.availableServices !== null &&
      appointment.availableServices !== undefined
    ) {
      appointmentType = appointment.availableServices.find(
        (x) => x.id === appointment.service?.id,
      )
    }

    const formatDate = (date: Date) => {
      return date.toLocaleDateString('de-DE', {
        weekday: 'short',
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      })
    }

    const formatTime = (date: Date) => {
      return date.toLocaleTimeString('de-DE', {
        hour: '2-digit',
        minute: '2-digit',
      })
    }

    return (
      <div
        className={`appointment-card ${isActive ? 'active' : ''} ${isPast ? 'past' : 'upcoming'}`}
        onClick={() => handleShowDetailsAppointment(appointment)}
      >
        <div className="card-header">
          <div className="date-time">
            <div className="date">{formatDate(appointment.startTime)}</div>
            <div className="time">
              {formatTime(appointment.startTime)} -{' '}
              {formatTime(appointment.endTime)}
            </div>
          </div>
          <div className={`status-badge ${isPast ? 'past' : 'upcoming'}`}>
            {isPast ? 'Vergangen' : 'Bevorstehend'}
          </div>
        </div>
        <div className="card-body">
          <div className="practice-name">{practice.name}</div>
          {appointmentType && (
            <div className="service-type">{appointmentType.name}</div>
          )}
          <div className="animal-info">
            <i className="bi bi-heart"></i>
            <span>{appointment.animal?.name || 'Nicht zugewiesen'}</span>
          </div>
        </div>
      </div>
    )
  }

  return null
}
