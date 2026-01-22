import { ListGroup, Modal } from 'react-bootstrap';
import { useQuery } from '@tanstack/react-query';
import { dateToDateString, dateToTimeString } from '../../utils/DateToStringFormat';
import type { AnimalTypeType, AppointmentsType } from 'vetilib-shared/schemas/ZodSchemas';
import { getAnimaltypeById } from '@/api/AnimalTypeAPI';

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
        </Modal>
    )
}