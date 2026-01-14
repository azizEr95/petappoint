import {
  createFileRoute,
  useLocation,
  useNavigate,
} from '@tanstack/react-router'
import { useEffect, useMemo, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { getFutureAppointmentsByUserId, getPastAppointmentsByUserId } from '../../api/AppointmentsAPI'
import { AppointmentDetails } from '../../components/appointment/AppointmentDetails'
import { AppointmentList } from '../../components/appointment/AppointmentList'
import { useLoginContext } from '../../LoginContext'
import { isLoggedInAndVerified } from '../../utils/Authentication'
import type { AppointmentsType } from 'vetilib-shared/schemas/ZodSchemas'
import '../../styles/routes/appointments.scss'
import { SuccessNotificationToast } from '@/components/SuccessNotificationToast'


export const Route = createFileRoute('/appointments/')({
  component: Appointments,
})

function Appointments() {
  const { login } = useLoginContext()
  const location = useLocation()
  const navigate = useNavigate()

  // Capture state once on mount to survive navigation state clearing
  const [initialState] = useState(() => {
    const state = location.state as any
    return {
      selectedAppointmentId: state?.selectedAppointmentId,
      initialTab: state?.initialTab as 'upcoming' | 'past' | undefined,
      fromDashboard: state?.fromDashboard === true,
      bookedAppointment: state?.appointment,
      justBooked: state?.justBooked === true,
      wasRescheduled: state?.wasRescheduled === true,
    }
  })

  const [activeTab, setActiveTab] = useState<'upcoming' | 'past'>(
    initialState.initialTab || 'upcoming'
  )
  const [selectedAppointment, setSelectedAppointment] = useState<
    AppointmentsType | undefined
  >(initialState.bookedAppointment)
  const [showSuccessNotification, setShowSuccessNotification] = useState(
    initialState.justBooked,
  )
  const [hasJustBooked, setHasJustBooked] = useState(initialState.justBooked)
  const [showCancelSuccess, setShowCancelSuccess] = useState<boolean>(false)

  const userID = login ? login.id : undefined

  const {
    isError: isErrorFuture,
    isSuccess: isSuccessFuture,
    data: dataFuture,
  } = useQuery<Array<AppointmentsType>>({
    queryKey: ['appointmentsFuture', userID],
    queryFn: () => getFutureAppointmentsByUserId(userID?.toString() ?? '-1'),
    enabled: userID !== undefined,
  })

  const {
    isError: isErrorPast,
    isSuccess: isSuccessPast,
    data: dataPast,
  } = useQuery<Array<AppointmentsType>>({
    queryKey: ['appointmentsPast', userID],
    queryFn: () => getPastAppointmentsByUserId(userID?.toString() ?? '-1'),
    enabled: userID !== undefined,
  })

  useEffect(() => {
    let timer: NodeJS.Timeout | undefined

    if (initialState.justBooked) {
      setShowSuccessNotification(true);
    }

    // Clear state to prevent re-triggering on navigation
    navigate({ to: '/appointments', replace: true })

    return () => {
      if (timer) clearTimeout(timer)
    }
  }, [])

  useEffect(() => {
    if (!isLoggedInAndVerified(login)) {
      console.log("redirect")
      navigate({
        to: '/login',
        search: {
          redirect: '/appointments',
        },
      })
    }
  }, [login])

  // Create sorted copies (don't mutate original arrays)
  const sortedFuture = useMemo(
    () =>
      dataFuture
        ? [...dataFuture].sort(
          (a, b) => a.startTime.getTime() - b.startTime.getTime(),
        )
        : [],
    [dataFuture],
  )
  const sortedPast = useMemo(
    () =>
      dataPast
        ? [...dataPast].sort(
          (a, b) => b.startTime.getTime() - a.startTime.getTime(),
        )
        : [],
    [dataPast],
  )

  useEffect(() => {
    // If user just booked/rescheduled, find and select that appointment
    if (
      isSuccessFuture &&
      hasJustBooked &&
      initialState.bookedAppointment &&
      activeTab === 'upcoming'
    ) {
      const bookedAppt = sortedFuture.find(
        (apt) => apt.id === initialState.bookedAppointment.id,
      )
      if (bookedAppt) {
        setSelectedAppointment(bookedAppt)
        setHasJustBooked(false) // Clear flag after selecting
      }
    }
    // Otherwise auto-select first appointment if none selected
    else if (
      isSuccessFuture &&
      sortedFuture.length > 0 &&
      !selectedAppointment &&
      !hasJustBooked &&
      activeTab === 'upcoming'
    ) {
      setSelectedAppointment(sortedFuture[0])
    }
  }, [
    isSuccessFuture,
    sortedFuture,
    selectedAppointment,
    hasJustBooked,
    activeTab,
  ])

  useEffect(() => {
    // If selected appointment no longer exists in current list, select next one
    if (selectedAppointment) {
      const currentList = activeTab === 'upcoming' ? sortedFuture : sortedPast
      const stillExists = currentList.some(
        (apt) => apt.id === selectedAppointment.id,
      )

      if (!stillExists && currentList.length > 0) {
        setSelectedAppointment(currentList[0])
      } else if (!stillExists) {
        setSelectedAppointment(undefined)
      }
    }
  }, [activeTab, sortedFuture, sortedPast, selectedAppointment])

  // Handle navigation from dashboard
  useEffect(() => {
    if (initialState.fromDashboard && initialState.selectedAppointmentId) {
      if (isSuccessFuture && isSuccessPast) {
        const currentList = initialState.initialTab === 'past' ? sortedPast : sortedFuture
        const appt = currentList.find((a) => a.id === initialState.selectedAppointmentId)
        if (appt) {
          setSelectedAppointment(appt)
        }
      }
    }
  }, [
    initialState.fromDashboard,
    initialState.selectedAppointmentId,
    initialState.initialTab,
    isSuccessFuture,
    isSuccessPast,
    sortedFuture,
    sortedPast,
  ])

  const handleShowDetailsAppointment = (appointment: AppointmentsType) => {
    setSelectedAppointment(appointment)
  }

  const currentData = activeTab === 'upcoming' ? sortedFuture : sortedPast
  const isCurrentError = activeTab === 'upcoming' ? isErrorFuture : isErrorPast
  const isCurrentSuccess =
    activeTab === 'upcoming' ? isSuccessFuture : isSuccessPast

  return (
    <div className="appointments-page">
      <div className="appointments-header">
        <h1>Meine Termine</h1>
      </div>

      <div className="appointments-tabs-wrapper">
        <div className="appointments-tabs">
          <button
            className={`tab-button ${activeTab === `upcoming` ? `active` : ``}`}
            onClick={() => setActiveTab('upcoming')}
          >
            Bevorstehend
            {isSuccessFuture &&
              dataFuture.length > 0 &&
              ` (${dataFuture.length})`}
          </button>
          <button
            className={`tab-button ${activeTab === `past` ? `active` : ``}`}
            onClick={() => setActiveTab('past')}
          >
            Vergangen
            {isSuccessPast && dataPast.length > 0 && ` (${dataPast.length})`}
          </button>
        </div>
        <button
          className="btn btn-primary book-appointment-btn"
          onClick={() =>
            navigate({
              to: '/search',
              search: {
                name: '',
                address: '',
                animalType: '',
                serviceType: '',
              },
            })
          }
        >
          <i className="bi bi-calendar-plus"></i>
          Termin buchen
        </button>
      </div>

      {isCurrentError && (
        <div className="empty-state-centered">
          <i className="bi bi-exclamation-triangle"></i>
          <p>Termine konnten nicht geladen werden</p>
        </div>
      )}

      {isCurrentSuccess && (
        <div className={currentData.length === 0 ? "empty-state-centered" : "appointments-layout"}>
          <div className="appointments-list-section">
            <AppointmentList
              dataAppointments={currentData}
              handleShowDetailsAppointment={handleShowDetailsAppointment}
              selectedAppointment={selectedAppointment}
              isPast={activeTab === 'past'}
            />
          </div>

          <div className="appointments-details-column">
            {selectedAppointment && currentData.length > 0 && (
              <AppointmentDetails
                key={selectedAppointment.id}
                appointment={selectedAppointment}
                onShowCancelSuccess={() => setShowCancelSuccess(true)}
              />
            )}
          </div>
        </div>
      )}

      {/* show succes Notifications in the right corner */}
      {(showSuccessNotification || showCancelSuccess) &&
        <SuccessNotificationToast
          message={showCancelSuccess ? 'Ihr Termin wurde erfolgreich abgesagt.' : (initialState.wasRescheduled ? 'Ihr Termin wurde erfolgreich verschoben.' : 'Ihr Termin wurde erfolgreich gebucht.')}
          onClose={showCancelSuccess ? () => setShowCancelSuccess(false) : () => setShowSuccessNotification(false)} />

      }
    </div>
  )
}
