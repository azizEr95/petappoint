import '@tanstack/react-router';
import type { AppointmentsType, VeterinaryPracticesType } from '../../shared/schemas/ZodSchemas';

// erweitert History State, damit Praxis auch als State uebergeben werden kann
declare module '@tanstack/react-router' {
  interface HistoryState {
    praxis?: VeterinaryPracticesType;
    termin?: AppointmentsType;
  }
}