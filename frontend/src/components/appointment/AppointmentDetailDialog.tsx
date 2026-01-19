import { ListGroup, Modal } from 'react-bootstrap';
import { useQuery } from '@tanstack/react-query';
import { dateToDateString, dateToTimeString } from '../../utils/DateToStringFormat';
import type { AnimalTypeType, AppointmentsType } from 'vetilib-shared/schemas/ZodSchemas';
import { getAnimalTypeById } from '@/api/AnimalTypeAPI';

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
        queryFn: () => getAnimalTypeById(appointmentDetail.animal?.animalTypeId.toString() ?? ""),
        retry: false,
        enabled: appointmentDetail.animal?.animalTypeId !== undefined
    })

    if (!isSuccessAnimalType) {
        return;
    }

    return (
        <Modal
            show={true}
            onHide={hideDialogDetailAppointment}
        >
            <Modal.Header closeButton>
                <Modal.Title>Termin</Modal.Title>
            </Modal.Header>

            <Modal.Body>
                <ListGroup className="list-group-flush mt-3">
                    <ListGroup.Item>
                        <div>
                            <strong>Termin am {dateToDateString(appointmentDetail.startTime)} von {dateToTimeString(appointmentDetail.startTime)} bis {dateToTimeString(appointmentDetail.endTime)}</strong>
                        </div>
                    </ListGroup.Item>
                    <ListGroup.Item>
                        <div>
                            <strong>Tierart:</strong>
                            <p className="mb-0">{dataAnimalType.name}</p>
                        </div>
                    </ListGroup.Item>
                    <ListGroup.Item>
                        <div>
                            <strong>Tiername:</strong>
                            <p className="mb-0">{appointmentDetail.animal?.name}</p>
                        </div>
                    </ListGroup.Item>
                    <ListGroup.Item>
                        <div>
                            <strong>Tierarzt:</strong>
                            <p className="mb-0">{appointmentDetail.veterinary.firstName + " " + appointmentDetail.veterinary.lastName}</p>
                        </div>
                    </ListGroup.Item>
                </ListGroup>
            </Modal.Body>
        </Modal>
    )
}