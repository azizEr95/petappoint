import { prisma } from "../singletonPC";
import { Appointment } from "../../generated/prisma";
import {
  AppointmentFilterType,
  AppointmentsCreateType,
  AppointmentsType,
} from "vetilib-shared/schemas/ZodSchemas";
import { animalService } from "./animalService";
import { ResourceNotFoundError } from "../exceptions/errors/ResourceNotFoundError";
import { ConstraintError } from "../exceptions/errors/ConstraintError";
import { APPOINTMENT_INCLUDE_BASE, APPOINTMENT_INCLUDE_WITH_VET_SERVICES } from "../helper/appointmentIncludes";
import { mapToAppointment } from "../helper/mapToAppointment";
import { createDateTime } from "../helper/createDateTime"

export const appointmentService = {
  async create(data: AppointmentsCreateType): Promise<AppointmentsType> {
    const created = await prisma.appointment.create({
      include: APPOINTMENT_INCLUDE_BASE,
      data: {
        startTime: data.startTime,
        endTime: data.endTime,
        veterinarian: { connect: { id: data.veterinaryId } },
        veterinaryPractice: { connect: { id: data.veterinaryPracticeId } },
      },
    });

    const appointmentId = created.id;
    await prisma.appointmentHasService.createMany({
      data: data.availableServiceIds.map(x => ({ serviceId: x, appointmentId: appointmentId })),
      skipDuplicates: true
    });
    return mapToAppointment(created);
  },

  async createWeeklyAppointments(data: AppointmentsCreateType, endDate: Date): Promise<AppointmentsType[]> {

    if (!endDate || !data.endTime || !data.startTime) {
      throw new Error("Zeiten müssen hier angegeben werden")
    }
    const differenceInMs = endDate.getTime() - data.startTime.getTime();
    const diffDays = differenceInMs / (1000 * 60 * 60 * 24);
    const diffWeeks = Math.floor(diffDays / 7);

    const appointmentsToCreate = []

    for (let week = 0; week <= diffWeeks; week++) {
      const weekStartTime = new Date(data.startTime);
      weekStartTime.setDate(weekStartTime.getDate() + (week * 7));

      const weekEndTime = new Date(data.endTime);
      weekEndTime.setDate(weekEndTime.getDate() + (week * 7));

      appointmentsToCreate.push({
        startTime: weekStartTime,
        endTime: weekEndTime,
        veterinaryId: data.veterinaryId,
        veterinaryPracticeId: data.veterinaryPracticeId,
      })
    };

    const createdAppointments = await Promise.all(appointmentsToCreate.map(async (apt) => {
      const created = await prisma.appointment.create({
        include: APPOINTMENT_INCLUDE_BASE,
        data: {
          startTime: apt.startTime,
          endTime: apt.endTime,
          veterinarian: { connect: { id: data.veterinaryId } },
          veterinaryPractice: { connect: { id: data.veterinaryPracticeId } },
        },
      });

      const appointmentId = created.id;
      await prisma.appointmentHasService.createMany({
        data: data.availableServiceIds.map(x => ({ serviceId: x, appointmentId: appointmentId })),
        skipDuplicates: true
      });
      return mapToAppointment(created)
    }))
    return createdAppointments;
  },


  async getById(id: number): Promise<AppointmentsType> {
    const foundAppointment = await prisma.appointment.findUnique({
      where: { id },
      include: APPOINTMENT_INCLUDE_WITH_VET_SERVICES,
    });

    if (!foundAppointment) {
      throw new Error(`Appointment not found with id: ${id}`);
    }

    return mapToAppointment(foundAppointment);
  },

  async getAppointmentsByDateRange(
    startDate: Date,
    endDate: Date,
    filter?: AppointmentFilterType
  ): Promise<AppointmentsType[]> {
    const found = await prisma.appointment.findMany({
      include: APPOINTMENT_INCLUDE_BASE,
      where: {
        startTime: {
          gte: startDate,
          lte: endDate,
        },
        // FILTER
        ...(filter &&
          filter.animalTypeIds && {
          veterinaryPractice: {
            veterinarians: {
              some: {
                veterinaryCanTreatAnimalTypes: {
                  some: {
                    animalTypeId: { in: filter.animalTypeIds },
                  },
                },
              },
            },
          },
        }),
        ...(filter &&
          filter.serviceTypeIds && {
          OR: [
            { serviceId: { in: filter.serviceTypeIds } },
            {
              serviceId: null,
              service: {
                id: {
                  in: filter.serviceTypeIds,
                },
              },
            },
          ],
        }),
      },
    });

    return found.map((foundAppointment) => mapToAppointment(foundAppointment));
  },

  async getAppointmentsByVeterinary(
    veterinaryId: number,
    filter?: AppointmentFilterType,
    includePast: boolean = false,
    includeUnbooked: boolean = false
  ): Promise<AppointmentsType[]> {
    const found = await prisma.appointment.findMany({
      where: {
        veterinaryId: veterinaryId,
        ...(!includePast && {
          endTime: {
            gte: new Date()
          }
        }),
        ...(!includeUnbooked && {
          NOT: {
            animalId: null,
            serviceId: null
          }
        }
        ),
        ...(filter &&
          filter.animalTypeIds && {
          veterinaryPractice: {
            veterinarians: {
              some: {
                veterinaryCanTreatAnimalTypes: {
                  some: {
                    animalTypeId: { in: filter.animalTypeIds },
                  },
                },
              },
            },
          },
        }),
        ...(filter?.serviceTypeIds && {
          OR: [
            { serviceId: { in: filter.serviceTypeIds } },
            {
              serviceId: null,
              service: {
                id: {
                  in: filter.serviceTypeIds,
                },
              },
            },
          ],
        }),
      },
      include: APPOINTMENT_INCLUDE_BASE,
    });

    return found.map((foundAppointment) => mapToAppointment(foundAppointment));
  },

  async getForPractice(
    veterinaryPracticeId: number,
    filter?: AppointmentFilterType
  ): Promise<AppointmentsType[]> {
    const found = await prisma.appointment.findMany({
      include: APPOINTMENT_INCLUDE_BASE,
      where: {
        veterinaryPracticeId: veterinaryPracticeId,
        // FILTER
        ...(filter &&
          filter.animalTypeIds && {
          veterinaryPractice: {
            veterinarians: {
              some: {
                veterinaryCanTreatAnimalTypes: {
                  some: {
                    animalTypeId: { in: filter.animalTypeIds },
                  },
                },
              },
            },
          },
        }),
        ...(filter &&
          filter.serviceTypeIds && {
          OR: [
            { serviceId: { in: filter.serviceTypeIds } },
            {
              serviceId: null,
              service: {
                id: {
                  in: filter.serviceTypeIds,
                },
              },
            },
          ],
        }),
      },
    });

    return found.map((foundAppointment) => mapToAppointment(foundAppointment));
  },

  async getAvailableAppointmentsForPractice(
    veterinaryPracticeId: number,
    filter?: AppointmentFilterType
  ): Promise<AppointmentsType[]> {
    const found = await prisma.appointment.findMany({
      include: APPOINTMENT_INCLUDE_WITH_VET_SERVICES,
      where: {
        veterinaryPracticeId: veterinaryPracticeId,
        animalId: null,
        serviceId: null,
        // FILTER
        ...(filter &&
          filter.animalTypeIds &&
          filter.animalTypeIds.length > 0 && {
          veterinarian: {
            veterinaryCanTreatAnimalTypes: {
              some: {
                animalTypeId: { in: filter.animalTypeIds },
              }
            }
          }
        }),
        ...(filter &&
          filter.serviceTypeIds &&
          filter.serviceTypeIds.length > 0 && {
          OR: [
            {
              appointmentHasServices: {
                some: {
                  serviceId: { in: filter.serviceTypeIds },
                },
              },
            },
            {
              appointmentHasServices: { none: {} },
              veterinarian: {
                veterinaryHasServices: {
                  some: {
                    serviceId: { in: filter.serviceTypeIds },
                  },
                },
              },
            },
          ],
        }),
      },
    });

    return found.map((foundAppointment) => mapToAppointment(foundAppointment));
  },

  async getBookedAppointmentsForPractice(
    veterinaryPracticeId: number,
    filter?: AppointmentFilterType,
    includePast: boolean = false
  ): Promise<AppointmentsType[]> {
    const found = await prisma.appointment.findMany({
      include: APPOINTMENT_INCLUDE_WITH_VET_SERVICES,
      where: {
        veterinaryPracticeId: veterinaryPracticeId,
        NOT: {
          animalId: null,
          serviceId: null
        },
        ...(!includePast && {
          endTime: {
            gte: new Date()
          }
        }
        ),
        ...(filter &&
          filter.animalTypeIds &&
          filter.animalTypeIds.length > 0 && {
          veterinarian: {
            veterinaryCanTreatAnimalTypes: {
              some: {
                animalTypeId: { in: filter.animalTypeIds },
              }
            }
          }
        }),
        ...(filter &&
          filter.serviceTypeIds &&
          filter.serviceTypeIds.length > 0 && {
          OR: [
            {
              appointmentHasServices: {
                some: {
                  serviceId: { in: filter.serviceTypeIds },
                },
              },
            },
            {
              appointmentHasServices: { none: {} },
              veterinarian: {
                veterinaryHasServices: {
                  some: {
                    serviceId: { in: filter.serviceTypeIds },
                  },
                },
              },
            },
          ],
        }),
      },
    });

    return found.map((foundAppointment) => mapToAppointment(foundAppointment));
  },

  async getPastAppointmentsForPerson(
    personId: number,
    filter?: AppointmentFilterType
  ): Promise<AppointmentsType[]> {
    const now = new Date();
    const animals = await animalService.getByPersonId(personId);

    if (animals.length == 0) {
      return [];
    }

    const animalIds = animals.map((a) => a.id);
    const appointments = await prisma.appointment.findMany({
      include: APPOINTMENT_INCLUDE_BASE,
      where: {
        animalId: {
          in: animalIds,
        },
        startTime: {
          lt: now,
        },
        // FILTER
        ...(filter &&
          filter.animalTypeIds && {
          veterinaryPractice: {
            veterinarians: {
              some: {
                veterinaryCanTreatAnimalTypes: {
                  some: {
                    animalTypeId: { in: filter.animalTypeIds },
                  },
                },
              },
            },
          },
        }),
        ...(filter &&
          filter.serviceTypeIds && {
          serviceId: { in: filter.serviceTypeIds },
        }),
      },
    });

    return appointments.map((foundAppointment) => mapToAppointment(foundAppointment));
  },

  async getFutureAppointmentsForPerson(
    personId: number,
    filter?: AppointmentFilterType
  ): Promise<AppointmentsType[]> {
    const now = new Date();
    const animals = await animalService.getByPersonId(personId);

    if (animals.length == 0) {
      return [];
    }

    const animalIds = animals.map((a) => a.id);
    const appointments = await prisma.appointment.findMany({
      include: APPOINTMENT_INCLUDE_BASE,
      where: {
        animalId: {
          in: animalIds,
        },
        startTime: {
          gt: now,
        },
        // FILTER
        ...(filter &&
          filter.animalTypeIds && {
          veterinaryPractice: {
            veterinarians: {
              some: {
                veterinaryCanTreatAnimalTypes: {
                  some: {
                    animalTypeId: { in: filter.animalTypeIds },
                  },
                },
              },
            },
          },
        }),
        ...(filter &&
          filter.serviceTypeIds && {
          serviceId: { in: filter.serviceTypeIds },
        }),
      },
    });

    return appointments.map((foundAppointment) => mapToAppointment(foundAppointment));
  },

  async getAll(): Promise<AppointmentsType[]> {
    const found = await prisma.appointment.findMany({
      include: APPOINTMENT_INCLUDE_BASE,
    });

    return found.map((foundAppointment) => mapToAppointment(foundAppointment));
  },

  async update(data: Appointment): Promise<AppointmentsType> {
    if (!data.id) {
      throw new Error("ID is required for update");
    }

    const updated = await prisma.appointment.update({
      include: APPOINTMENT_INCLUDE_BASE,
      where: { id: data.id },
      data: data,
    });

    return mapToAppointment(updated);
  },

  async updateAppointmentAsPerson(
    id: number,
    animalId: number,
    serviceId: number
  ): Promise<AppointmentsType> {
    const appointment = await prisma.appointment.findUnique({
      where: { id },
    });

    if (!appointment) {
      throw new ResourceNotFoundError(
        `Appointment with id(${id}) does not exist`,
        "id",
        id
      );
    }

    if (appointment.animalId) {
      throw new ConstraintError("Appointment is already taken.", [
        {
          path: "id",
          value: id,
        },
      ]);
    }

    const updated = await prisma.appointment.update({
      include: APPOINTMENT_INCLUDE_BASE,
      where: { id },
      data: {
        animalId: animalId,
        serviceId: serviceId,
      },
    });

    return mapToAppointment(updated);
  },

  async delete(id: number): Promise<void> {
    await prisma.appointment.delete({ where: { id } });
  },

  async cancelAppointmentAsPerson(id: number): Promise<AppointmentsType> {
    const updated = await prisma.appointment.update({
      include: APPOINTMENT_INCLUDE_BASE,
      where: { id },
      data: {
        animalId: null,
        serviceId: null,
      },
    });

    return mapToAppointment(updated);
  },

  async updateNotes(id: number, notes: string | null): Promise<AppointmentsType> {
    const updated = await prisma.appointment.update({
      include: APPOINTMENT_INCLUDE_BASE,
      where: { id },
      data: { notes },
    });

    return mapToAppointment(updated);
  },

  async updateAvailableAppointment(
    id: number,
    data: {
      startTime?: Date;
      endTime?: Date;
      veterinaryId?: number;
      availableServiceIds?: number[];
    }
  ): Promise<AppointmentsType> {

    const foundAppointment = await prisma.appointment.findUnique({
      where: { id },
    });

    if (!foundAppointment) {
      throw new ResourceNotFoundError(`Appointment with id(${id}) does not exist`, "updateAvailableAppointment");
    }

    if (foundAppointment.animalId !== undefined) {
      throw new Error(`Cannot update a booked appointment`)
    }

    if (foundAppointment.startTime < new Date()) {
      throw new Error(`Cannot update a past appointment`)
    }

    if (data.availableServiceIds !== undefined && data.availableServiceIds.length > 0) {
      await prisma.appointmentHasService.deleteMany({
        where: { appointmentId: foundAppointment.id },
      });

      await prisma.appointmentHasService.createMany({
        data: data.availableServiceIds.map(serviceId => ({
          serviceId,
          appointmentId: id,
        })),
        skipDuplicates: true,
      });
    }

    const updated = await prisma.appointment.update({
      include: APPOINTMENT_INCLUDE_BASE,
      where: { id: foundAppointment.id },
      data: {
        startTime: data.startTime ? data.startTime : foundAppointment.startTime,
        endTime: data.endTime ? data.endTime : foundAppointment.endTime,
        veterinaryId: data.veterinaryId ? data.veterinaryId : foundAppointment.veterinaryId,
      }
    });

    return mapToAppointment(updated);
  },

  async canCompanyDeleteAppointment(companyId: number, appointmentId: number): Promise<boolean> {
    const appointment = await prisma.appointment.findUnique({
      where: {
        id: appointmentId
      },
      select: {
        veterinaryPracticeId: true
      }
    });

    if (!appointment) {
      throw new ResourceNotFoundError(`No appointment found with id: ${appointmentId}`, 'appointmentId', appointmentId);
    }

    return appointment.veterinaryPracticeId === companyId;
  },

  async canPersonAccessAppointment(
    personId: number,
    appointmentId: number
  ): Promise<boolean> {
    const appointment = await prisma.appointment.findUnique({
      where: { id: appointmentId },
      select: { animalId: true },
    });

    if (!appointment) {
      return false;
    }

    if (!appointment.animalId) {
      return true;
    }

    return animalService.canPersonAccessAnimal(personId, appointment.animalId);
  },

  async canPersonEditAppointment(
    personId: number,
    appointmentId: number
  ): Promise<boolean> {
    const appointment = await prisma.appointment.findUnique({
      where: { id: appointmentId },
      select: { animalId: true },
    });

    if (!appointment) {
      return false;
    }

    if (!appointment.animalId) {
      return false;
    }

    return animalService.canPersonAccessAnimal(personId, appointment.animalId);
  },
};
