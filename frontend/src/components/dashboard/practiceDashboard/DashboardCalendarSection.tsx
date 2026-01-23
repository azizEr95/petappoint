import { useEffect, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import type { AppointmentsType } from "vetilib-shared/schemas/ZodSchemas";
import { CalendarPractice } from "@/components/calendar/CalendarPractice";
import { getAvailableAppointmentsByPracticeId, getBookedAppointmentsByPractice } from "@/api/AppointmentsAPI";
import { useLoginContext } from "@/LoginContext";
import { AppointmentDetailDialog } from "@/components/appointment/AppointmentDetailDialog";
import { AppointmentBookDialogPractice } from "@/components/appointment/AppointmentBookDialogPractice";
import { SuccessNotificationToast } from "@/components/SuccessNotificationToast";
import { PracticeFilterBar } from "@/components/practice/PracticeFilterBar";
import { getAnimaltypesFromAllVeterinarysFromPractice } from "@/api/AnimalTypeAPI";

export function DashboardCalenderSection() {
    const queryClient = useQueryClient();
    const [activeTab, setActiveTab] = useState<
        'showAppointments' | 'bookAppointment'
    >('showAppointments');
    const { login } = useLoginContext();
    const [showDetailsAppointment, setShowDetailsAppointment] = useState<boolean>(false);
    const [showBookAppointment, setShowBookAppointment] = useState<boolean>(false);
    const [selectedAppointment, setSelectedAppointment] = useState<AppointmentsType>();
    const [showSuccessNotification, setShowSuccessNotification] = useState<boolean>(false);
    const [notificationText, setNotificationText] = useState<string>("");
    const [filterAnimalType, setFilterAnimalType] = useState<Array<number>>([]);
    const [filterServiceType, setFilterServiceType] = useState<Array<number>>([]);
    // filter for booking appointments, not needed for showing booked appointments, component requrires it
    const [filterAnimal, setFilterAnimal] = useState<number | undefined>(undefined);
    const [showedAvailableAppointments, setShowedAvailableAppointments] = useState<Array<AppointmentsType>>([]);

    const { isSuccess: isSuccessBookedAppointments, data: dataBookedAppointments } = useQuery<Array<AppointmentsType>>({
        queryKey: ['bookedAppointmentsPractice', login],
        queryFn: () => getBookedAppointmentsByPractice(login !== false ? login.id.toString() : ''), // login is alwys true here
        retry: false,
        enabled: login !== false && login.role === 'company'
    })

    const filterOptionsAvailableAppointments = {
        animalTypeIds: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
        serviceTypeIds: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    };

    const { isSuccess: isSuccessAvailableAppointments, data: dataAvailableAppointments } = useQuery<Array<AppointmentsType>>({
        queryKey: ['availableAppointmentsPractice', login],
        queryFn: () => getAvailableAppointmentsByPracticeId(login ? login.id.toString() : '', filterOptionsAvailableAppointments), // login is always true here
        retry: false,
        enabled: login !== false && login.role === 'company'
    })

    const practiceId = login && login.id;

    const { data: treatableAnimalTypesData, isSuccess: isSuccessAnimalTypes } = useQuery({
        queryKey: ['treatableAnimalTypes', practiceId],
        queryFn: () => getAnimaltypesFromAllVeterinarysFromPractice(practiceId.toString()),
        retry: false,
        enabled: practiceId !== false && login.role === 'company'
    });

    useEffect(() => { // read localStorage for success notification
        const deleteAppointmentSuccess = localStorage.getItem("deleteAppointmentSuccess");
        if (deleteAppointmentSuccess) {
            queryClient.invalidateQueries({ queryKey: ['bookedAppointmentsPractice'] });
            setNotificationText('Der Termin wurde erfolgreich abgesagt und der Kunde wurde benachrichtigt');
            setShowSuccessNotification(true);
            localStorage.removeItem('deleteAppointmentSuccess');
        }
    }, [showDetailsAppointment])

    const handleHideDetailsAppointment = () => {
        setShowDetailsAppointment(false);
    }

    const handleHideBookAppointment = () => {
        setShowBookAppointment(false);
    }

    const handleShowDetailsAppointment = (appointment: AppointmentsType) => {
        setSelectedAppointment(appointment);
        setShowDetailsAppointment(true);
    }

    const handleShowBookAppointment = (appointment: AppointmentsType) => {
        setSelectedAppointment(appointment);
        setShowBookAppointment(true);
        console.log("book appointment" + appointment.id);
    }

    const handleSubmitFilterAvailableAppointments = () => {
        if (!isSuccessAvailableAppointments || !isSuccessAnimalTypes) {
            return;
        }
        let filteredAppointments = dataAvailableAppointments;

        // Filter vergangene Termine aus
        const now = new Date();
        filteredAppointments = filteredAppointments.filter(appointment => {
            return new Date(appointment.startTime) > now;
        });

        if (filterAnimalType.length > 0) {
            filteredAppointments = filteredAppointments.filter(appointment => {
                for (const animalTypeId of filterAnimalType) {
                    if (treatableAnimalTypesData.find(a => a.id === appointment.veterinary.id)?.treatableAnimalTypes.includes(animalTypeId)) {
                        return true;
                    }
                }
                return false;
            });
        }

        if (filterServiceType.length > 0) {
            filteredAppointments = filteredAppointments.filter(appointment => {
                for (const serviceTypeId of filterServiceType) {
                    // TODO: check if appointment has service type
                    if (appointment.availableServices.map(x => x.id).includes(serviceTypeId)) {
                        return true;
                    }
                }
                return false;
            });
        }

        setShowedAvailableAppointments(filteredAppointments);
    };

    useEffect(() => {
        if (isSuccessAvailableAppointments) {
            handleSubmitFilterAvailableAppointments();
        }
    }, [filterAnimalType, filterServiceType, dataAvailableAppointments, isSuccessAvailableAppointments]);

    if (!isSuccessBookedAppointments || !isSuccessAvailableAppointments || login === false) {
        return;
    }

    return <>
        {/* Tab Navigation Header */}
        <div className="dashboard-tabs-header">
            <div className="dashboard-tabs">
                {/* alle anstehenden Termine die von einem Tierbesitzer schon gebucht wurden */}
                <button
                    className={`dashboard-tab ${activeTab === 'showAppointments' ? 'active' : ''}`}
                    onClick={() => setActiveTab('showAppointments')}
                >
                    <i className="bi bi-calendar-check"></i> Bevorstehende Termine
                </button>
                {/* alle noch freien Termine die in der Praxis noch gebucht werden können, oder andere Ansicht hier darstellen??; Filteroption benoetigt */}
                <button
                    className={`dashboard-tab ${activeTab === 'bookAppointment' ? 'active' : ''}`}
                    onClick={() => setActiveTab('bookAppointment')}
                >
                    <i className="bi bi-calendar-check"></i> Verfügbare Termine
                </button>
            </div>
        </div>

        <div className="dashboard-content">
            {activeTab === 'showAppointments' && (
                <CalendarPractice data={dataBookedAppointments}
                    onSelectEvent={(appointment: AppointmentsType) => handleShowDetailsAppointment(appointment)}
                    onSelectSlot={() => { }} />
            )}

            {activeTab === 'bookAppointment' && (<>
                <PracticeFilterBar
                    filterAnimalType={filterAnimalType}
                    filterServiceType={filterServiceType}
                    filterAnimal={filterAnimal}
                    setFilterAnimalType={setFilterAnimalType}
                    setFilterServiceType={setFilterServiceType}
                    setFilterAnimal={setFilterAnimal}
                    practiceId={login.id.toString()} />
                <CalendarPractice data={showedAvailableAppointments}
                    onSelectEvent={(appointment: AppointmentsType) => handleShowBookAppointment(appointment)}
                    onSelectSlot={() => { }} />
            </>)}
        </div>

        {showDetailsAppointment &&
            <AppointmentDetailDialog
                hideDialogDetailAppointment={handleHideDetailsAppointment}
                appointmentDetail={selectedAppointment!}
            />
        }

        {showBookAppointment &&
            <AppointmentBookDialogPractice
                hideDialogBookAppointment={handleHideBookAppointment}
                appointmentDetail={selectedAppointment!}
            />
        }

        {showSuccessNotification &&
            <SuccessNotificationToast
                message={notificationText}
                onClose={() => setShowSuccessNotification(false)} />
        }
    </>
}