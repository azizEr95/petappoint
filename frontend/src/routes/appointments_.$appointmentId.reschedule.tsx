import { createFileRoute, useNavigate } from '@tanstack/react-router'
import '../styles/routes/bookingPage.scss'
import { useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { getAppointmentsById } from '../api/AppointmentsAPI'
import { NextAvailableAppointments } from '../components/practice/NextAvailableAppointments'
import type {
  AppointmentFilterType,
  AppointmentsType,
} from '../../../shared/schemas/ZodSchemas'
import { dateToInfosString } from '../utils/DateToStringFormat'

export const Route = createFileRoute('/appointments_/$appointmentId/reschedule')({
  component: RescheduleAppointment,
})

function RescheduleAppointment() {
  const navigate = useNavigate()
  const { appointmentId } = Route.useParams()

  // Load the current appointment to reschedule
  const {
    isPending,
    isError,
    isSuccess,
    data: appointment,
  } = useQuery<AppointmentsType>({
    queryKey: ['appointment', appointmentId],
    queryFn: () => getAppointmentsById(appointmentId),
    retry: false,
  })

  // Redirect if error or appointment not found
  useEffect(() => {
    if (isPending) return
    if (isError || !appointment) {
      navigate({ to: '/appointments' })
    }
  }, [isError, isPending, appointment])

  // Don't render until data is loaded
  if (!isSuccess || !appointment) {
    return <></>
  }

  // Check if appointment is in the future
  if (appointment.endtime < new Date()) {
    navigate({ to: '/appointments' })
    return <></>
  }

  // Build filter options from current appointment
  const filterOptions: AppointmentFilterType = {
    animalTypeIds: appointment.animal?.animaltypeid
      ? [appointment.animal.animaltypeid]
      : undefined,
    serviceTypeIds: appointment.service?.id
      ? [appointment.service.id]
      : undefined,
  }

  const handleBack = () => {
    navigate({ to: '/appointments' })
  }

  const handleSlotClick = (newAppointment: AppointmentsType) => {
    // Navigate to confirmation with reschedule mode
    if (!appointment.animal || !appointment.service) {
      console.error('Cannot reschedule: missing animal or service')
      return
    }

    navigate({
      to: '/booking/confirmation',
      state: {
        appointment: newAppointment,
        selectedAnimal: appointment.animal,
        selectedService: appointment.service,
        practice: appointment.veterinarypractice,
        isReschedule: true,
        oldAppointmentId: appointment.id,
      } as any,
    })
  }

  return (
    <div className="booking-page">
      <div className="booking-header">
        <button className="back-button" onClick={handleBack}>
          <i className="bi bi-arrow-left"></i>
          Zurück
        </button>
        <h1>Termin verschieben</h1>
      </div>

      <div className="booking-layout">
        <div className="booking-main">
          <div className="reschedule-info-banner">
            <i className="bi bi-info-circle"></i>
            <div>
              <strong>Aktueller Termin:</strong> {dateToInfosString(appointment.starttime)}
            </div>
          </div>

          <div className="reschedule-filters-display">
            <div className="filter-badge">
              <i className="bi bi-paw"></i>
              <span>{appointment.animal?.name || 'Kein Tier'}</span>
            </div>
            {appointment.service && (
              <div className="filter-badge">
                <i className="bi bi-clipboard-pulse"></i>
                <span>{appointment.service.name}</span>
              </div>
            )}
          </div>

          <h2 className="section-title">Neuen Termin wählen</h2>

          <NextAvailableAppointments
            praxisID={appointment.veterinarypractice.id.toString()}
            filterOptions={filterOptions}
            onSlotClick={handleSlotClick}
          />
        </div>

        <div className="booking-sidebar">
          <div className="sidebar-section-title">Terminverschiebung</div>

          <div className="info-item">
            <i className="bi bi-hospital"></i>
            <div className="info-content">
              <div className="info-label">Praxis</div>
              <div className="info-value">{appointment.veterinarypractice.name}</div>
            </div>
          </div>

          <div className="info-item">
            <i className="bi bi-calendar-x"></i>
            <div className="info-content">
              <div className="info-label">Alter Termin</div>
              <div className="info-value">{dateToInfosString(appointment.starttime)}</div>
            </div>
          </div>

          <div className="info-item">
            <i className="bi bi-paw"></i>
            <div className="info-content">
              <div className="info-label">Tier</div>
              <div className="info-value">{appointment.animal?.name || '-'}</div>
            </div>
          </div>

          {appointment.service && (
            <div className="info-item">
              <i className="bi bi-clipboard-pulse"></i>
              <div className="info-content">
                <div className="info-label">Service</div>
                <div className="info-value">{appointment.service.name}</div>
              </div>
            </div>
          )}

          <div className="sidebar-note">
            <i className="bi bi-exclamation-circle"></i>
            <p>
              Wählen Sie einen neuen Termin aus. Der alte Termin wird automatisch
              nach Bestätigung abgesagt.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
