import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { DashboardProfileCard } from '../components/dashboard/DashboardProfileCard'
import { QuickActions } from '../components/dashboard/QuickActions'
import { DashboardPetsSection } from '../components/dashboard/DashboardPetsSection'
import { DashboardAppointmentsSection } from '../components/dashboard/DashboardAppointmentsSection'
import { AnimalEditNewDialog } from '../components/animal/AnimalEditNewDialog'
import { ProfileEditDialog } from '../components/profile/ProfileEditDialog'
import '../styles/routes/dashboard.scss'
import { useLoginContext } from '../LoginContext'
import type { PersonsType } from '../../../shared/schemas/ZodSchemas'
import { useQuery } from '@tanstack/react-query'
import { getPersonById, getPictureURLForPersonId } from '../api/PersonsAPI'

export const Route = createFileRoute('/dashboard')({
  component: Dashboard,
})

function Dashboard() {
  const { login } = useLoginContext()
  if (!login) {
    return
  }

  const userId = login.id

  const { data: user, isLoading: isLoadingUser } = useQuery<PersonsType>({
    queryKey: ['person', userId],
    queryFn: () => getPersonById(userId),
    retry: false,
  })

  const [showAddPetDialog, setShowAddPetDialog] = useState(false)
  const [showEditProfileDialog, setShowEditProfileDialog] = useState(false)

  const handleEditProfile = () => {
    setShowEditProfileDialog(true)
  }

  const handleAddPet = () => {
    setShowAddPetDialog(true)
  }

  if (isLoadingUser || !user) {
    return <div>Loading...</div>
  }

  return (
    <div className="dashboard-page">
      <div className="dashboard-header">
        <h1>Mein Dashboard</h1>
        <p className="dashboard-subtitle">
          Willkommen zurück! Hier ist eine Übersicht über Ihre Tiere und
          Termine.
        </p>
      </div>

      <div className="dashboard-grid">
        {/* Profile Section */}
        <div className="dashboard-section">
          <div className="section-header">
            <h2>
              <i className="bi bi-person-circle"></i> Profil
            </h2>
          </div>
          <div className="section-content">
            <DashboardProfileCard
              user={user}
              avatarUrl={getPictureURLForPersonId(userId)}
              onEdit={handleEditProfile}
            />
          </div>
        </div>

        {/* Quick Actions Section */}
        <div className="dashboard-section">
          <div className="section-header">
            <h2>
              <i className="bi bi-lightning-charge"></i> Schnellzugriff
            </h2>
          </div>
          <div className="section-content">
            <QuickActions onAddPet={handleAddPet} />
          </div>
        </div>

        {/* Pets Section */}
        <div className="dashboard-section dashboard-section-full">
          <div className="section-header">
            <h2>
              <i className="bi bi-heart"></i> Meine Tiere
            </h2>
          </div>
          <div className="section-content">
            <DashboardPetsSection userId={userId} />
          </div>
        </div>

        {/* Appointments Section */}
        <div className="dashboard-section dashboard-section-full">
          <div className="section-header">
            <h2>
              <i className="bi bi-calendar-check"></i> Termine
            </h2>
          </div>
          <div className="section-content">
            <DashboardAppointmentsSection userId={userId} />
          </div>
        </div>
      </div>

      {/* Animal Dialog */}
      {showAddPetDialog && (
        <AnimalEditNewDialog
          hideDialogNewAnimal={() => setShowAddPetDialog(false)}
          animalEdit={undefined}
        />
      )}

      {/* Profile Edit Dialog */}
      {showEditProfileDialog && user && (
        <ProfileEditDialog
          hideDialog={() => setShowEditProfileDialog(false)}
          person={user}
        />
      )}
    </div>
  )
}
