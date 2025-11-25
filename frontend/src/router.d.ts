import '@tanstack/react-router'
import type {
  AnimalsType,
  AppointmentsType,
  ServiceType,
  VeterinaryPracticesType,
} from '../../shared/schemas/ZodSchemas'

// erweitert History State, damit Praxis auch als State uebergeben werden kann
declare module '@tanstack/react-router' {
  interface HistoryState {
    praxis?: VeterinaryPracticesType // TODO changed to practice
    practice?: VeterinaryPracticesType,
    termin?: AppointmentsType //TODO changed to appointment
    appointment?: AppointmentsType
    selectedAnimal?: AnimalsType,
    selectedService?: ServiceType,
  }
}
