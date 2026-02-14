import '../../../styles/components/dashboard/DashboardPerson.scss'
import { useEffect, useState } from 'react'
import { Button } from 'react-bootstrap'
import { useNavigate } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { DashboardCalenderSection } from './DashboardCalendarSection'
import type { VeterinaryPracticesType } from 'petappoint-shared/schemas/ZodSchemas'
import { SuccessNotificationToast } from '@/components/SuccessNotificationToast'
import { PracticeProfileEditDialog } from '@/components/profile/PracticeProfileEditDialog'
import { useLoginContext } from '@/LoginContext'
import { getPictureURLForPracticeId, getVeterinaryPracticesById } from '@/api/VeterinaryPracticeAPI'

export function DashboardPractice() {
  const navigate = useNavigate()
  const { login } = useLoginContext()
  const [showSuccessNotification, setShowSuccessNotification] = useState<boolean>(false)
  const [notificationText, setNotificationText] = useState<string>("")
  const [showProfileDialog, setShowProfileDialog] = useState<boolean>(false)

  const practiceId = login && typeof login === 'object' && 'id' in login ? login.id : -1

  const { data: practice, isLoading: isLoadingPractice } = useQuery<VeterinaryPracticesType>({
    queryKey: ['practice', practiceId],
    queryFn: () => getVeterinaryPracticesById(practiceId.toString()),
    enabled: practiceId !== -1,
  })

  useEffect(() => { // read localStorage for success notification
    const createWeeklyAppointmentSuccess = localStorage.getItem('createWeeklyAppointmentSuccess');
    const createAppointmentSuccess = localStorage.getItem('createAppointmentSuccess');
    if (createWeeklyAppointmentSuccess) {
      setNotificationText('Die wöchentlichen Termine wurden erfolgreich erstellt');
      setShowSuccessNotification(true);
      localStorage.removeItem('createWeeklyAppointmentSuccess');
    } else if (createAppointmentSuccess) {
      setNotificationText('Der Termin wurde erfolgreich erstellt');
      setShowSuccessNotification(true);
      localStorage.removeItem('createAppointmentSuccess');
    }
  }, [])

  const handleClickAddAppointment = () => {
    navigate({ to: '/appointments/create' })
  }

  if (isLoadingPractice || !practice) {
    return <div>Laden...</div>
  }

  const handleClickVeterinarianPage = () => {
    navigate({ to: '/veterinarians', search: { veterinarianName: "", sortBy: "name-asc", specialization: "" } });
  }

  return <>
    <div className="dashboard-page">
      <div className="dashboard-header-section">
        <div className="dashboard-header-text">
          <h1 className="greeting-title">Hallo {practice.name}!</h1>
        </div>
        <div className="dashboard-header-actions">
          <button
            className="dashboard-header-cta"
            onClick={handleClickAddAppointment}
          >
            <i className="bi bi-calendar-plus"></i> Termin anlegen
          </button>
          <div className="dashboard-header-profile">
            <div className="profile-image-wrapper">
              <img
                src={getPictureURLForPracticeId(practiceId, Date.now())}
                alt={practice.name}
                className="profile-image"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200"%3E%3Crect fill="%23ddd" width="200" height="200"/%3E%3Ctext x="50%25" y="50%25" font-size="30" fill="%23999" text-anchor="middle" dy=".3em"%3ENo Image%3C/text%3E%3C/svg%3E'
                }}
              />
              <button
                className="profile-edit-btn"
                onClick={() => setShowProfileDialog(true)}
                title="Profil bearbeiten"
              >
                <i className="bi bi-pencil"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="dashboard-buttons mt-4">
        <Button variant="primary" onClick={() => navigate({ to: '/customers', search: { name: "", sortBy: "" } })}>
          alle Kunden
        </Button>
        <Button variant="primary" onClick={handleClickVeterinarianPage} className="ms-2">
          Tierärzte
        </Button>
      </div>



      <DashboardCalenderSection />

      {showSuccessNotification &&
        <SuccessNotificationToast
          message={notificationText}
          onClose={() => setShowSuccessNotification(false)} />
      }

      {showProfileDialog && (
        <PracticeProfileEditDialog
          hideDialog={() => setShowProfileDialog(false)}
          practiceId={practiceId}
        />
      )}
    </div>
  </>
}