import '../../../styles/components/dashboard/DashboardPerson.scss'
import { useEffect, useState } from 'react'
import { Button } from 'react-bootstrap'
import { useNavigate } from '@tanstack/react-router'
import { DashboardCalenderSection } from './DashboardCalendarSection'
import { SuccessNotificationToast } from '@/components/SuccessNotificationToast'

export function DashboardPractice() {
  const navigate = useNavigate();
  const [showSuccessNotification, setShowSuccessNotification] = useState<boolean>(false);
  const [notificationText, setNotificationText] = useState<string>("");

  useEffect(() => { // read localStorage for success notification
      const createWeeklyAppointmentSuccess = localStorage.getItem('createWeeklyAppointmentSuccess');
      const createAppointmentSuccess = localStorage.getItem('createAppointmentSuccess');
      if (createWeeklyAppointmentSuccess) {
          setNotificationText('Die wöchentlichen Termine wurden erfolgreich erstellt');
          setShowSuccessNotification(true);
          localStorage.removeItem('createWeeklyAppointmentSuccess');
      } else if  (createAppointmentSuccess) {
          setNotificationText('Der Termin wurde erfolgreich erstellt');
          setShowSuccessNotification(true);
          localStorage.removeItem('createAppointmentSuccess');
      }
  }, []);

  const handleClickAddAppointment = () => {
    navigate({ to: '/appointments/create' });
  }

  const handleClickAddVeterinarian = () => {
    navigate({ to: '/veterinarians/create' });
  }

    return <>
        <div className="dashboard-page">
            <Button variant="primary" onClick={handleClickAddAppointment}>
                Termin anlegen
            </Button>

            <Button variant="primary" onClick={handleClickAddVeterinarian} className="ms-2">
              Tierarzt erstellen
            </Button>

            <Button variant="primary" onClick={() => navigate({ to: '/customers', search: { name: "" } })} className="ms-2">
                alle Kunden
            </Button>

      <DashboardCalenderSection />

      {showSuccessNotification &&
        <SuccessNotificationToast
          message={notificationText}
          onClose={() => setShowSuccessNotification(false)} />

      }
    </div>
  </>
}