import { AppointmentsType, ServiceType } from "vetilib-shared/schemas/ZodSchemas";

export function mapToAppointment(appointment: any): AppointmentsType {
    return {
        id: appointment.id,
        startTime: appointment.startTime,
        endTime: appointment.endTime,
        animal: appointment.animal
          ? {
            id: appointment.animal.id,
            name: appointment.animal.name,
            dateOfBirth: appointment.animal.dateOfBirth,
            dateOfBirthIsExact: appointment.animal.dateOfBirthIsExact,
            heightInCm: appointment.animal.heightInCm,
            weightInGram: appointment.animal.weightInGram,
            isCastrated: appointment.animal.isCastrated,
            lifestyle: appointment.animal.lifestyle,
            sex: appointment.animal.sex,
            timeOfDeath: appointment.animal.timeOfDeath,
            animalGroupId: appointment.animal.animalGroupId,
            animalTypeId: appointment.animal.animalTypeId,
          }
          : null,
        veterinaryPractice: {
          id: appointment.veterinaryPractice.id,
          address: appointment.veterinaryPractice.address,
          email: appointment.veterinaryPractice.email,
          info: appointment.veterinaryPractice.info,
          infoEmail: appointment.veterinaryPractice.infoEmail,
          name: appointment.veterinaryPractice.name,
          phone: appointment.veterinaryPractice.phone,
          website: appointment.veterinaryPractice.website,
        },
        veterinary: {
          id: appointment.veterinarian.id,
          firstName: appointment.veterinarian.person.firstName,
          lastName: appointment.veterinarian.person.lastName,
          infoEmail: appointment.veterinarian.infoEmail,
          veterinaryPracticeId: appointment.veterinaryPractice.id,
        },
        service: appointment.service
          ? {
            id: appointment.service.id,
            name: appointment.service.name,
          }
          : null,
        availableServices: getAvailableServices(appointment),
        notes: appointment.notes,
      };
}

function getAvailableServices(appointment: any): ServiceType[] {
    const availableServices: ServiceType[] =
          appointment.appointmentHasServices.length > 0
            ? appointment.appointmentHasServices.flatMap((x: any) => x.service)
            : appointment.veterinarian.veterinaryHasServices.flatMap((x: any) => x.service);
    return availableServices;
}