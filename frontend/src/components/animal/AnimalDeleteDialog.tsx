import { useEffect, useState } from 'react'
import { Button, Modal, Alert } from 'react-bootstrap'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { deleteAnimal, deleteAnimalWithAppointments } from '../../api/AnimalsAPI'
import type { AnimalsType, AppointmentsType } from 'petappoint-shared/schemas/ZodSchemas'
import { getAppointmentsByAnimal } from '@/api/AppointmentsAPI'

type AnimalDeleteDialogProps = {
  hideDialogDeleteAnimal: () => void
  animalDelete: AnimalsType
  showSuccessNotification: () => void
}

type DeleteError = { status: number; message: string } | Error | null

// visibility from this component has to be handled from the parent component
export function AnimalDeleteDialog({
  hideDialogDeleteAnimal,
  animalDelete,
  showSuccessNotification
}: AnimalDeleteDialogProps) {
  const queryClient = useQueryClient()
  const [hasConflict, setHasConflict] = useState(false)
  const [deleteError, setDeleteError] = useState<DeleteError>(null)

  // Fetch appointments
  const { data: appointments = [] } = useQuery({
    queryKey: ['animals', animalDelete.id, 'appointments'],
    queryFn: () => getAppointmentsByAnimal(animalDelete.id),
    enabled: hasConflict,
  })

  const futureAppointments = appointments.filter(
    (apt: AppointmentsType) => new Date(apt.startTime) > new Date()
  )

  const { mutate: mutateDeleteAnimal, isPending: isDeleting, isSuccess: deleteSuccess } = useMutation({
    mutationFn: (animalId: number) => deleteAnimal(animalId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['animals'] });
      showSuccessNotification();
    },
    onError: (error: unknown) => {
      const err = error as any
      if (err?.status === 409) {
        setHasConflict(true)
      } else {
        setDeleteError(err)
      }
    },
  })

  const { mutate: mutateDeleteWithAppointments, isPending: isDeletingWithAppointments, isSuccess: deleteWithAppointmentsSuccess } = useMutation({
    mutationFn: (animalId: number) => deleteAnimalWithAppointments(animalId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['animals'] });
      showSuccessNotification();
    },
    onError: (error: unknown) => {
      setDeleteError(error as DeleteError)
    },
  })

  // Close dialog on successful deletion
  useEffect(() => {
    if (deleteSuccess || deleteWithAppointmentsSuccess) {
      hideDialogDeleteAnimal()
    }
  }, [deleteSuccess, deleteWithAppointmentsSuccess, hideDialogDeleteAnimal])

  const handleSubmitDeleteAnimal = () => {
    setDeleteError(null)
    mutateDeleteAnimal(animalDelete.id)
  }

  const handleDeleteWithAppointments = () => {
    mutateDeleteWithAppointments(animalDelete.id)
    hideDialogDeleteAnimal()
  }

  if (hasConflict) {
    return (
      <Modal
        show={true}
        onHide={hideDialogDeleteAnimal}
        className="animal-dialog"
      >
        <Modal.Header closeButton>
          <Modal.Title>Tier {animalDelete.name} hat zukünftige Termine</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <p>{animalDelete.name} hat <strong>{futureAppointments.length}</strong> zukünftige Termine:</p>
          <ul>
            {futureAppointments.map((apt: AppointmentsType) => (
              <li key={apt.id}>
                {new Date(apt.startTime).toLocaleDateString('de-DE', {
                  day: '2-digit',
                  month: '2-digit',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </li>
            ))}
          </ul>
          <p>Möchtest du das Tier löschen und alle Termine absagen?</p>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={hideDialogDeleteAnimal} data-testid="animal-cancel-button">
            Abbrechen
          </Button>
          <Button
            variant="danger"
            onClick={handleDeleteWithAppointments}
            disabled={isDeletingWithAppointments}
            data-testid="animal-delete-with-appointments-button"
          >
            {isDeletingWithAppointments ? 'Wird gelöscht...' : `${animalDelete.name} löschen & Termine absagen`}
          </Button>
        </Modal.Footer>
      </Modal>
    )
  }

  return (
    <Modal
      show={true}
      onHide={hideDialogDeleteAnimal}
      className="animal-dialog"
    >
      <Modal.Header closeButton>
        <Modal.Title>Tier {animalDelete.name} löschen</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        {deleteError && (
          <Alert variant="danger">
            {typeof deleteError === 'object' && deleteError !== null && 'message' in deleteError
              ? deleteError.message
              : 'Ein Fehler ist aufgetreten'}
          </Alert>
        )}
        <div>Willst du dein Tier {animalDelete.name} wirklich löschen?</div>
        <p className="text-muted mt-3" style={{ fontSize: '0.9rem' }}>
          Hinweis: Falls das Tier zukünftige Termine hat, werden diese automatisch abgesagt.
        </p>
      </Modal.Body>

      <Modal.Footer>
        <Button variant="secondary" onClick={hideDialogDeleteAnimal} data-testid="animal-cancel-button">
          Abbrechen
        </Button>
        <Button
          variant="danger"
          onClick={handleSubmitDeleteAnimal}
          disabled={isDeleting}
          data-testid="animal-delete-button"
        >
          {isDeleting ? 'Wird gelöscht...' : `${animalDelete.name} löschen`}
        </Button>
      </Modal.Footer>
    </Modal>
  )
}
