import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { DashboardHeader } from '../components/dashboard/DashboardHeader'
import { DashboardPetsSection } from '../components/dashboard/DashboardPetsSection'
import { DashboardAppointmentsSection } from '../components/dashboard/DashboardAppointmentsSection'
import { DashboardFavoritesSection } from '../components/dashboard/DashboardFavoritesSection'
import { AnimalEditNewDialog } from '../components/animal/AnimalEditNewDialog'
import { ProfileEditDialog } from '../components/profile/ProfileEditDialog'
import '../styles/routes/dashboard.scss'
import { useLoginContext } from '../LoginContext'
import { getPersonById, getPictureURLForPersonId } from '../api/PersonsAPI'
import type { PersonsType } from '../../../shared/schemas/ZodSchemas'

export const Route = createFileRoute('/dashboard')({
  component: Dashboard,
})

function Dashboard() {
  const navigate = useNavigate()
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

  const handleBookAppointment = () => {
    navigate({
      to: '/search',
      search: {
        name: '',
        address: '',
        animalType: '',
        serviceType: '',
      },
    })
  }

  if (isLoadingUser || !user) {
    return <div>Loading...</div>
  }

  return (
    <>
      <div className="dashboard-page">
        {/* Header with greeting + profile */}
        <DashboardHeader
          user={user}
          avatarUrl={getPictureURLForPersonId(userId)}
          onEditProfile={handleEditProfile}
        />

        {/* Main sections grid */}
        <div className="dashboard-grid">
          {/* Appointments Section */}
          <div className="dashboard-section dashboard-section-full">
            <div className="section-header">
              <h2>
                <i className="bi bi-calendar-check"></i> Termine
              </h2>
              <button
                className="btn btn-primary"
                onClick={handleBookAppointment}
              >
                <i className="bi bi-plus-circle"></i> Termin buchen
              </button>
            </div>
            <div className="section-content">
              <DashboardAppointmentsSection userId={userId} />
            </div>
          </div>

          {/* Pets Section */}
          <div className="dashboard-section dashboard-section-full">
            <div className="section-header">
              <h2>
                <i className="bi bi-paw"></i> Meine Tiere
              </h2>
              <button
                className="btn btn-primary btn-add-pet"
                onClick={handleAddPet}
              >
                <i className="bi bi-plus-circle"></i> Tier hinzufügen
              </button>
            </div>
            <div className="section-content">
              <DashboardPetsSection userId={userId} />
            </div>
          </div>

          {/* Favorites Section */}
          <div className="dashboard-section dashboard-section-full">
            <div className="section-header">
              <h2>
                <i className="bi bi-star"></i> Favoriten
              </h2>
            </div>
            <div className="section-content">
              <DashboardFavoritesSection userId={userId} />
            </div>
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
    </>
  )
}
