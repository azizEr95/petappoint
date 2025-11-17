import { prisma } from "../singletonPC";
import { appointments } from "../../generated/prisma";
import { AppointmentsType } from "vetlib-shared/schemas/ZodSchemas";
import { animalService } from "./animalService";

export const appointmentService = {
  async create(data: appointments): Promise<AppointmentsType> {
    return await prisma.appointments.create({
      data: {
        starttime: data.starttime,
        endtime: data.endtime,
        animals: data.fk_animalid ? { connect: { id: data.fk_animalid } } : undefined, // Prüfung geschieht hier. Soll das aber optional sein oder einen Fehler werfen, wenn kein Tier verknüpft?
        veterinaries: { connect: { id: data.fk_veterinaryid } },
        veterinarypractices: { connect: { id: data.fk_veterinarypracticeid } },
      },
    });
  },

  async getById(id: number): Promise<AppointmentsType> {
    const foundAppointment = await prisma.appointments.findUnique({
      where: { id },
      include: {
        animals: true,
        veterinaries: true,
        services: true
      },
    });

    if (!foundAppointment) {
      throw new Error(`Appointment not found with id: ${id}`);
    }

    return foundAppointment;
  },

  async getAppointmentsByDateRange(startDate: Date, endDate: Date): Promise<AppointmentsType[]> {
    return await prisma.appointments.findMany({
      where: {
        starttime: {
          gte: startDate,
          lte: endDate,
        },
      },
      include: {
        animals: true,
        veterinaries: true,
        services: false
      },
    });
  },

  async getAppointmentsByVeterinary(veterinaryId: number): Promise<AppointmentsType[]> {
    return await prisma.appointments.findMany({
      where: { fk_veterinaryid: veterinaryId },
      include: {
        animals: true,
        veterinaries: true,
        services: true
      },
    });
  },

  async getForPractice(veterinaryPracticeId: number): Promise<AppointmentsType[]> {
    return await prisma.appointments.findMany({
      where: { fk_veterinarypracticeid: veterinaryPracticeId },
      include: {
        animals: true,
        veterinaries: true,
        services: true
      },
    });
  },

  async getAvailableAppointmentsForPractice(veterinaryPracticeId: number): Promise<AppointmentsType[]> {
    return await prisma.appointments.findMany({
      where: { fk_veterinarypracticeid: veterinaryPracticeId, fk_animalid: null },
      include: {
        animals: true,
        veterinaries: true,
        services: true
      },
    });
  },

  async getPastAppointmentsForPerson(personId: number): Promise<AppointmentsType[]> {
    const now = new Date();
    const animals = await animalService.getByPersonId(personId);

    if (animals.length == 0) {
      return [];
    }

    const animalIds = animals.map(a => a.id);
    const appointments = await prisma.appointments.findMany({
      where: {
        fk_animalid: {
          in: animalIds // in the list
        },
        starttime: {
          lt: now // less than
        }
      },
      include: {
        animals: true,
        veterinaries: true,
        services: true
      }
    });

    return appointments;
  },

  async getFutureAppointmentsForPerson(personId: number) {
    const now = new Date();
    const animals = await animalService.getByPersonId(personId);

    if (animals.length == 0) {
      return [];
    }

    const animalIds = animals.map(a => a.id);
    const appointments = await prisma.appointments.findMany({
      where: {
        fk_animalid: {
          in: animalIds
        },
        starttime: {
          gt: now // greater than
        }
      },
      include: {
        animals: true,
        veterinaries: true,
        services: true
      }
    });

    return appointments;
  },

  async getAll(): Promise<AppointmentsType[]> {
    return await prisma.appointments.findMany();
  },

  async update(data: appointments): Promise<AppointmentsType> {
    if (!data.id) {
      throw new Error("ID is required for update");
    }

    return await prisma.appointments.update({ where: { id: data.id }, data: data });
  },

  async updateAppointmentAsPerson(id: number, fk_animalid: number): Promise<AppointmentsType> {
    // check if dto is complete
    if (!id || !fk_animalid) throw new Error("ID and AnimalID is required for update");

    // check if appointment is available
    const appointment = await prisma.appointments.findUnique({
      where: {
        id: id
      }
    })

    if (appointment?.fk_animalid) throw new Error("Termin is already taken");

    return await prisma.appointments.update({
      where: {
        id: id
      },
      data: {
        fk_animalid: fk_animalid
      }
    })
  },

  async delete(id: number): Promise<void> {
    await prisma.appointments.delete({ where: { id } });
  },
};
