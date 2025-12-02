import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { DashboardProfileCard } from '../components/dashboard/DashboardProfileCard'
import { QuickActions } from '../components/dashboard/QuickActions'
import { DashboardPetsSection } from '../components/dashboard/DashboardPetsSection'
import { DashboardAppointmentsSection } from '../components/dashboard/DashboardAppointmentsSection'
import { AnimalEditNewDialog } from '../components/animal/AnimalEditNewDialog'
import '../styles/routes/dashboard.scss'
import { useLoginContext } from '../LoginContext'
import type { PersonsType } from '../../../shared/schemas/ZodSchemas'

export const Route = createFileRoute('/dashboard')({
  component: Dashboard,
})

function Dashboard() {
  const { login } = useLoginContext()
  if (!login) {
    return
  }

  const userId = login.id

  // Dummy user data - will be replaced with real API call in Phase 10
  const dummyUser: PersonsType = {
    id: userId,
    firstName: 'Max',
    lastName: 'Mustermann',
    email: 'max.mustermann@example.com',
    phone: '+49 30 12345678',
    dateOfBirth: new Date('1990-01-15'),
    sex: 'male',
    address: {
      id: 1,
      street: 'Musterstraße 123',
      city: 'Berlin',
      cityCode: '10115',
      country: 'Deutschland',
      latitude: 52.52,
      longitude: 13.405,
    },
  }

  const [showAddPetDialog, setShowAddPetDialog] = useState(false)

  const handleEditProfile = () => {
    // Will be implemented in Phase 10
    console.log('Edit profile clicked')
  }

  const handleAddPet = () => {
    setShowAddPetDialog(true)
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
            <DashboardProfileCard user={dummyUser} onEdit={handleEditProfile} />
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
    </div>
  )
}
