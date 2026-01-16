import { prisma } from "../singletonPC";
import { Veterinarian } from "../../generated/prisma";
import { mapToVeterinary } from "../helper/mapToVeterinary";
import { VeterinariansType } from "vetilib-shared/schemas/ZodSchemas";

export const veterinaryService = {
  async getById(id: number): Promise<Veterinarian> {
    const foundVeterinary = await prisma.veterinarian.findUnique({
      where: { id },
      include: {
        appointments: true,
        veterinaryPractice: true,
        person: true,
        veterinaryHasServices: {
          include: {
            service: true,
            veterinarian: true,
          },
        },
      },
    });

    if (!foundVeterinary) throw new Error(`Veterinary not found with id: ${id}`);

    return foundVeterinary;
  },

  async getByPractice(practiceId: number): Promise<Veterinarian[]> {
    return await prisma.veterinarian.findMany({
      where: { fk_veterinarypracticeid: practiceId },
    });
  },

  async getAll(): Promise<Veterinarian[]> {
    return await prisma.veterinarian.findMany();
  },

  async update(data: Veterinarian): Promise<Veterinarian> {
    return await prisma.veterinarian.update({ where: { id: data.id }, data: data });
  },

  async delete(id: number): Promise<void> {
    await prisma.veterinarian.delete({ where: { id } });
  },
};
