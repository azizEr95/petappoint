import { Button } from 'react-bootstrap'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { getVeterinaryPracticesById } from '../../api/VeterinaryPracticeAPI'
import {
  bookAppointment,
  cancelAppointment,
  updateAppointmentNotes,
} from '../../api/AppointmentsAPI'
import { getAnimalsFromUser } from '../../api/AnimalsAPI'
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
  }, [appointment])

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
        <div className="details-header">
          <div
            className={`status-badge ${futureAppointment ? 'upcoming' : 'past'}`}
          >
            {futureAppointment ? 'Bevorstehend' : 'Vergangen'}
          </div>
          <h2>{formatDate(appointment.startTime)}</h2>
          <div className="datetime">
            {formatTime(appointment.startTime)} -{' '}
            {formatTime(appointment.endTime)}
          </div>
        </div>

        <div className="details-section">
          <div className="section-title">Praxisinformationen</div>
          <div className="info-item">
            <i className="bi bi-hospital"></i>
            <div className="info-content">
              <div className="label">{practice.name}</div>
            </div>
          </div>
          <div className="info-item">
            <i className="bi bi-clipboard-pulse"></i>
            <div className="info-content">
              <div className="label">Service</div>
              {editingService && practiceServices ? (
                <select
                  className="edit-select"
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
                <div className="value">
                  {practiceServices?.find((s) => s.id === selectedServiceId)
                    ?.name || '-'}
                </div>
              )}
            </div>
            {futureAppointment && !editingService && (
              <button
                className="edit-icon-button"
                onClick={() => setEditingService(true)}
              >
                <i className="bi bi-pencil"></i>
              </button>
            )}
            {editingService && (
              <>
                <button
                  className="edit-icon-button"
                  onClick={confirmServiceChange}
                  disabled={updateAppointmentMutation.isPending}
                >
                  <i className="bi bi-check"></i>
                </button>
                <button
                  className="edit-icon-button"
                  onClick={cancelServiceEdit}
                >
                  <i className="bi bi-x"></i>
                </button>
              </>
            )}
          </div>
          <div className="info-item">
            <i className="bi bi-geo-alt"></i>
            <div className="info-content">
              <div className="label">Adresse</div>
              <div className="value">
                {practice.address.street}
                <br />
                {practice.address.cityCode} {practice.address.city}
              </div>
            </div>
          </div>
          <div className="info-item">
            <i className="bi bi-telephone"></i>
            <div className="info-content">
              <a href={`tel:${practice.phone}`}>{practice.phone}</a>
            </div>
          </div>
          {practice.infoEmail && (
            <div className="info-item">
              <i className="bi bi-envelope"></i>
              <div className="info-content">
                <a href={`mailto:${practice.infoEmail}`}>
                  {practice.infoEmail}
                </a>
              </div>
            </div>
          )}
        </div>

        <div className="details-section">
          <div className="section-title">Ihr Tier</div>
          <div className="info-item">
            <i className="bi bi-heart"></i>
            <div className="info-content">
              {editingAnimal && userAnimals ? (
                <select
                  className="edit-select"
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
                <div className="value">
                  {userAnimals?.find((a) => a.id === selectedAnimalId)?.name ||
                    appointment.animal?.name ||
                    'Nicht zugewiesen'}
                </div>
              )}
            </div>
            {futureAppointment && !editingAnimal && (
              <button
                className="edit-icon-button"
                onClick={() => setEditingAnimal(true)}
              >
                <i className="bi bi-pencil"></i>
              </button>
            )}
            {editingAnimal && (
              <>
                <button
                  className="edit-icon-button"
                  onClick={confirmAnimalChange}
                  disabled={updateAppointmentMutation.isPending}
                >
                  <i className="bi bi-check"></i>
                </button>
                <button className="edit-icon-button" onClick={cancelAnimalEdit}>
                  <i className="bi bi-x"></i>
                </button>
              </>
            )}
          </div>
        </div>

        {futureAppointment && (
          <div className="actions-section">
            <div className="secondary-actions">
              <button className="btn-secondary" onClick={handleExport}>
                <i className="bi bi-calendar-plus"></i>
                Kalender
              </button>
              <button className="btn-secondary" onClick={handleMapsLink}>
                <i className="bi bi-geo-alt"></i>
                Navigation
              </button>
            </div>
            <Button className="btn-reschedule" onClick={handleReschedule}>
              <i className="bi bi-calendar-event"></i>
              Termin verschieben
            </Button>
            <Button
              className="btn-cancel"
              onClick={handleCancel}
              disabled={cancelMutation.isPending}
            >
              <i className="bi bi-x-circle"></i>
              {cancelMutation.isPending ? 'Wird abgesagt...' : 'Termin absagen'}
            </Button>
          </div>
        )}

        <div className="details-section notes-section">
          <div className="section-title">Notesen</div>
          <textarea
            className="notes-textarea"
            placeholder="Notesen für diesen Termin..."
            value={notes}
            onChange={handleNotesChange}
            onBlur={handleNotesBlur}
          />
          <div className="notes-hint">
            {notesMutation.isPending
              ? 'Wird gespeichert...'
              : 'Notesen werden automatisch gespeichert'}
          </div>
        </div>
      </div>
    )
  }

  return null
}
