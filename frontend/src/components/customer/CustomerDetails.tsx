import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import type { CustomerType } from "@/api/CustomerAPI";
import { getPicturePlaceholderAnimal, getAppointmentsByAnimal } from "@/api/AnimalsAPI";
import { getAnimaltypeById } from "@/api/AnimalTypeAPI";
import { AppointmentCard } from "@/components/appointment/AppointmentCard";
import type { AppointmentsType } from "vetilib-shared/schemas/ZodSchemas";
import "@/styles/components/customer/CustomerDetails.scss";

type CustomerDetailsProps = {
    customer: CustomerType
}

export function CustomerDetails({ customer }: CustomerDetailsProps) {
    const [animalPictureURL, setAnimalPictureURL] = useState<string>();
    const [birthDate, setBirthDate] = useState<string>();
    const [sex, setSex] = useState<string>();
    const [lifestyle, setLifestyle] = useState<string>();
    const [selectedAppointment, setSelectedAppointment] = useState<AppointmentsType | undefined>();

    const handleShowDetailsAppointment = (appointment: AppointmentsType) => {
        setSelectedAppointment(appointment);
    };

    const { data: dataAnimalType } = useQuery({
        queryKey: ['animaltype', customer.animal.animalTypeId],
        queryFn: () => getAnimaltypeById(customer.animal.animalTypeId.toString()),
        staleTime: 0,
    })

    const { data: appointments = [] } = useQuery({
        queryKey: ['animalAppointments', customer.animal.id],
        queryFn: () => getAppointmentsByAnimal(customer.animal.id),
        staleTime: 0,
    })

    // TODO load correct animal picture when rights are available from backend
    const { data: animalUnknownPictureData, isSuccess: isSuccessUnknownPictureData } = useQuery({
        queryKey: ['animalUnknownPicture'],
        queryFn: () => getPicturePlaceholderAnimal(),
        staleTime: 0,
    })

    useEffect(() => {
        setAnimalPictureURL(animalUnknownPictureData);
    }, [isSuccessUnknownPictureData, animalUnknownPictureData]);

    useEffect(() => { // change data to display format
        if (customer.animal.dateOfBirthIsExact && customer.animal.dateOfBirth) {
            const date = new Date(customer.animal.dateOfBirth);
            setBirthDate(date.toLocaleDateString('de-DE'));
        } else if (!customer.animal.dateOfBirthIsExact && customer.animal.dateOfBirth) {
            const now = new Date();
            const yearDiff = now.getFullYear() - customer.animal.dateOfBirth.getFullYear()
            const monthDiff = now.getMonth() - customer.animal.dateOfBirth.getMonth()
            const ageMonth = 12 * yearDiff + monthDiff
            if (ageMonth > 180) {
                setBirthDate("älter 15 Jahre")
            } else if (ageMonth > 120) {
                setBirthDate("10-15 Jahre")
            } else if (ageMonth > 96) {
                setBirthDate("8-10 Jahre")
            } else if (ageMonth > 72) {
                setBirthDate("6-8 Jahre")
            } else if (ageMonth > 48) {
                setBirthDate("4-6 Jahre")
            } else if (ageMonth > 24) {
                setBirthDate("2-4 Jahre")
            } else if (ageMonth > 6) {
                setBirthDate("6-24 Monate")
            } else {
                setBirthDate("jünger 6 Monate")
            }
        }

        switch (customer.animal.sex) {
            case "male":
                setSex("männlich");
                break;
            case "female":
                setSex("weiblich");
                break;
            case "not_applicable":
                setSex("unbekannt");
                break;
            case "not_known":
                setSex("unbekannt");
                break;
        }

        switch (customer.animal.lifestyle) {
            case "indoor":
                setLifestyle("drinnen");
                break;
            case "outdoor":
                setLifestyle("draußen");
                break;
            case "mixed":
                setLifestyle("draußen & drinnen");
                break;
        }

    }, [customer]);

    const handleClickBack = () => {
        window.history.back();
    }

    const sizeDisplay = customer.animal.heightInCm != null ? `${customer.animal.heightInCm} cm` : '';
    const weightDisplay = customer.animal.weightInGram != null ? `${customer.animal.weightInGram} g` : '';
    const castratedDisplay =
        typeof customer.animal.isCastrated === 'boolean'
            ? (customer.animal.isCastrated ? 'Ja' : 'Nein')
            : '';

    // Split appointments into upcoming and past
    const now = new Date();
    const upcomingAppointments = appointments.filter(apt => new Date(apt.startTime) >= now);
    const pastAppointments = appointments.filter(apt => new Date(apt.startTime) < now);

    return (
        <div className="animal-detail-card-wrapper">
            <button className="back-button" onClick={handleClickBack}>
                <i className="bi bi-arrow-left"></i>
                Zurück
            </button>
            <h2 className="mb-3 customer-heading text-center">Tierdetails {customer.animal.name}</h2>
            <div className="card animal-detail-card">
                <div className="row g-0">
                    <div className="col-auto animal-image-col">
                        <img
                            src={animalPictureURL}
                            alt="Tierbild"
                            className="animal-detail-image"
                        />
                    </div>

                    <div className="col ps-4">
                        <div className="card-body">
                            <div className="row">
                                <div className="col-md-6">
                                    <div className="mb-2 d-flex justify-content-between">
                                        <div>Name:</div>
                                        <div className="text-success">{customer.animal.name}</div>
                                    </div>
                                    <div className="mb-2 d-flex justify-content-between">
                                        <div>Tierart:</div>
                                        <div className="text-success">{dataAnimalType?.name}</div>
                                    </div>
                                    <div className="mb-2 d-flex justify-content-between">
                                        <div>Geschlecht:</div>
                                        <div className="text-success">{sex}</div>
                                    </div>
                                    <div className="mb-2 d-flex justify-content-between">
                                        <div>Geburtsdatum:</div>
                                        <div className="text-success">{birthDate}</div>
                                    </div>
                                </div>

                                <div className="col-md-6">
                                    <div className="mb-2 d-flex justify-content-between">
                                        <div>Größe:</div>
                                        <div className="text-success">{sizeDisplay}</div>
                                    </div>
                                    <div className="mb-2 d-flex justify-content-between">
                                        <div>Gewicht:</div>
                                        <div className="text-success">{weightDisplay}</div>
                                    </div>
                                    <div className="mb-2 d-flex justify-content-between">
                                        <div>Kastriert:</div>
                                        <div className="text-success">{castratedDisplay}</div>
                                    </div>
                                    <div className="mb-2 d-flex justify-content-between">
                                        <div>Lifestyle:</div>
                                        <div className="text-success">{lifestyle}</div>
                                    </div>
                                </div>
                            </div>

                            {/* Owner info below */}
                            <div className="owner-section">
                                <h4 className="card-title fw-bold mt-4">Besitzer</h4>
                                <div className="mb-2 d-flex justify-content-between">
                                    <div>Name:</div>
                                    <div>{customer.person.firstName} {customer.person.lastName}</div>
                                </div>
                                <div className="mb-2 d-flex justify-content-between">
                                    <div>Email:</div>
                                    <div>{customer.person.email}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Appointments section */}
                <div className="mt-4">
                    <h3 className="mb-3 fw-bold">Termine für {customer.animal.name}</h3>

                    {/* Upcoming appointments */}
                    <div className="mb-4">
                        <h5 className="fw-bold text-secondary">Anstehende Termine</h5>
                        {upcomingAppointments.length > 0 ? (
                            <div className="appointments-grid">
                                {upcomingAppointments.map((apt) => (
                                    <AppointmentCard
                                        key={apt.id}
                                        appointment={apt}
                                        handleShowDetailsAppointment={handleShowDetailsAppointment}
                                        isActive={selectedAppointment?.id === apt.id}
                                        isPast={false}
                                        compact={true}
                                    />
                                ))}
                            </div>
                        ) : (
                            <div className="alert alert-info">Keine anstehenden Termine</div>
                        )}
                    </div>

                    {/* Past appointments */}
                    <div>
                        <h5 className="fw-bold text-secondary">Vergangene Termine</h5>
                        {pastAppointments.length > 0 ? (
                            <div className="appointments-grid">
                                {pastAppointments.map((apt) => (
                                    <AppointmentCard
                                        key={apt.id}
                                        appointment={apt}
                                        handleShowDetailsAppointment={handleShowDetailsAppointment}
                                        isActive={selectedAppointment?.id === apt.id}
                                        isPast={true}
                                        compact={true}
                                    />
                                ))}
                            </div>
                        ) : (
                            <div className="alert alert-info">Keine vergangenen Termine</div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
