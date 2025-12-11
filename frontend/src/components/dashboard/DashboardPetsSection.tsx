import { useEffect, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { getAnimalsFromUser } from '../../api/AnimalsAPI'
import {
  getFutureAppointmentsByUserId,
  getPastAppointmentsByUserId,
} from '../../api/AppointmentsAPI'
import { AnimalEditNewDialog } from '../animal/AnimalEditNewDialog'
import { PetCard } from './PetCard'
import type {
  AnimalsType,
  AppointmentsType,
} from '../../../../shared/schemas/ZodSchemas'
import '../../styles/components/dashboard/DashboardPetsSection.scss'

type DashboardPetsSectionProps = {
  userId: number
  onAnimalsLoaded?: (hasAnimals: boolean) => void
}

export function DashboardPetsSection({ userId, onAnimalsLoaded }: DashboardPetsSectionProps) {
  const [showAnimalDialog, setShowAnimalDialog] = useState(false)
  const [editAnimal, setEditAnimal] = useState<AnimalsType | undefined>(
    undefined,
  )

  // Fetch 
  const { data: animals = [], isLoading } = useQuery<Array<AnimalsType>>({
    queryKey: ['animals', userId],
    queryFn: () => getAnimalsFromUser(userId),
  })

  useEffect(() => {
    if (!isLoading) {
      onAnimalsLoaded?.(animals.length > 0)
    }
  }, [animals, isLoading, onAnimalsLoaded])

  // Fetch all appointments (past and future) to determine last treatment
  const { data: pastAppointments = [] } = useQuery<Array<AppointmentsType>>({
    queryKey: ['appointmentsPast', userId],
    queryFn: () => getPastAppointmentsByUserId(userId.toString()),
  })

  const { data: futureAppointments = [] } = useQuery<Array<AppointmentsType>>({
    queryKey: ['appointmentsFuture', userId],
    queryFn: () => getFutureAppointmentsByUserId(userId.toString()),
  })

  const handleAddPet = () => {
    setEditAnimal(undefined)
    setShowAnimalDialog(true)
  }

  const handleEditPet = (animal: AnimalsType) => {
    setEditAnimal(animal)
    setShowAnimalDialog(true)
  }

  const handleCloseDialog = () => {
    setShowAnimalDialog(false)
    setEditAnimal(undefined)
  }

  // Calculate vaccination status (simplified - based on age)
  const getVaccinationStatus = (animal: AnimalsType): 'overdue' | 'current' => {
    if (!animal.dateOfBirth) return 'current'

    const monthsSinceBirth = Math.floor(
      (Date.now() - new Date(animal.dateOfBirth).getTime()) /
        (1000 * 60 * 60 * 24 * 30),
    )
    // Simple logic: if pet is older than 12 months, assume vaccination might be due
    return monthsSinceBirth > 12 ? 'overdue' : 'current'
  }

  // Get last appointment date for an animal
  const getLastTreatment = (animalId: number): Date | undefined => {
    const animalAppts = pastAppointments
      .filter((a) => a.animal?.id === animalId)
      .sort(
        (a, b) =>
          new Date(b.startTime).getTime() - new Date(a.startTime).getTime(),
      )

    return animalAppts[0]?.startTime
  }

  // Get next appointment date for an animal
  const getNextAppointment = (animalId: number): Date | undefined => {
    const animalAppts = futureAppointments
      .filter((a) => a.animal?.id === animalId)
      .sort(
        (a, b) =>
          new Date(a.startTime).getTime() - new Date(b.startTime).getTime(),
      )

    return animalAppts[0]?.startTime
  }

  if (isLoading) {
    return <div className="pets-loading">Lade Tiere...</div>
  }

  return (
    <div className="dashboard-pets-section">
      {animals.length === 0 ? (
        <div className="pets-empty-state">
          <div className="empty-icon">
            <i className="bi bi-emoji-frown"></i>
          </div>
          <h3>Noch keine Tiere registriert</h3>
          <p>
            Fügen Sie Ihr erstes Tier hinzu, um Termine zu buchen und Ihre
            Haustiere zu verwalten.
          </p>
          <button className="btn btn-primary" onClick={handleAddPet}>
            <i className="bi bi-plus-circle"></i> Erstes Tier hinzufügen
          </button>
        </div>
      ) : (
        <div className="pets-grid">
          {animals.map((animal) => (
            <PetCard
              key={animal.id}
              animal={animal}
              vaccinationStatus={getVaccinationStatus(animal)}
              lastTreatment={getLastTreatment(animal.id)}
              nextAppointment={getNextAppointment(animal.id)}
              onEdit={handleEditPet}
            />
          ))}
        </div>
      )}

      {showAnimalDialog && (
        <AnimalEditNewDialog
          hideDialogNewAnimal={handleCloseDialog}
          animalEdit={editAnimal}
        />
      )}
    </div>
  )
}
