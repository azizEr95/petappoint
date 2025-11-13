import { prisma } from "../singletonPC";
import { appointments } from "../../generated/prisma";
import { AppointmentsType } from "../schemas/ZodSchemas";

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
      },
    });

    if (!foundAppointment) throw new Error(`Appointment not found with id: ${id}`);

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
      },
    });
  },

  async getAppointmentsByVeterinary(veterinaryId: number): Promise<AppointmentsType[]> {
    return await prisma.appointments.findMany({
      where: { fk_veterinaryid: veterinaryId },
      include: {
        animals: true,
        veterinaries: true,
      },
    });
  },

  async getForPractice(veterinaryPracticeId: number): Promise<AppointmentsType[]> {
    return await prisma.appointments.findMany({
      where: { fk_veterinarypracticeid: veterinaryPracticeId},
      include: {
        animals: true,
        veterinaries: true,
      },
    });
  },

  async getAvailableAppointmentsForPractice(veterinaryPracticeId: number): Promise<appointments[]> {
    return await prisma.appointments.findMany({
      where: { fk_veterinarypracticeid: veterinaryPracticeId, fk_animalid: null},
      include: {
        animals: true,
        veterinaries: true,
      },
    });
  },

  async getAll(): Promise<AppointmentsType[]> {
    return await prisma.appointments.findMany();
  },

  async update(data: appointments): Promise<appointments> {
    if (!data.id) throw new Error("ID is required for update");

    return await prisma.appointments.update({ where: { id: data.id }, data: data });
  },

  async delete(id: number): Promise<void> {
    await prisma.appointments.delete({ where: { id } });
  },
};
