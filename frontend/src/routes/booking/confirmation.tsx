import {
  createFileRoute,
  useLocation,
  useNavigate,
} from '@tanstack/react-router'
import '../../styles/routes/bookingPage.scss'
import { useEffect, useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { bookAppointment, cancelAppointment } from '../../api/AppointmentsAPI'
import { dateToInfosString } from '../../utils/DateToStringFormat'
import type {
  AnimalsType,
  AppointmentsType,
  ServiceType,
  VeterinaryPracticesType,
} from 'vetilib-shared/schemas/ZodSchemas'
import { useTitle } from '@/utils/useTitle'

export const Route = createFileRoute('/booking/confirmation')({
  component: ConfirmationComponent,
})

type LocationState = {
  appointment: AppointmentsType
  selectedAnimal: AnimalsType
  selectedService: ServiceType
  practice: VeterinaryPracticesType
  isReschedule?: boolean
  oldAppointmentId?: number
}

function ConfirmationComponent() {
  useTitle('Termin bestätigen');
  const navigate = useNavigate()
  const location = useLocation()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [stateLoaded, setStateLoaded] = useState(false)
  const [bookingStatus, setBookingStatus] = useState<
    'pending' | 'success' | 'error'
  >('pending')
  const [errorMessage, setErrorMessage] = useState<string>('')

  // Extract state safely
  const state = location.state as any as LocationState | undefined

  // Validate state in useEffect to avoid navigation during render
  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (!state || !state.appointment || !state.selectedAnimal ||!state.selectedService ||!state.practice) {
      navigate({ to: '/' })
    } else {
      setStateLoaded(true)
    }
  }, [])

  // Book appointment mutation
  const { mutate: mutateAppointment } = useMutation({
    mutationFn: async () => {
      if (!state) throw new Error('Invalid state')

      if (state.isReschedule && state.oldAppointmentId) {
        // RESCHEDULE: Book new appointment first
        const newAppointment = await bookAppointment(
          state.appointment.id,
          state.selectedAnimal.id,
          state.selectedService.id,
        )

        // Then cancel old appointment (don't throw if this fails)
        try {
          await cancelAppointment(state.oldAppointmentId)
        } catch (err) {
          console.error('Cancel old appointment failed:', err)
          // User has new appointment, can manually cancel old one
        }

        return newAppointment
      } else {
        // Normal booking
        return bookAppointment(
          state.appointment.id,
          state.selectedAnimal.id,
          state.selectedService.id,
        )
      }
    },
    onError: (error: any) => {
      console.error('Booking failed:', error)
      setIsSubmitting(false)
      setBookingStatus('error')

      if (state?.isReschedule) {
        if (error?.message?.includes('already taken')) {
          setErrorMessage(
            'Dieser Termin wurde bereits gebucht. Bitte wählen Sie einen anderen.',
          )
        } else {
          setErrorMessage(
            'Terminverschiebung fehlgeschlagen. Ihr alter Termin bleibt bestehen.',
          )
        }
      } else {
        setErrorMessage(
          error?.message ||
            'Die Terminbuchung ist fehlgeschlagen. Bitte versuchen Sie es erneut.',
        )
      }
    },
    onSuccess: (bookedAppointment) => {
      setIsSubmitting(false)
      // Immediate redirect to appointments with booked appointment from API response
      navigate({
        to: '/appointments',
        state: {
          appointment: bookedAppointment,
          justBooked: true,
          wasRescheduled: state?.isReschedule,
        } as any,
        replace: true,
      })
    },
  })

  const handleConfirm = () => {
    setIsSubmitting(true)
    mutateAppointment()
  }

  const handleBack = () => {
    if (state) {
      if (state.isReschedule && state.oldAppointmentId) {
        // Go back to reschedule page
        navigate({
          to: '/appointments/$appointmentId/reschedule',
          params: { appointmentId: state.oldAppointmentId.toString() },
        })
      } else {
        // Go back to booking page (previous step in flow)
        navigate({
          to:
            '/praxen/' + state.practice.id + '/booking/' + state.appointment.id,
        })
      }
    }
  }

  const handleSelectDifferentAppointment = () => {
    if (state) {
      // Go back to practice page to select different timeslot
      navigate({ to: '/practices/' + state.practice.id })
    }
  }

  const handleCancel = () => {
    // Go back to search results
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

  const handleGoToAppointments = () => {
    if (state) {
      navigate({
        to: '/appointments',
        state: { appointment: state.appointment },
        replace: true,
      })
    }
  }

  // Don't render until state is validated
  if (!stateLoaded || !state) {
    return <></>
  }

  const { appointment, selectedAnimal, selectedService, practice } = state

  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  if (practice === undefined) {
    return
  }

  // Show success message
  if (bookingStatus === 'success') {
    return (
      <div className="booking-page">
        <div className="booking-main-centered">
          <div className="booking-confirmation-card">
            <div className="confirmation-icon-wrapper">
              <div className="confirmation-icon confirmation-icon-success">
                <i className="bi bi-check-circle-fill"></i>
              </div>
            </div>

            <h2 className="confirmation-title">
              Ihr Termin wurde erfolgreich gebucht!
            </h2>
            <p className="confirmation-subtitle">
              Wir freuen uns, Sie bald in unserer Praxis begrüßen zu dürfen.
            </p>

            <div className="confirmation-details-grid">
              <div className="info-item">
                <i className="bi bi-hospital"></i>
                <div className="info-content">
                  <div className="info-label">Praxis</div>
                  <div className="info-value">{practice.name}</div>
                  <div className="info-detail">
                    {practice.address.street}, {practice.address.cityCode}{' '}
                    {practice.address.city}
                  </div>
                </div>
              </div>

              <div className="info-item">
                <i className="bi bi-clock"></i>
                <div className="info-content">
                  <div className="info-label">Termin</div>
                  <div className="info-value">
                    {dateToInfosString(appointment.startTime)}
                  </div>
                </div>
              </div>

              <div className="info-item">
                <i className="bi bi-card-list"></i>
                <div className="info-content">
                  <div className="info-label">Leistung</div>
                  <div className="info-value">{selectedService.name}</div>
                </div>
              </div>

              <div className="info-item">
                <i className="bi bi-paw"></i>
                <div className="info-content">
                  <div className="info-label">Tier</div>
                  <div className="info-value">{selectedAnimal.name}</div>
                </div>
              </div>
            </div>

            <div className="confirmation-actions">
              <button
                className="booking-confirm-button"
                onClick={handleGoToAppointments}
              >
                <i className="bi bi-calendar-check"></i>
                Zu meinen Terminen
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Show error message
  if (bookingStatus === 'error') {
    return (
      <div className="booking-page">
        <div className="booking-main-centered">
          <div className="booking-confirmation-card">
            <div className="confirmation-icon-wrapper">
              <div className="confirmation-icon confirmation-icon-error">
                <i className="bi bi-x-circle-fill"></i>
              </div>
            </div>

            <h2 className="confirmation-title confirmation-title-error">
              Die Terminbuchung ist fehlgeschlagen
            </h2>
            <p className="confirmation-subtitle">{errorMessage}</p>

            <div className="confirmation-actions">
              <button
                className="booking-confirm-button booking-button-secondary"
                onClick={handleBack}
              >
                <i className="bi bi-arrow-left"></i>
                Zurück zum Booking
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Show confirmation form (pending state)
  return (
    <div className="booking-page">
      <div className="booking-main-centered">
        <div className="booking-confirmation-card">
          <div className="confirmation-icon-wrapper">
            <div className="confirmation-icon">
              <i className="bi bi-check-circle-fill"></i>
            </div>
          </div>

          <h2 className="confirmation-title">
            Bitte überprüfen Sie Ihre Buchung
          </h2>
          <p className="confirmation-subtitle">
            Überprüfen Sie die Details und bestätigen Sie Ihren Termin.
          </p>

          <div className="confirmation-details-grid">
            <div className="info-item">
              <i className="bi bi-hospital"></i>
              <div className="info-content">
                <div className="info-label">Praxis</div>
                <div className="info-value">{practice.name}</div>
                <div className="info-detail">
                  {practice.address.street}, {practice.address.cityCode}{' '}
                  {practice.address.city}
                </div>
              </div>
            </div>

            <div className="info-item">
              <i className="bi bi-clock"></i>
              <div className="info-content">
                <div className="info-label">Termin</div>
                <div className="info-value">
                  {dateToInfosString(appointment.startTime)}
                </div>
              </div>
            </div>

            <div className="info-item">
              <i className="bi bi-card-list"></i>
              <div className="info-content">
                <div className="info-label">Leistung</div>
                <div className="info-value">{selectedService.name}</div>
              </div>
            </div>

            <div className="info-item">
              <i className="bi bi-paw"></i>
              <div className="info-content">
                <div className="info-label">Tier</div>
                <div className="info-value">{selectedAnimal.name}</div>
              </div>
            </div>
          </div>

          <div className="confirmation-actions">
            <button
              className="booking-confirm-button"
              onClick={handleConfirm}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <div
                    className="spinner-border spinner-border-sm"
                    style={{ marginRight: '0.5rem' }}
                  ></div>
                  Wird gebucht...
                </>
              ) : (
                <>
                  <i className="bi bi-check-circle"></i>
                  {state.isReschedule
                    ? 'Termin jetzt verschieben'
                    : 'Termin jetzt buchen'}
                </>
              )}
            </button>
            <div className="confirmation-secondary-actions">
              <button
                className="booking-confirm-button booking-button-gray"
                onClick={handleSelectDifferentAppointment}
                disabled={isSubmitting}
              >
                <i className="bi bi-calendar-x"></i>
                Anderen Termin wählen
              </button>
              <button
                className="booking-confirm-button booking-button-danger"
                onClick={handleCancel}
                disabled={isSubmitting}
              >
                <i className="bi bi-x-lg"></i>
                Abbrechen
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
