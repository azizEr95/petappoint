import '@tanstack/react-router'
import type {
  AnimalsType,
  AppointmentFilterType,
  AppointmentsType,
  PersonsType,
  ServiceType,
  VeterinaryPracticesType,
} from 'vetilib-shared/schemas/ZodSchemas'

// erweitert History State, damit Praxis auch als State uebergeben werden kann
declare module '@tanstack/react-router' {
  interface HistoryState {
    practice?: VeterinaryPracticesType
    termin?: AppointmentsType // TODO changed to appointment
    appointment?: AppointmentsType
    serviceType?: Array<number> | null
    selectedAnimal?: AnimalsType
    selectedService?: ServiceType
    filterOptions?: AppointmentFilterType
    filterAnimalId?: number | undefined
    filterAnimalTypeId?: number | undefined
    person?: PersonsType
    selectedAppointmentId?: number
    initialTab?: 'upcoming' | 'past'
    fromDashboard?: boolean
  }
}
