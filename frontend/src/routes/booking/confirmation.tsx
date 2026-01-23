import {
  createFileRoute,
  useLocation,
  useNavigate,
} from '@tanstack/react-router'
import '../../styles/routes/bookingPage.scss'
import { useEffect, useState } from 'react'
import { useMutation, useQuery } from '@tanstack/react-query'
import { bookAppointment, cancelAppointment } from '../../api/AppointmentsAPI'
import { getAllAvailableServices } from '../../api/ServicesAPI'
import { dateToInfosString } from '../../utils/DateToStringFormat'
import type { ServiceType } from 'vetilib-shared/schemas/ZodSchemas'
import { useTitle } from '@/utils/useTitle'

export const Route = createFileRoute('/booking/confirmation')({
  validateSearch: (search: Record<string, unknown>) => {
    return {
      address: search.address as string | undefined,
      animalType: search.animalType as string | undefined,
      serviceType: search.serviceType as string | undefined,
      animal: search.animal as string | undefined,
    }
  },
  component: ConfirmationComponent,
})

function ConfirmationComponent() {
  useTitle('Termin bestätigen');
  const navigate = useNavigate()
  const location = useLocation()
  const { address, animalType, serviceType, animal } = Route.useSearch()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [stateLoaded, setStateLoaded] = useState(false)
  const [bookingStatus, setBookingStatus] = useState<
    'pending' | 'success' | 'error'
  >('pending')
  const [errorMessage, setErrorMessage] = useState<string>('')

  const state = location.state

  // Fetch services to get correct names
  const { data: dataServices, isSuccess: isSuccessServices } = useQuery<Array<ServiceType>>({
    queryKey: ['allAvailableServiceTypes'],
    queryFn: () => getAllAvailableServices(undefined),
    retry: false,
  })

  useEffect(() => {
    if(isSuccessServices){
      state.selectedService = dataServices.find((s) => s.id === state.serviceType?.[0]);
    }
  }, [isSuccessServices, dataServices]);

  // Validate state in useEffect to avoid navigation during render
  useEffect(() => {
    // Check for required fields - can be from /booking/$appointmentId or direct state
    const hasAppointment = state.appointment
    const hasAnimal = state.selectedAnimal || state.filterAnimalId
    const hasService = state.selectedService || (state.serviceType && state.serviceType.length > 0)
    // Practice can be in state.practice or in state.appointment.veterinaryPractice
    const hasPractice = state.practice || state.appointment?.veterinaryPractice

    if (!hasAppointment || !hasPractice) {
      // Critical data missing - go home
      navigate({ to: '/' })
      return
    }

    if (!hasAnimal || !hasService) {
      // Missing animal or service - redirect to booking page to select
      const searchParamsForUrl = {
        address: String(address || ''),
        animalType: animalType ? String(animalType) : '',
        serviceType: serviceType ? String(serviceType) : '',
        animal: animal ? String(animal) : '',
      }

      if (state.appointment) {
        navigate({
          to: '/booking/$appointmentId',
          params: { appointmentId: state.appointment.id.toString() },
          search: searchParamsForUrl,
          state: {
            appointment: state.appointment,
            serviceType: state.serviceType,
            filterAnimalId: state.filterAnimalId,
            filterAnimalTypeId: state.filterAnimalTypeId,
            searchParams: state.searchParams,
          },
          replace: true,
        })
      }
      return
    }

    setStateLoaded(true)
  }, [])

  // Handle browser back button - go back to search with filters
  useEffect(() => {
    const handlePopState = () => {
      const searchParamsForUrl = {
        address: String(address || ''),
        animalType: animalType ? String(animalType) : '',
        serviceType: serviceType ? String(serviceType) : '',
        animal: animal ? String(animal) : '',
      }
      navigate({
        to: '/search',
        search: searchParamsForUrl,
      })
    }

    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [address, animalType, serviceType, animal, navigate])

  // Book appointment mutation
  const { mutate: mutateAppointment } = useMutation({
    mutationFn: async () => {
      // Use actual state values or fallbacks
      const animalId = state.selectedAnimal?.id || state.filterAnimalId
      const serviceId = state.selectedService?.id || state.serviceType?.[0]

      if (!animalId || !serviceId) throw new Error('Missing animal or service')

      if (state.isReschedule && state.oldAppointmentId) {
        // RESCHEDULE: Book new appointment first
        const newAppointment = await bookAppointment(
          state.appointment!.id,
          animalId,
          serviceId,
        )

        // Then cancel old appointment (don't throw if this fails)
        try {
          await cancelAppointment(state.oldAppointmentId)
        } catch (err) {
          console.error('Cancel old appointment failed:', err)
          // User has new appointment, can manually cancel old one
        }

        return newAppointment
      }
        // Normal booking
        return bookAppointment(
          state.appointment!.id,
          animalId,
          serviceId,
        )
      
    },
    onError: (error: any) => {
      console.error('Booking failed:', error)
      setIsSubmitting(false)
      setBookingStatus('error')

      if (state.isReschedule) {
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
          wasRescheduled: state.isReschedule,
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
    if (state.practice) {
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
            '/praxen/' + state.practice.id + '/booking/' + state.appointment!.id,
        })
      }
    }
  }

  const handleSelectDifferentAppointment = () => {
      // Go back to search results with filters, preserving selected animal and service
      const rawParams = state.searchParams || {
        address: '',
        animalType: '',
        serviceType: '',
        animal: '',
      }
      // Convert numbers to strings for URL params
      const params = {
        address: String(rawParams.address || ''),
        animalType: rawParams.animalType ? String(rawParams.animalType) : '',
        serviceType: state.selectedService?.id ? String(state.selectedService.id) : (rawParams.serviceType ? String(rawParams.serviceType) : ''),
        animal: state.selectedAnimal?.id ? String(state.selectedAnimal.id) : (rawParams.animal ? String(rawParams.animal) : ''),
      }
      navigate({
        to: '/search',
        search: params
      })
  }

  const handleCancel = () => {
    // Go back to search results with filters, preserving selected animal and service
    const rawParams = state.searchParams || {
      address: '',
      animalType: '',
      serviceType: '',
      animal: '',
    }
    // Convert numbers to strings for URL params
    const params = {
      address: String(rawParams.address || ''),
      animalType: rawParams.animalType ? String(rawParams.animalType) : '',
      serviceType: state.selectedService?.id ? String(state.selectedService.id) : (rawParams.serviceType ? String(rawParams.serviceType) : ''),
      animal: state.selectedAnimal?.id ? String(state.selectedAnimal.id) : (rawParams.animal ? String(rawParams.animal) : ''),
    }
    navigate({
      to: '/search',
      search: params,
    })
  }

  const handleGoToAppointments = () => {
      navigate({
        to: '/appointments',
        state: { appointment: state.appointment },
        replace: true,
      })
  }

  // Don't render until state is validated
  if (!stateLoaded) {
    return <></>
  }

  // Extract appointment, animal, service, practice from state
  // Handle both direct objects and IDs from NextAvailableAppointments
  const appointment = state.appointment
  const selectedAnimal = state.selectedAnimal || (state.filterAnimalId ? {
    id: state.filterAnimalId,
    name: 'Tier',
  } : null)
  const selectedService = state.selectedService || (state.serviceType?.[0] ? {
    id: state.serviceType[0],
    name: 'Leistung',
  } : null)
  console.log('selectedService', selectedService); 
  const practice = state.practice || state.appointment?.veterinaryPractice

  if (!appointment || !selectedAnimal || !selectedService || !practice) {
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
