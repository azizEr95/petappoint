import { prisma } from "../singletonPC";
import { AppointmentResource } from "src/Resource";

export const appointmentService = {
  // Create
  async create(data: AppointmentResource): Promise<AppointmentResource> {
    const createdAppointment = await prisma.appointments.create({
      data: {
        starttime: data.startTime,
        endtime: data.endTime,
        fk_animalid: data.animalId,
        fk_veterinaryid: data.veterinaryId,
      },
    });

    return mapAppointmentToResource(createdAppointment);
  },

  // Read by ID
  async getById(id: number): Promise<AppointmentResource> {
    const foundAppointment = await prisma.appointments.findUnique({
      where: { id },
      include: {
        animals: true, // Optional: Tier-Details
        veterinaries: true, // Optional: Tierarzt-Details
      },
    });

    if (!foundAppointment) {
      throw new Error(`Appointment not found with id: ${id}`);
    }

    return mapAppointmentToResource(foundAppointment);
  },

  // Update
  async update(data: AppointmentResource): Promise<AppointmentResource> {
    if (!data.id) {
      throw new Error("ID is required for update");
    }

    const updatedAppointment = await prisma.appointments.update({
      where: { id: data.id },
      data: {
        starttime: data.startTime,
        endtime: data.endTime,
        fk_animalid: data.animalId,
        fk_veterinaryid: data.veterinaryId,
      },
    });

    return mapAppointmentToResource(updatedAppointment);
  },

  // Delete
  async delete(id: number): Promise<void> {
    await prisma.appointments.delete({
      where: { id },
    });
  },

  // List all appointments
  async getAll(): Promise<AppointmentResource[]> {
    const appointments = await prisma.appointments.findMany({
      include: {
        animals: true,
        veterinaries: true,
      },
    });
    return appointments.map(mapAppointmentToResource);
  },

  // Find appointments by date range
  async getAppointmentsByDateRange(
    startDate: Date,
    endDate: Date
  ): Promise<AppointmentResource[]> {
    const appointments = await prisma.appointments.findMany({
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
    return appointments.map(mapAppointmentToResource);
  },

  // Find appointments by veterinary
  async getAppointmentsByVeterinary(
    veterinaryId: number
  ): Promise<AppointmentResource[]> {
    const appointments = await prisma.appointments.findMany({
      where: { fk_veterinaryid: veterinaryId },
      include: {
        animals: true,
        veterinaries: true,
      },
    });
    return appointments.map(mapAppointmentToResource);
  },
};

// Helper function to map Prisma appointments to resource
function mapAppointmentToResource(appointment: any): AppointmentResource {
  return {
    id: appointment.id,
    startTime: appointment.starttime,
    endTime: appointment.endtime,
    animalId: appointment.fk_animalid,
    veterinaryId: appointment.fk_veterinaryid,
  };
}
