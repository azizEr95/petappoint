import { Button, Form, Modal } from 'react-bootstrap'
import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { dateToDateString, dateToTimeString } from '../../utils/DateToStringFormat'
import { cancelAppointment } from '../../api/AppointmentsAPI'
import type { AppointmentsType } from '../../../../shared/schemas/ZodSchemas'

type AppointmentDeleteDialogProps = {
  hideDialogDeleteAppointment: () => void
  appointmentDelete: AppointmentsType
  onShowCancelSuccess?: () => void
}

export function AppointmentDeleteDialog({
  hideDialogDeleteAppointment,
  appointmentDelete,
  onShowCancelSuccess,
}: AppointmentDeleteDialogProps) {
  const queryClient = useQueryClient()
  const [cancelReason, setCancelReason] = useState<string>("")
  const [reasonText, setReasonText] = useState<string>("")
  const cancelReasons: Array<string> = ["Ich habe keine Zeit.", "Mein Tier ist verstorben.", "Der Termin wurde versehentlich gebucht.", "Sonstiger Grund"];
  const [clickedSubmitDelete, setClickedSubmitDelete] = useState<boolean>(false);

  const deleteAppointmentMutation = useMutation({
    mutationFn: (id: number) => cancelAppointment(id),
    onSuccess: () => {
      if (onShowCancelSuccess) {
        onShowCancelSuccess()
      }
      queryClient.invalidateQueries({ queryKey: ['appointmentsFuture'] })
      queryClient.invalidateQueries({ queryKey: ['appointmentsPast'] })
      queryClient.invalidateQueries({ queryKey: ['nextAvailableAppointments'] })
      hideDialogDeleteAppointment()
    },
  })

  const handleSubmitDeleteAppointment = () => {
    if (cancelReason !== "") {
      if (cancelReason === "Sonstiger Grund" && reasonText === "") {
        return;
      }
      deleteAppointmentMutation.mutate(appointmentDelete.id);
    } else {
      setClickedSubmitDelete(true);
    }
  }

  const handleSelectCancelReason = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === cancelReason) {
      setCancelReason("");
    } else {
      setCancelReason(value);
    }
  }

  const handleChangeReasonText = (e: React.ChangeEvent<HTMLInputElement>) => {
    setReasonText(e.target.value);
  }

  return (
    <Modal
      show={true}
      onHide={hideDialogDeleteAppointment}
    >
      <Modal.Header closeButton>
        <Modal.Title>Termin absagen</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <div className='text'>
          Möchten Sie den Termin für{' '}
          <strong>{appointmentDelete.animal?.name}</strong> am {dateToDateString(appointmentDelete.startTime)} um {dateToTimeString(appointmentDelete.startTime)} wirklich absagen?
        </div>
        <Form.Group>
          <Form.Label>Grund auswählen*:</Form.Label>
          <Form.Control as="select" value={cancelReason} onChange={handleSelectCancelReason} isInvalid={clickedSubmitDelete && cancelReason == ""}>
            <option value="">Bitte auswählen</option>
            {cancelReasons.map((reason) => (
              <option key={reason} value={reason}>
                {reason}
              </option>
            ))}
          </Form.Control>
          <Form.Control.Feedback type='invalid'>
            Bitte einen Grund auswählen.
          </Form.Control.Feedback>
        </Form.Group>
        {cancelReason === "Sonstiger Grund" &&
          <Form.Group>
            <Form.Control type="text" placeholder='Bitte den Grund eingeben' value={reasonText} onChange={handleChangeReasonText} isInvalid={reasonText === ""}></Form.Control>
            <Form.Control.Feedback type='invalid'>
            Bitte einen Grund eingeben.
          </Form.Control.Feedback>
          </Form.Group>}

      </Modal.Body>

      <Modal.Footer>
        <Button
          variant="secondary"
          onClick={hideDialogDeleteAppointment}
          disabled={deleteAppointmentMutation.isPending}
        >
          Abbrechen
        </Button>
        <Button
          variant="danger"
          onClick={handleSubmitDeleteAppointment}
          disabled={deleteAppointmentMutation.isPending}
        >
          {deleteAppointmentMutation.isPending ? 'Wird abgesagt...' : 'Termin absagen'}
        </Button>
      </Modal.Footer>
    </Modal>
  )
}
