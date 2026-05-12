import { AppointmentsType, ServiceType } from "petappoint-shared/schemas/ZodSchemas";

import { Sexes } from "generated/prisma";
import { PersonsType } from "petappoint-shared/schemas/ZodSchemas";
import { AnimalPrismaMappedType, mapToAnimal } from "./mapToAnimal";
import { mapToVeterinaryPractice, VeterinaryPracticePrismaMappedType } from "./mapToVeterinaryPractice";
import { mapToVeterinary, VeterinaryPrismaMappedType } from "./mapToVeterinary";
import { mapToService, ServicePrismaMappedType } from "./mapToService";

export type AppointmentPrismaMappedType = {
  id: number,
  startTime: Date,
  endTime: Date,
  animal: AnimalPrismaMappedType | null,
  veterinaryPractice: VeterinaryPracticePrismaMappedType,
  veterinarian: VeterinaryPrismaMappedType & {
    veterinaryHasServices?: {
      veterinaryId: number,
      serviceId: number,
      notes: string | null,
      service: ServicePrismaMappedType
    }[],
    veterinaryCanTreatAnimalTypes?: {
      animalTypeId: number,
      veterinaryId: number
    }[]
  },
  service: ServicePrismaMappedType | null,
  notes: string | null,
  appointmentHasServices: {
    appointmentId: number,
    serviceId: number,
    service: ServicePrismaMappedType
  }[]
}

export function mapToAppointment(appointment: AppointmentPrismaMappedType): AppointmentsType {
  return {
    id: appointment.id,
    startTime: appointment.startTime,
    endTime: appointment.endTime,
    animal: appointment.animal ? mapToAnimal(appointment.animal) : null,
    veterinaryPractice: mapToVeterinaryPractice(appointment.veterinaryPractice),
    veterinary: mapToVeterinary(appointment.veterinarian),
    service: appointment.service
      ? mapToService(appointment.service)
      : null,
    availableServices: getAvailableServices(appointment),
    notes: appointment.notes,
  };
}

function getAvailableServices(appointment: AppointmentPrismaMappedType): ServiceType[] {
  if (appointment.appointmentHasServices.length > 0) {
    return appointment.appointmentHasServices.flatMap(x => mapToService(x.service));
  }

  if (appointment.veterinarian.veterinaryHasServices) {
    return appointment.veterinarian.veterinaryHasServices.flatMap(x => mapToService(x.service));
  }

  return [];
}