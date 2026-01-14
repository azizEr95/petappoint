import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Link, useNavigate } from '@tanstack/react-router'
import {
  getFutureAppointmentsByUserId,
  getPastAppointmentsByUserId,
} from '../../../api/AppointmentsAPI'
import { AppointmentCard } from '../../appointment/AppointmentCard'
import type { AppointmentsType } from 'vetilib-shared/schemas/ZodSchemas'
import '../../../styles/components/dashboard/DashboardAppointmentsSection.scss'
import { SuccessNotificationToast } from '@/components/SuccessNotificationToast'

type DashboardAppointmentsSectionProps = {
  userId: number
}

export function DashboardAppointmentsSection({
  userId,
}: DashboardAppointmentsSectionProps) {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState<'upcoming' | 'past'>('upcoming');
  const [showCancelSuccess, setShowCancelSuccess] = useState<boolean>(false);

  // Fetch upcoming appointments
  const { data: upcomingAppointments = [], isLoading: isLoadingUpcoming } =
    useQuery<Array<AppointmentsType>>({
      queryKey: ['appointmentsFuture', userId],
      queryFn: () => getFutureAppointmentsByUserId(userId.toString()),
    })

  // Fetch past appointments
  const { data: pastAppointments = [], isLoading: isLoadingPast } = useQuery<
    Array<AppointmentsType>
  >({
    queryKey: ['appointmentsPast', userId],
    queryFn: () => getPastAppointmentsByUserId(userId.toString()),
  })

  const handleShowDetails = (appointment: AppointmentsType) => {
    navigate({
      to: '/appointments',
      state: {
        selectedAppointmentId: appointment.id,
        initialTab: activeTab,
        fromDashboard: true,
      },
    })
  }

  const displayedUpcoming = upcomingAppointments.sort((appointment1, appointment2) => appointment1.startTime.getTime() - appointment2.startTime.getTime()).slice(0, 5)
  const displayedPast = pastAppointments.sort((appointment1, appointment2) => appointment2.startTime.getTime() - appointment1.startTime.getTime()).slice(0, 5)

  const isLoading = activeTab === 'upcoming' ? isLoadingUpcoming : isLoadingPast

  return (
    <div className="dashboard-appointments-section">
      <div className="appointments-tabs">
        <button
          className={`tab-button ${activeTab === 'upcoming' ? 'active' : ''}`}
          onClick={() => setActiveTab('upcoming')}
        >
          <i className="bi bi-calendar-event"></i> Anstehend (
          {upcomingAppointments.length})
        </button>
        <button
          className={`tab-button ${activeTab === 'past' ? 'active' : ''}`}
          onClick={() => setActiveTab('past')}
        >
          <i className="bi bi-calendar-check"></i> Vergangen (
          {pastAppointments.length})
        </button>
      </div>

      <div className="appointments-content">
        {isLoading ? (
          <div className="appointments-loading">Lade Termine...</div>
        ) : activeTab === 'upcoming' ? (
          displayedUpcoming.length === 0 ? (
            <div className="appointments-empty">
              <i className="bi bi-calendar-x"></i>
              <p>Keine anstehenden Termine</p>
              <p className="empty-state-hint">
                Buchen Sie jetzt einen Termin bei einer Tierarztpraxis in Ihrer
                Nähe.
              </p>
            </div>
          ) : (
            <>
              <div className="appointments-list">
                {displayedUpcoming.map((appointment) => (
                  <AppointmentCard
                    key={appointment.id}
                    appointment={appointment}
                    handleShowDetailsAppointment={handleShowDetails}
                    isPast={false}
                    onShowCancelSuccess={() => setShowCancelSuccess(true)}
                  />
                ))}
              </div>
              {upcomingAppointments.length > 5 && (
                <Link to="/appointments" className="view-all-link">
                  Alle {upcomingAppointments.length} Termine anzeigen{' '}
                  <i className="bi bi-arrow-right"></i>
                </Link>
              )}
            </>
          )
        ) : displayedPast.length === 0 ? (
          <div className="appointments-empty">
            <i className="bi bi-calendar-x"></i>
            <p>Keine vergangenen Termine</p>
            <p className="empty-state-hint">
              Buchen Sie Ihren ersten Termin bei einer Tierarztpraxis.
            </p>
            <Link
              to="/search"
              search={{
                name: '',
                address: '',
                animalType: '',
                serviceType: '',
              }}
              className="btn btn-primary"
            >
              <i className="bi bi-calendar-plus"></i> Termin buchen
            </Link>
          </div>
        ) : (
          <>
            <div className="appointments-list">
              {displayedPast.map((appointment) => (
                <AppointmentCard
                  key={appointment.id}
                  appointment={appointment}
                  handleShowDetailsAppointment={handleShowDetails}
                  isPast={true}
                />
              ))}
            </div>
            {pastAppointments.length > 5 && (
              <Link to="/appointments" className="view-all-link">
                Alle {pastAppointments.length} Termine anzeigen{' '}
                <i className="bi bi-arrow-right"></i>
              </Link>
            )}
          </>
        )}
      </div>

      {/* show succes Notifications in the right corner */}
      {showCancelSuccess && (
        <SuccessNotificationToast
          message={'Ihr Termin wurde erfolgreich abgesagt.'}
          onClose={() => setShowCancelSuccess(false)} />
      )}
    </div>
  )
}
