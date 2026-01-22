import { useEffect, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import type { AppointmentsType } from "vetilib-shared/schemas/ZodSchemas";
import { CalendarPractice } from "@/components/calendar/CalendarPractice";
import { getAvailableAppointmentsByPracticeId, getBookedAppointmentsByPractice } from "@/api/AppointmentsAPI";
import { useLoginContext } from "@/LoginContext";
import { AppointmentDetailDialog } from "@/components/appointment/AppointmentDetailDialog";
import { AppointmentBookDialogPractice } from "@/components/appointment/AppointmentBookDialogPractice";
import { SuccessNotificationToast } from "@/components/SuccessNotificationToast";

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
        console.log("hide")
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

    if (!isSuccessBookedAppointments || !isSuccessAvailableAppointments) {
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

            {activeTab === 'bookAppointment' && (
                <CalendarPractice data={dataAvailableAppointments}
                    onSelectEvent={(appointment: AppointmentsType) => handleShowBookAppointment(appointment)}
                    onSelectSlot={() => { }} />
            )}
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