import { Button, ListGroup, Modal } from 'react-bootstrap';
import { useMutation, useQuery } from '@tanstack/react-query';
import { dateToDateString, dateToTimeString } from '../../utils/DateToStringFormat';
import type { AnimalTypeType, AppointmentsType } from 'petappoint-shared/schemas/ZodSchemas';
import { getAnimaltypeById } from '@/api/AnimalTypeAPI';
import { cancelAppointment } from '@/api/AppointmentsAPI';

type AppointmentDetailDialogProps = {
    hideDialogDetailAppointment: () => void
    appointmentDetail: AppointmentsType
}

export function AppointmentDetailDialog({
    hideDialogDetailAppointment,
    appointmentDetail
}: AppointmentDetailDialogProps) {

    const { isSuccess: isSuccessAnimalType, data: dataAnimalType } = useQuery<
        AnimalTypeType
    >({
        queryKey: ['animaltype', appointmentDetail.animal?.animalTypeId],
        queryFn: () => getAnimaltypeById(appointmentDetail.animal?.animalTypeId.toString() ?? ""),
        retry: false,
        enabled: appointmentDetail.animal?.animalTypeId !== undefined
    })

    const deleteAppointmentMutation = useMutation({
        mutationFn: (id: number) => cancelAppointment(id),
        onSuccess: () => {
            localStorage.setItem("deleteAppointmentSuccess" ,"true");
            hideDialogDetailAppointment();
        },
    })

    const handleSubmitDeleteAppointment = () => {
        deleteAppointmentMutation.mutate(appointmentDetail.id);
    }

    if (!isSuccessAnimalType) {
        return;
    }

    return (
        <Modal
            className="appointment-detail-modal"
            show={true}
            onHide={hideDialogDetailAppointment}
        >
            <Modal.Header closeButton>
                <Modal.Title>
                    {appointmentDetail.service?.name || 'Termin'}
                    <div className="modal-subtitle">
                        {dateToDateString(appointmentDetail.startTime)} · {dateToTimeString(appointmentDetail.startTime)} - {dateToTimeString(appointmentDetail.endTime)}
                    </div>
                </Modal.Title>
            </Modal.Header>

            <Modal.Body>
                <ListGroup className="list-group-flush">
                    <ListGroup.Item>
                        <strong>Tierarzt</strong>
                        <p>
                            {appointmentDetail.veterinary.firstName} {appointmentDetail.veterinary.lastName}
                        </p>
                    </ListGroup.Item>

                    <ListGroup.Item>
                        <strong>Tier</strong>
                        <p>{appointmentDetail.animal?.name || 'Nicht zugewiesen'}</p>
                    </ListGroup.Item>

                    <ListGroup.Item>
                        <strong>Tierart</strong>
                        <p>{dataAnimalType.name}</p>
                    </ListGroup.Item>


                    {/* TODO: add feature later, another api call needed 
                    {appointmentDetail.animal?.owner && (
                        <ListGroup.Item>
                            <strong>Tierbesitzer</strong>
                            <p>
                                {appointmentDetail.animal.owner.firstName} {appointmentDetail.animal.owner.lastName}
                            </p>
                        </ListGroup.Item>
                    )} */}
                </ListGroup>
            </Modal.Body>
            <Modal.Footer>
                <Button
                    variant="secondary"
                    onClick={hideDialogDetailAppointment}
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