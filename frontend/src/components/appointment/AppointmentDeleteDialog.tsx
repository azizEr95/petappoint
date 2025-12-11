import { Button, Modal } from 'react-bootstrap'
import type { AppointmentsType } from '../../../../shared/schemas/ZodSchemas'

type AppointmentDeleteDialogProps = {
  hideDialogDeleteAppointment: () => void
  appointmentDelete: AppointmentsType
  deleteMutation: any
}

export function AppointmentDeleteDialog({
  hideDialogDeleteAppointment,
  appointmentDelete,
  deleteMutation,
}: AppointmentDeleteDialogProps) {
  const handleSubmitDeleteAppointment = () => {
    deleteMutation.mutate(appointmentDelete.id, {
      onSettled: () => {
        hideDialogDeleteAppointment()
      },
    })
  }

  return (
    <Modal
      show={true}
      onHide={hideDialogDeleteAppointment}
      className="animal-dialog"
    >
      <Modal.Header closeButton>
        <Modal.Title>Termin absagen</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <div>
          Möchten Sie diesen Termin für{' '}
          <strong>{appointmentDelete.animal?.name}</strong> wirklich absagen?
        </div>
      </Modal.Body>

      <Modal.Footer>
        <Button 
          variant="secondary" 
          onClick={hideDialogDeleteAppointment}
          disabled={deleteMutation.isPending}
        >
          Abbrechen
        </Button>
        <Button
          variant="danger"
          onClick={handleSubmitDeleteAppointment}
          disabled={deleteMutation.isPending}
        >
          {deleteMutation.isPending ? 'Wird abgesagt...' : 'Termin absagen'}
        </Button>
      </Modal.Footer>
    </Modal>
  )
}
