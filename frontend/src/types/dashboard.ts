import type {
  AnimalsType,
  PersonsType,
} from '../../../shared/schemas/ZodSchemas'

export type NotificationType = {
  id: number
  type: 'vaccination' | 'appointment'
  message: string
  date: Date
  animalId?: number
}

export type DashboardStatsType = {
  totalPets: number
  upcomingAppointments: number
  totalAppointmentsThisYear: number
}

export type PetCardProps = {
  animal: AnimalsType
  vaccinationStatus: 'overdue' | 'current'
  lastTreatment?: Date
  nextAppointment?: Date
  onEdit: (animal: AnimalsType) => void
}

export type DashboardProfileCardProps = {
  user: PersonsType
  avatarUrl?: string
  onEdit: () => void
}

export type DashboardNotificationsProps = {
  notifications: Array<NotificationType>
}

export type QuickActionsProps = {
  onAddPet: () => void
}

export type DashboardStatsProps = {
  stats: DashboardStatsType
}

export type FavoritePracticeCardProps = {
  practiceId: number
  onRemove: (practiceId: number) => void
}
