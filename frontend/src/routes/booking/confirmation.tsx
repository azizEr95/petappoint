import { createFileRoute, useLocation, useNavigate } from '@tanstack/react-router'
import '../../styles/routes/bookingPage.scss'
import { useEffect, useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { bookAppointment } from '../../api/AppointmentsAPI'
import type {
  AnimalsType,
  AppointmentsType,
  ServiceType,
  VeterinaryPracticesType,
} from '../../../../shared/schemas/ZodSchemas'
import { dateToInfosString } from '../../utils/DateToStringFormat'

export const Route = createFileRoute('/booking/confirmation')({
  component: ConfirmationComponent,
})

type LocationState = {
  appointment: AppointmentsType
  selectedAnimal: AnimalsType
  selectedService: ServiceType
  practice: VeterinaryPracticesType
}

function ConfirmationComponent() {
  const navigate = useNavigate()
  const location = useLocation()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [stateLoaded, setStateLoaded] = useState(false)
  const [bookingStatus, setBookingStatus] = useState<'pending' | 'success' | 'error'>('pending')
  const [errorMessage, setErrorMessage] = useState<string>('')

  // Extract state safely
  const state = (location.state as any) as LocationState | undefined

  // Validate state in useEffect to avoid navigation during render
  useEffect(() => {
    if (!state || !state.appointment || !state.selectedAnimal || !state.selectedService || !state.practice) {
      console.error('Invalid state in confirmation page:', state)
      navigate({ to: '/' })
    } else {
      setStateLoaded(true)
    }
  }, [state, navigate])

  // Book appointment mutation
  const { mutate: mutateAppointment } = useMutation({
    mutationFn: () => {
      if (!state) throw new Error('Invalid state')
      return bookAppointment(state.appointment.id, state.selectedAnimal.id, state.selectedService.id)
    },
    onError: (error: any) => {
      console.error('Booking failed:', error)
      setIsSubmitting(false)
      setBookingStatus('error')
      setErrorMessage(error?.message || 'Die Terminbuchung ist fehlgeschlagen. Bitte versuchen Sie es erneut.')
    },
    onSuccess: () => {
      setIsSubmitting(false)
      setBookingStatus('success')
    },
  })

  const handleConfirm = () => {
    setIsSubmitting(true)
    mutateAppointment()
  }

  const handleBack = () => {
    if (bookingStatus === 'error' && state) {
      // Go back to booking page if error
      navigate({ to: '/praxen/' + state.practice.id + '/booking/' + state.appointment.id })
    } else if (state) {
      // Go back to practice page before booking
      navigate({ to: '/praxen/' + state.practice.id })
    }
  }


  const handleGoToAppointments = () => {
    if (state) {
      navigate({
        to: '/appointments',
        state: { appointment: state.appointment },
        replace: true
      })
    }
  }

  // Don't render until state is validated
  if (!stateLoaded || !state) {
    return <></>
  }

  const { appointment, selectedAnimal, selectedService, practice } = state

  // Show success message
  if (bookingStatus === 'success') {
    return (
      <div className="booking-page">
        <div className="booking-header">
          <h1>Buchung erfolgreich!</h1>
        </div>

        <div className="booking-main-centered">
          <div className="booking-confirmation-card">
            <div className="confirmation-icon-wrapper">
              <div className="confirmation-icon confirmation-icon-success">
                <i className="bi bi-check-circle-fill"></i>
              </div>
            </div>

            <h2 className="confirmation-title">Ihr Termin wurde erfolgreich gebucht!</h2>
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
                    {practice.addresses.street}, {practice.addresses.citycode} {practice.addresses.city}
                  </div>
                </div>
              </div>

              <div className="info-item">
                <i className="bi bi-clock"></i>
                <div className="info-content">
                  <div className="info-label">Termin</div>
                  <div className="info-value">{dateToInfosString(appointment.starttime)}</div>
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
        <div className="booking-header">
          <button className="back-button" onClick={handleBack}>
            <i className="bi bi-arrow-left"></i>
            Zurück
          </button>
          <h1>Buchung fehlgeschlagen</h1>
        </div>

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
            <p className="confirmation-subtitle">
              {errorMessage}
            </p>

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
      <div className="booking-header">
        <button className="back-button" onClick={handleBack} disabled={isSubmitting}>
          <i className="bi bi-arrow-left"></i>
          Zurück
        </button>
        <h1>Buchung bestätigen</h1>
      </div>

      <div className="booking-main-centered">
        <div className="booking-confirmation-card">
          <div className="confirmation-icon-wrapper">
            <div className="confirmation-icon">
              <i className="bi bi-check-circle-fill"></i>
            </div>
          </div>

          <h2 className="confirmation-title">Bitte überprüfen Sie Ihre Buchung</h2>
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
                  {practice.addresses.street}, {practice.addresses.citycode} {practice.addresses.city}
                </div>
              </div>
            </div>

            <div className="info-item">
              <i className="bi bi-clock"></i>
              <div className="info-content">
                <div className="info-label">Termin</div>
                <div className="info-value">{dateToInfosString(appointment.starttime)}</div>
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
                  <div className="spinner-border spinner-border-sm" style={{ marginRight: '0.5rem' }}></div>
                  Wird gebucht...
                </>
              ) : (
                <>
                  <i className="bi bi-check-circle"></i>
                  Termin jetzt buchen
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
