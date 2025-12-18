import { Link } from '@tanstack/react-router'
import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { getPictureFromAnimal } from '../../api/AnimalsAPI'
import { AnimalDeleteDialog } from '../animal/AnimalDeleteDialog'
import { mapMonthsToAgeRange } from '../../utils/AgeRangeMapper'
import type { PetCardProps } from '../../types/dashboard'
import '../../styles/components/dashboard/PetCard.scss'

export function PetCard({
  animal,
  vaccinationStatus,
  lastTreatment,
  nextAppointment,
  onEdit,
}: PetCardProps) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)

  // fetch animal picture
  const { data: animalPictureData, isSuccess: isSuccessPictureData } = useQuery({
    queryKey: ['animalPicture', 'PetCard', animal.id],
    queryFn: () => getPictureFromAnimal(animal.id),
    staleTime: 0,
  })

  const handleDelete = () => {
    setShowDeleteDialog(true)
  }

  const handleCloseDelete = () => {
    setShowDeleteDialog(false)
  }
  // Calculate age from date of birth
  const getAge = () => {
    if (!animal.dateOfBirth) return 'Unbekannt'

    const now = new Date()
    const birth = new Date(animal.dateOfBirth)
    const years = now.getFullYear() - birth.getFullYear()
    const months = now.getMonth() - birth.getMonth()
    const totalMonths = years * 12 + months

    // If approximate age, return original range
    if (!animal.dateOfBirthIsExact) {
      return mapMonthsToAgeRange(totalMonths)
    }

    // Exact age display
    if (totalMonths < 12) {
      return `${totalMonths} Monat${totalMonths !== 1 ? 'e' : ''}`
    }
    return `${years} Jahr${years !== 1 ? 'e' : ''}`
  }

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('de-DE', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }
  if (isSuccessPictureData) {
    return (
      <div className="pet-card">
        <div className="pet-card-header">
          <div className="pet-image">
            <img
              src={animalPictureData}
              alt={animal.name}
              className="rounded-circle"
            />
          </div>
          <div className="pet-card-actions">
            <button
              className="pet-edit-btn"
              onClick={() => onEdit(animal)}
              title="Bearbeiten"
            >
              <i className="bi bi-pencil"></i>
            </button>
            <button
              className="pet-delete-btn"
              onClick={handleDelete}
              title="Löschen"
            >
              <i className="bi bi-trash"></i>
            </button>
          </div>
        </div>

        <div className="pet-card-body">
          <h4 className="pet-name">{animal.name}</h4>
          <div className="pet-detail">
            <i className="bi bi-info-circle"></i>
            <span>Alter: {getAge()}</span>
          </div>

          {/* Vaccination Status */}
          <div
            className={`pet-status ${vaccinationStatus === 'overdue' ? 'pet-status-warning' : 'pet-status-success'}`}
          >
            <i
              className={`bi ${vaccinationStatus === 'overdue' ? 'bi-exclamation-triangle' : 'bi-check-circle'}`}
            ></i>
            <span>
              {vaccinationStatus === 'overdue'
                ? 'Impfung überfällig'
                : 'Impfung aktuell'}
            </span>
          </div>

          {/* Appointments */}
          <div className="pet-appointments">
            {/* Letzter Termin */}
            <div className="pet-detail">
              <i className="bi bi-calendar-check"></i>
              <span>
                {lastTreatment
                  ? `Letzter Termin: ${formatDate(lastTreatment)}`
                  : 'Letzter Termin: Keine Termine'}
              </span>
            </div>

            {/* Nächster Termin */}
            <div className="pet-detail">
              <i className="bi bi-calendar-event"></i>
              <span>Nächster Termin: </span>
              {nextAppointment ? (
                <span>{formatDate(nextAppointment)}</span>
              ) : (
                <Link
                  to="/search"
                  search={{
                    name: '',
                    address: '',
                    animalType: '',
                    serviceType: '',
                  }}
                  className="book-link"
                >
                  Vereinbaren
                </Link>
              )}
            </div>
          </div>
        </div>

        {showDeleteDialog && (
          <AnimalDeleteDialog
            hideDialogDeleteAnimal={handleCloseDelete}
            animalDelete={animal}
          />
        )}
      </div>
    )
  }
}
