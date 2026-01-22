import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
import { getPictureURLForPracticeId, getVeterinaryPracticesById } from '../../api/VeterinaryPracticeAPI'
import { getPictureURLForAnimalId } from '../../api/AnimalsAPI'
import { exportToCalendar } from '../../utils/calendarExport'
import { AppointmentDeleteDialog } from './AppointmentDeleteDialog'
import type {
  AppointmentsType,
  ServiceType,
  VeterinaryPracticesType,
} from 'vetilib-shared/schemas/ZodSchemas'
import { useLoginContext } from '@/LoginContext'

type AppointmentCardProps = {
  appointment: AppointmentsType
  handleShowDetailsAppointment: (appointment: AppointmentsType) => void
  isActive?: boolean
  isPast: boolean
  compact?: boolean
  onShowCancelSuccess?: () => void
}

export function AppointmentCard({
  appointment,
  handleShowDetailsAppointment,
  isActive,
  isPast,
  compact = false,
  onShowCancelSuccess // this function is important if it is possible here to cancel an appointment
}: AppointmentCardProps) {

  const { login } = useLoginContext();
  const loginRole = login ? login.role : null

  const practiceID = appointment.veterinaryPractice.id
  const navigate = useNavigate()
  const [showCancelDialog, setShowCancelDialog] = useState(false)


  const { isError, isSuccess, data } = useQuery<VeterinaryPracticesType>({
    queryKey: ['veterinaryPractice', practiceID],
    queryFn: () => getVeterinaryPracticesById(practiceID.toString()),
  })

  if (isError) {
    return (
      <div
        className={`appointment-card ${isActive ?? false ? 'active' : ''}`}
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
    const appointmentType: ServiceType | undefined = appointment.availableServices.find((x) => x.id === appointment.service?.id)

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

    const handleExportCalendar = (e: React.MouseEvent) => {
      e.stopPropagation()
      const appointmentService = appointment.availableServices.find(
        (x) => x.id === appointment.service?.id,
      )
      const address = `${practice.address.street}, ${practice.address.cityCode} ${practice.address.city}`
      exportToCalendar(
        appointment,
        practice.name,
        address,
        appointmentService?.name,
      )
    }

    const handleOpenMap = (e: React.MouseEvent) => {
      e.stopPropagation()
      const address = `${practice.address.street}, ${practice.address.cityCode} ${practice.address.city}`
      const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`
      window.open(mapsUrl, '_blank')
    }

    const handleReschedule = (e: React.MouseEvent) => {
      e.stopPropagation()
      navigate({
        to: '/appointments/$appointmentId/reschedule',
        params: { appointmentId: appointment.id.toString() },
      })
    }

    const handleRebook = (e: React.MouseEvent) => {
      e.stopPropagation()
      navigate({
        to: '/practices/$practiceId',
        params: { practiceId: practice.id.toString() },
        state: {
          filterOptions: {
            animalTypeIds: appointment.animal?.animalTypeId ? [appointment.animal.animalTypeId] : undefined,
            serviceTypeIds: appointment.service?.id ? [appointment.service.id] : undefined,
            animal: appointment.animal?.id
          }
        }
      })
    }

    const handleCancel = (e: React.MouseEvent) => {
      e.stopPropagation()
      setShowCancelDialog(true)
    }

    const card = compact ? (
      <div
        className={`appointment-card compact ${isActive ?? false ? 'active' : ''} ${isPast ? 'past' : 'upcoming'}`}
        onClick={() => handleShowDetailsAppointment(appointment)}
      >
        <div className="compact-animal-image">
          <img
            src={loginRole ? getPictureURLForPracticeId(appointment.veterinaryPractice.id) : getPictureURLForAnimalId(appointment.animal?.id || 0)}
            alt={appointment.animal?.name || 'Tier'}
            onError={(e) => {
              e.currentTarget.src = '/logo192.png'
            }}
          />
        </div>
        <div className="compact-info">
          <div className="compact-practice">{practice.name}</div>
          <div className="compact-date">{formatDate(appointment.startTime)}</div>
          {appointmentType && (
            <div className="compact-service">{appointmentType.name}</div>
          )}
        </div>
      </div>
    ) : (
      <div
        className={`appointment-card ${isActive ?? false ? 'active' : ''} ${isPast ? 'past' : 'upcoming'}`}
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
        {!isPast && (
          <div className="card-actions">
            <button
              className="action-btn"
              onClick={handleExportCalendar}
              title="Zum Kalender hinzufügen"
            >
              <i className="bi bi-calendar-plus"></i>
            </button>
            <button
              className="action-btn"
              onClick={handleOpenMap}
              title="Navigation öffnen"
            >
              <i className="bi bi-geo-alt"></i>
            </button>
            <button
              className="action-btn action-reschedule"
              onClick={handleReschedule}
              title="Termin verschieben"
            >
              <i className="bi bi-calendar-event"></i>
            </button>
            <button
              className="action-btn action-cancel"
              onClick={handleCancel}
              title="Termin absagen"
            >
              <i className="bi bi-x-circle"></i>
            </button>
          </div>
        )}
        {isPast && (
          <div className="card-actions">
            <button
              className="action-btn action-rebook"
              onClick={handleRebook}
              title="Erneut buchen"
            >
              <i className="bi bi-arrow-clockwise"></i>
            </button>
          </div>
        )}
      </div>
    )

    return (
      <>
        {card}
        {showCancelDialog && (
          <AppointmentDeleteDialog
            hideDialogDeleteAppointment={() => setShowCancelDialog(false)}
            appointmentDelete={appointment}
            onShowCancelSuccess={onShowCancelSuccess}
          />
        )}
      </>
    )
  }

  return null
}
