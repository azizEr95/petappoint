import { Button, Form, FormGroup, ListGroup, Modal } from 'react-bootstrap';
import { useState } from 'react';
import { dateToDateString, dateToTimeString } from '../../utils/DateToStringFormat';
import type { AppointmentsType } from 'vetilib-shared/schemas/ZodSchemas';

type AppointmentBookDialogPracticeProps = {
    hideDialogBookAppointment: () => void
    appointmentDetail: AppointmentsType
}

export function AppointmentBookDialogPractice({
    hideDialogBookAppointment,
    appointmentDetail
}: AppointmentBookDialogPracticeProps) {
    const [selectedServiceId, setSelectedServiceId] = useState<string>('');

    // fetch patienten daten hier (email und tierdaten)
    // werden fuer select weiter unten benoetigt

    const handleSubmitBookAppointment = () => {
        // book appointment
    }

    const handleChangeServiceId = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedServiceId(event.target.value);
    }

    return (
        <Modal
            className="appointment-detail-modal"
            show={true}
            onHide={hideDialogBookAppointment}
        >
            <Modal.Header closeButton>
                <Modal.Title>
                    Termin buchen
                    <div className="modal-subtitle">
                        {dateToDateString(appointmentDetail.startTime)} · {dateToTimeString(appointmentDetail.startTime)} - {dateToTimeString(appointmentDetail.endTime)}
                    </div>
                </Modal.Title>
            </Modal.Header>

            <Modal.Body>
                <ListGroup className="list-group-flush">
                    <ListGroup.Item>
                        <strong>Tierarzt</strong>
                        <p>{appointmentDetail.veterinary.firstName} {appointmentDetail.veterinary.lastName}</p>
                    </ListGroup.Item>

                    <ListGroup.Item>
                        <FormGroup>
                            <Form.Label>Behandlung:</Form.Label>
                            <Form.Select value={selectedServiceId} onChange={handleChangeServiceId}>
                                <option value="">Bitte wählen...</option>
                                {appointmentDetail.availableServices.map((service) => (
                                    <option key={service.id} value={service.id}>
                                        {service.name}
                                    </option>
                                ))}
                            </Form.Select>
                        </FormGroup>
                    </ListGroup.Item>

                    <ListGroup.Item>
                        <FormGroup>
                            <Form.Label>Tierbesitzer:</Form.Label>
                            <Form.Control type="text"  />
                        </FormGroup>
                    </ListGroup.Item>

                    <ListGroup.Item>
                        <FormGroup>
                            <Form.Label>Tiername:</Form.Label>
                            <Form.Control type="text"  />
                        </FormGroup>
                    </ListGroup.Item>

                    <ListGroup.Item>
                        <FormGroup>
                            <Form.Label>Tierart:</Form.Label>
                            <Form.Control type="text"  />
                        </FormGroup>
                    </ListGroup.Item>
                </ListGroup>
            </Modal.Body>

            <Modal.Footer>
                <Button variant="secondary" onClick={hideDialogBookAppointment} data-testid="animal-cancel-button">
                    Abbrechen
                </Button>
                <Button variant="primary" onClick={handleSubmitBookAppointment} data-testid="animal-delete-button">
                    Buchen
                </Button>
            </Modal.Footer>
        </Modal>
    )
}