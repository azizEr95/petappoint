import { Button } from 'react-bootstrap'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import {
  getVeterinaryPracticesById,
  getFavoritesVeterinaryPractices,
  addFavoritesVeterinaryPractices,
  deleteFavoritesVeterinaryPractices,
} from '../../api/VeterinaryPracticeAPI'
import {
  bookAppointment,
  cancelAppointment,
  updateAppointmentNotes,
} from '../../api/AppointmentsAPI'
import { getAnimalsFromUser, getPictureURLForAnimalId } from '../../api/AnimalsAPI'
import { getServicesFromPractice } from '../../api/ServicesAPI'
import { exportToCalendar } from '../../utils/calendarExport'
import { useLoginContext } from '../../LoginContext'
import type {
  AnimalsType,
  AppointmentsType,
  ServiceType,
  VeterinaryPracticesType,
} from '../../../../shared/schemas/ZodSchemas'

type AppointmentDetailsProps = {
  appointment: AppointmentsType
  onAppointmentCancelled?: () => void
  onShowCancelSuccess?: () => void
}

export function AppointmentDetails({
  appointment,
  onAppointmentCancelled,
  onShowCancelSuccess,
}: AppointmentDetailsProps) {
  const { login } = useLoginContext()
  const [futureAppointment, setFutureAppointment] = useState(true)
  const [notes, setNotes] = useState('')
  const [editingAnimal, setEditingAnimal] = useState(false)
  const [editingService, setEditingService] = useState(false)
  const [selectedAnimalId, setSelectedAnimalId] = useState<number | undefined>(
    undefined,
  )
  const [selectedServiceId, setSelectedServiceId] = useState<
    number | null | undefined
  >(undefined)
  const [isFavorite, setIsFavorite] = useState(false)
  const [isLoadingFavorite, setIsLoadingFavorite] = useState(false)
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  if (!login) {
    return
  }

  const practiceID = appointment.veterinaryPractice.id
  const userID = login.id // TODO: get from auth context

  const { isSuccess, data } = useQuery<VeterinaryPracticesType>({
    queryKey: ['veterinaryPractice', practiceID],
    queryFn: () => getVeterinaryPracticesById(practiceID.toString()),
    retry: false,
  })

  const { data: userAnimals } = useQuery<Array<AnimalsType>>({
    queryKey: ['animals', userID],
    queryFn: () => getAnimalsFromUser(userID),
    enabled: futureAppointment,
  })

  const { data: practiceServices } = useQuery<Array<ServiceType>>({
    queryKey: ['services', practiceID],
    queryFn: () => getServicesFromPractice(practiceID.toString()),
    enabled: futureAppointment,
  })

  const cancelMutation = useMutation({
    mutationFn: (id: number) => cancelAppointment(id),
    onSuccess: () => {
      if (onShowCancelSuccess) {
        onShowCancelSuccess()
      }
      queryClient.invalidateQueries({ queryKey: ['appointmentsFuture'] })
      queryClient.invalidateQueries({ queryKey: ['appointmentsPast'] })
      queryClient.invalidateQueries({
        predicate: (query) =>
          query.queryKey[0]
            ?.toString()
            .startsWith('nextAvailableAppointments/') ?? false,
      })
      if (onAppointmentCancelled) {
        onAppointmentCancelled()
      }
    },
  })

  const notesMutation = useMutation({
    mutationFn: ({ id, notes }: { id: number; notes: string | null }) =>
      updateAppointmentNotes(id, notes),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointmentsFuture'] })
      queryClient.invalidateQueries({ queryKey: ['appointmentsPast'] })
    },
  })

  const updateAppointmentMutation = useMutation({
    mutationFn: ({
      animalId,
      serviceId,
    }: {
      animalId?: number
      serviceId?: number | null
    }) =>
      bookAppointment(
        appointment.id,
        animalId ?? appointment.animal?.id,
        serviceId !== undefined ? serviceId : (appointment.service?.id ?? null),
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointmentsFuture'] })
      queryClient.invalidateQueries({ queryKey: ['appointmentsPast'] })
    },
  })

  useEffect(() => {
    if (appointment.endTime < new Date()) {
      setFutureAppointment(false)
    } else {
      setFutureAppointment(true)
    }

    setNotes(appointment.notes || '')
    setSelectedAnimalId(appointment.animal?.id)
    setSelectedServiceId(appointment.service?.id ?? null)

    // Load favorite status
    const loadFavoriteStatus = async () => {
      try {
        const favorites = await getFavoritesVeterinaryPractices(login.id)
        setIsFavorite(favorites.includes(appointment.veterinaryPractice.id))
      } catch (error) {
        console.error('Failed to load favorite status:', error)
      }
    }
    loadFavoriteStatus()
  }, [appointment, login.id])

  const handleNotesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newNotes = e.target.value
    setNotes(newNotes)
  }

  const handleNotesBlur = () => {
    if (notes !== (appointment.notes || '')) {
      notesMutation.mutate({ id: appointment.id, notes: notes || null })
    }
  }

  const handleCancel = () => {
    if (window.confirm('Möchten Sie diesen Termin wirklich absagen?')) {
      cancelMutation.mutate(appointment.id)
    }
  }

  const handleExport = () => {
    if (isSuccess) {
      const practice = data
      const appointmentType = appointment.availableServices.find(
        (x) => x.id === appointment.service?.id,
      )
      const address = `${practice.address.street}, ${practice.address.cityCode} ${practice.address.city}`

      exportToCalendar(
        appointment,
        practice.name,
        address,
        appointmentType?.name,
      )
    }
  }

  const handleMapsLink = () => {
    if (isSuccess) {
      const address = `${data.address.street}, ${data.address.cityCode} ${data.address.city}`
      const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`
      window.open(mapsUrl, '_blank')
    }
  }

  const handleReschedule = () => {
    navigate({
      to: '/appointments/$appointmentId/reschedule',
      params: { appointmentId: appointment.id.toString() },
    })
  }

  const handleToggleFavorite = async () => {
    setIsLoadingFavorite(true)
    try {
      if (isFavorite) {
        await deleteFavoritesVeterinaryPractices(
          login.id,
          appointment.veterinaryPractice.id,
        )
      } else {
        await addFavoritesVeterinaryPractices(
          login.id,
          appointment.veterinaryPractice.id,
        )
      }
      setIsFavorite(!isFavorite)
      queryClient.invalidateQueries({ queryKey: ['veterinaryPractices'] })
      queryClient.invalidateQueries({ queryKey: ['favoriteVeterinaryPractices'] })
    } catch (error) {
      console.error('Failed to toggle favorite:', error)
    } finally {
      setIsLoadingFavorite(false)
    }
  }

  const handlePracticeClick = () => {
    navigate({
      to: '/search',
      search: {
        name: data?.name || '',
        address: data?.address.city || '',
        animalType: '',
        serviceType: '',
      },
    })
  }

  const handleAnimalChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newAnimalId = parseInt(e.target.value)
    setSelectedAnimalId(newAnimalId)
  }

  const handleServiceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value
    const newServiceId = value === '' ? null : parseInt(value)
    setSelectedServiceId(newServiceId)
  }

  const confirmAnimalChange = () => {
    if (selectedAnimalId) {
      setEditingAnimal(false)
      updateAppointmentMutation.mutate({ animalId: selectedAnimalId })
    }
  }

  const confirmServiceChange = () => {
    setEditingService(false)
    updateAppointmentMutation.mutate({ serviceId: selectedServiceId ?? null })
  }

  const handleAnimalKeyDown = (e: React.KeyboardEvent<HTMLSelectElement>) => {
    if (e.key === 'Enter') {
      confirmAnimalChange()
    } else if (e.key === 'Escape') {
      cancelAnimalEdit()
    }
  }

  const handleServiceKeyDown = (e: React.KeyboardEvent<HTMLSelectElement>) => {
    if (e.key === 'Enter') {
      confirmServiceChange()
    } else if (e.key === 'Escape') {
      cancelServiceEdit()
    }
  }

  const cancelAnimalEdit = () => {
    setSelectedAnimalId(appointment.animal?.id)
    setEditingAnimal(false)
  }

  const cancelServiceEdit = () => {
    setSelectedServiceId(appointment.service?.id ?? null)
    setEditingService(false)
  }

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('de-DE', {
      weekday: 'long',
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    })
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('de-DE', {
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  if (isSuccess) {
    const practice = data

    return (
      <div className="appointment-details">
        {/* Enhanced Header with Animal Image */}
        <div className="details-header-enhanced">
          <div className="header-animal-image">
            <img
              src={getPictureURLForAnimalId(appointment.animal?.id || 0)}
              alt={appointment.animal?.name || 'Tier'}
              onError={(e) => {
                e.currentTarget.src = '/logo192.png'
              }}
            />
          </div>
          <div className="header-datetime">
            <div className="practice-name-header">{practice.name}</div>
            <h2>
              {appointment.startTime.toLocaleDateString('de-DE', {
                weekday: 'long',
              })}
              <br />
              {appointment.startTime.toLocaleDateString('de-DE', {
                day: '2-digit',
                month: 'long',
                year: 'numeric',
              })}
            </h2>
            <div className="time">
              {formatTime(appointment.startTime)} -{' '}
              {formatTime(appointment.endTime)}
            </div>
          </div>
          <div
            className={`status-badge ${futureAppointment ? 'upcoming' : 'past'}`}
          >
            {futureAppointment ? 'Bevorstehend' : 'Vergangen'}
          </div>
        </div>

        {/* Action Buttons at Top */}
        {futureAppointment && (
          <div className="actions-section-top">
            <button className="btn-action" onClick={handleExport}>
              <i className="bi bi-calendar-plus"></i>
              <span>Kalender</span>
            </button>
            <button className="btn-action" onClick={handleMapsLink}>
              <i className="bi bi-geo-alt"></i>
              <span>Navigation</span>
            </button>
            <button className="btn-action btn-reschedule" onClick={handleReschedule}>
              <i className="bi bi-calendar-event"></i>
              <span>Verschieben</span>
            </button>
            <button
              className="btn-action btn-cancel"
              onClick={handleCancel}
              disabled={cancelMutation.isPending}
            >
              <i className="bi bi-x-circle"></i>
              <span>{cancelMutation.isPending ? 'Wird abgesagt...' : 'Absagen'}</span>
            </button>
          </div>
        )}

        {/* Compact Content - Single Column with Compact Layout */}
        <div className="details-content-compact">
          <div className="info-column">
            {/* Practice Info Rows */}
            <div className="info-item compact-row practice-row">
              <div className="compact-label">PRAXIS</div>
              <button
                className="practice-link-button"
                onClick={handlePracticeClick}
                title="Zur Praxisseite"
              >
                {practice.name}
              </button>
              <button
                className="favorite-button"
                onClick={handleToggleFavorite}
                disabled={isLoadingFavorite}
                title={isFavorite ? 'Aus Favoriten entfernen' : 'Zu Favoriten hinzufügen'}
              >
                <i className={`bi ${isFavorite ? 'bi-heart-fill' : 'bi-heart'}`}></i>
              </button>
            </div>

            <div className="info-item compact-row practice-row">
              <div className="compact-label">ADRESSE</div>
              <button
                className="practice-address-button"
                onClick={handleMapsLink}
                title="Auf Google Maps öffnen"
              >
                {practice.address.street}, {practice.address.cityCode} {practice.address.city}
              </button>
            </div>

            {/* Tier */}
            <div className="info-item compact-row">
              <div className="compact-label">TIER</div>
              <div className="compact-value">
                {editingAnimal && userAnimals ? (
                  <select
                    className="edit-select-inline"
                    value={selectedAnimalId || ''}
                    onChange={handleAnimalChange}
                    onKeyDown={handleAnimalKeyDown}
                    disabled={updateAppointmentMutation.isPending}
                  >
                    {userAnimals.map((animal) => (
                      <option key={animal.id} value={animal.id}>
                        {animal.name}
                      </option>
                    ))}
                  </select>
                ) : (
                  <>
                    {userAnimals?.find((a) => a.id === selectedAnimalId)?.name ||
                      appointment.animal?.name ||
                      'Nicht zugewiesen'}
                  </>
                )}
              </div>
              {futureAppointment && !editingAnimal && (
                <button
                  className="edit-icon-button-mini"
                  onClick={() => setEditingAnimal(true)}
                >
                  <i className="bi bi-pencil"></i>
                </button>
              )}
              {editingAnimal && (
                <div className="edit-buttons">
                  <button
                    className="edit-icon-button-mini"
                    onClick={confirmAnimalChange}
                    disabled={updateAppointmentMutation.isPending}
                  >
                    <i className="bi bi-check"></i>
                  </button>
                  <button className="edit-icon-button-mini" onClick={cancelAnimalEdit}>
                    <i className="bi bi-x"></i>
                  </button>
                </div>
              )}
            </div>

            {/* Service */}
            <div className="info-item compact-row">
              <div className="compact-label">SERVICE</div>
              <div className="compact-value">
                {editingService && practiceServices ? (
                  <select
                    className="edit-select-inline"
                    value={selectedServiceId || ''}
                    onChange={handleServiceChange}
                    onKeyDown={handleServiceKeyDown}
                    disabled={updateAppointmentMutation.isPending}
                  >
                    {practiceServices.map((service) => (
                      <option key={service.id} value={service.id}>
                        {service.name}
                      </option>
                    ))}
                  </select>
                ) : (
                  practiceServices?.find((s) => s.id === selectedServiceId)?.name ||
                  '-'
                )}
              </div>
              {futureAppointment && !editingService && (
                <button
                  className="edit-icon-button-mini"
                  onClick={() => setEditingService(true)}
                >
                  <i className="bi bi-pencil"></i>
                </button>
              )}
              {editingService && (
                <div className="edit-buttons">
                  <button
                    className="edit-icon-button-mini"
                    onClick={confirmServiceChange}
                    disabled={updateAppointmentMutation.isPending}
                  >
                    <i className="bi bi-check"></i>
                  </button>
                  <button
                    className="edit-icon-button-mini"
                    onClick={cancelServiceEdit}
                  >
                    <i className="bi bi-x"></i>
                  </button>
                </div>
              )}
            </div>

            {/* Notes */}
            <div className="notes-section-compact">
              {notes && <div className="compact-label">NOTIZEN</div>}
              <textarea
                className="notes-textarea-compact"
                placeholder="Notizen..."
                value={notes}
                onChange={handleNotesChange}
                onBlur={handleNotesBlur}
              />
              <div className="notes-hint">
                {notesMutation.isPending ? 'Wird gespeichert...' : ''}
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return null
}
