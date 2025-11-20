import { Button } from "react-bootstrap";
import type { AppointmentsType, ServiceType, VeterinaryPracticesType } from "../../../../shared/schemas/ZodSchemas"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getVeterinaryPracticesById } from "../../api/VeterinaryPracticeAPI";
import { cancelAppointment, updateAppointmentNotiz } from "../../api/AppointmentsAPI";
import { useEffect, useState } from "react";
import { exportToCalendar } from "../../utils/calendarExport";

type AppointmentDetailsProps = {
    appointment: AppointmentsType,
    onAppointmentCancelled?: () => void
}

export function AppointmentDetails({ appointment, onAppointmentCancelled }: AppointmentDetailsProps) {
    const [futureAppointment, setFutureAppointment] = useState(true);
    const [notes, setNotes] = useState('');
    const queryClient = useQueryClient();

    const practiceID = appointment.fk_veterinarypracticeid;
    const { isSuccess, data } = useQuery<VeterinaryPracticesType>({
        queryKey: ['veterinaryPractice', practiceID],
        queryFn: () => getVeterinaryPracticesById(practiceID.toString()),
        retry: false,
    });

    const cancelMutation = useMutation({
        mutationFn: (id: number) => cancelAppointment(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['appointmentsFuture'] });
            queryClient.invalidateQueries({ queryKey: ['appointmentsPast'] });
            if (onAppointmentCancelled) {
                onAppointmentCancelled();
            }
        }
    });

    const notizMutation = useMutation({
        mutationFn: ({ id, notiz }: { id: number; notiz: string | null }) => updateAppointmentNotiz(id, notiz),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['appointmentsFuture'] });
            queryClient.invalidateQueries({ queryKey: ['appointmentsPast'] });
        }
    });

    useEffect(() => {
        if (appointment.endtime < new Date()) {
            setFutureAppointment(false);
        } else {
            setFutureAppointment(true);
        }

        setNotes(appointment.notiz || '');
    }, [appointment]);

    const handleNotesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const newNotes = e.target.value;
        setNotes(newNotes);
    };

    const handleNotesBlur = () => {
        if (notes !== (appointment.notiz || '')) {
            notizMutation.mutate({ id: appointment.id, notiz: notes || null });
        }
    };

    const handleCancel = () => {
        if (window.confirm('Möchten Sie diesen Termin wirklich absagen?')) {
            cancelMutation.mutate(appointment.id);
        }
    };

    const handleExport = () => {
        if (isSuccess && data) {
            const practice = data;
            const appointmentType = practice.services?.find((x) => x.id === appointment.fk_serviceid);
            const address = `${practice.addresses.street}, ${practice.addresses.citycode} ${practice.addresses.city}`;

            exportToCalendar(appointment, practice.name, address, appointmentType?.name);
        }
    };

    const handleMapsLink = () => {
        if (isSuccess && data) {
            const address = `${data.addresses.street}, ${data.addresses.citycode} ${data.addresses.city}`;
            const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
            window.open(mapsUrl, '_blank');
        }
    };

    const formatDate = (date: Date) => {
        return date.toLocaleDateString('de-DE', {
            weekday: 'long',
            day: '2-digit',
            month: 'long',
            year: 'numeric'
        });
    };

    const formatTime = (date: Date) => {
        return date.toLocaleTimeString('de-DE', {
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    if (isSuccess) {
        const practice = data;
        let appointmentType: ServiceType | undefined;
        if (practice.services !== null && practice.services !== undefined) {
            appointmentType = practice.services.find((x) => x.id === appointment.fk_serviceid);
        }

        return (
            <div className="appointment-details">
                <div className="details-header">
                    <div className={`status-badge ${futureAppointment ? 'upcoming' : 'past'}`}>
                        {futureAppointment ? 'Bevorstehend' : 'Vergangen'}
                    </div>
                    <h2>{formatDate(appointment.starttime)}</h2>
                    <div className="datetime">
                        {formatTime(appointment.starttime)} - {formatTime(appointment.endtime)}
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
                    {appointmentType && (
                        <div className="info-item">
                            <i className="bi bi-clipboard-pulse"></i>
                            <div className="info-content">
                                <div className="label">Service</div>
                                <div className="value">{appointmentType.name}</div>
                            </div>
                        </div>
                    )}
                    <div className="info-item">
                        <i className="bi bi-geo-alt"></i>
                        <div className="info-content">
                            <div className="label">Adresse</div>
                            <div className="value">
                                {practice.addresses.street}<br />
                                {practice.addresses.citycode} {practice.addresses.city}
                            </div>
                        </div>
                    </div>
                    <div className="info-item">
                        <i className="bi bi-telephone"></i>
                        <div className="info-content">
                            <a href={`tel:${practice.phone}`}>{practice.phone}</a>
                        </div>
                    </div>
                    {practice.infoemail && (
                        <div className="info-item">
                            <i className="bi bi-envelope"></i>
                            <div className="info-content">
                                <a href={`mailto:${practice.infoemail}`}>{practice.infoemail}</a>
                            </div>
                        </div>
                    )}
                </div>

                <div className="details-section">
                    <div className="section-title">Ihr Tier</div>
                    <div className="info-item">
                        <i className="bi bi-heart"></i>
                        <div className="info-content">
                            <div className="value">Tier-ID: {appointment.fk_animalid || 'Nicht zugewiesen'}</div>
                        </div>
                    </div>
                </div>

                {futureAppointment && (
                    <div className="actions-section">
                        <Button
                            className="btn-export"
                            onClick={handleExport}
                        >
                            <i className="bi bi-calendar-plus"></i>
                            In Kalender exportieren
                        </Button>
                        <Button
                            className="btn-maps"
                            onClick={handleMapsLink}
                        >
                            <i className="bi bi-geo-alt"></i>
                            Navigation starten
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
                    <div className="section-title">Notizen</div>
                    <textarea
                        className="notes-textarea"
                        placeholder="Notizen für diesen Termin..."
                        value={notes}
                        onChange={handleNotesChange}
                        onBlur={handleNotesBlur}
                    />
                    <div className="notes-hint">
                        {notizMutation.isPending ? 'Wird gespeichert...' : 'Notizen werden automatisch gespeichert'}
                    </div>
                </div>
            </div>
        );
    }

    return null;
}
