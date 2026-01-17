import '../../../styles/components/dashboard/DashboardPerson.scss'
import { useEffect, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Button } from 'react-bootstrap'
import { useNavigate } from '@tanstack/react-router'
import type { AppointmentsType } from 'vetilib-shared/schemas/ZodSchemas'
import { CalendarPractice } from '@/components/CalendarPractice'
import { useLoginContext } from '@/LoginContext'
import { getAvailableAppointmentsByPracticeId, getBookedAppointmentsByPractice } from '@/api/AppointmentsAPI'
import { SuccessNotificationToast } from '@/components/SuccessNotificationToast'

export function DashboardPractice() {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState<
        'showAppointments' | 'bookAppointment'
    >('showAppointments');
    const { login } = useLoginContext();
    const [showSuccessNotification, setShowSuccessNotification] = useState<boolean>(false);
    const [notificationText, setNotificationText] = useState<string>("");

    useEffect(() => { // read localStorage for success notification
      const createWeeklyAppointmentSuccess = localStorage.getItem('createWeeklyAppointmentSuccess');
      const createAppointmentSuccess = localStorage.getItem('createAppointmentSuccess');
      if (createWeeklyAppointmentSuccess) {
        setNotificationText('Die wöchentlichen Termine wurden erfolgreich erstellt');
        setShowSuccessNotification(true);
        localStorage.removeItem('createWeeklyAppointmentSuccess');
      } else if(createAppointmentSuccess) {
        setNotificationText('Der Termin wurde erfolgreich erstellt');
        setShowSuccessNotification(true);
        localStorage.removeItem('createAppointmentSuccess');
      }
    }, []);

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

    const handleClickAddAppointment = () => {
        navigate({ to: '/appointments/create' });
    }

    if (!isSuccessBookedAppointments || !isSuccessAvailableAppointments) {
        return;
    }

    return <>
        <div className="dashboard-page">
            <Button variant="primary" onClick={handleClickAddAppointment}>
                Termin anlegen
            </Button>

            {/* Tab Navigation Header */}
            <div className="dashboard-tabs-header">
                <div className="dashboard-tabs">
                    {/* alle anstehenden Termine die von einem Tierbesitzer schon gebucht wurden */}
                    <button
                        className={`dashboard-tab ${activeTab === 'showAppointments' ? 'active' : ''}`}
                        onClick={() => setActiveTab('showAppointments')}
                    >
                        <i className="bi bi-calendar-check"></i> Termine anzeigen
                    </button>
                    {/* alle noch freien Termine die in der Praxis noch gebucht werden können, oder andere Ansicht hier darstellen??; Filteroption benoetigt */}
                    <button
                        className={`dashboard-tab ${activeTab === 'bookAppointment' ? 'active' : ''}`}
                        onClick={() => setActiveTab('bookAppointment')}
                    >
                        <i className="bi bi-calendar-check"></i> Termin buchen
                    </button>
                </div>
            </div>

            <div className="dashboard-content">
                {activeTab === 'showAppointments' && (
                    <CalendarPractice data={dataBookedAppointments} />
                )}

                {activeTab === 'bookAppointment' && (
                    <CalendarPractice data={dataAvailableAppointments} />
                )}
            </div>


            {/* show success Notifications in the right corner */}
            {showSuccessNotification &&
                <SuccessNotificationToast
                    message={notificationText}
                    onClose={() => setShowSuccessNotification(false)} />

            }
        </div>
    </>
}