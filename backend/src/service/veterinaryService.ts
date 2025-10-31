import { prisma } from "../singletonPC";
import { veterinaries } from "../../generated/prisma";

export const veterinaryService = {
  async create(data: veterinaries): Promise<veterinaries> {
    return await prisma.veterinaries.create({ data: data });
  },

  async getById(id: number): Promise<veterinaries> {
    const foundVeterinary = await prisma.veterinaries.findUnique({
      where: { id },
      include: {
        appointments: true,
        veterinarypractices: true,
        persons: true,
        veterinary_has_specialization: {
          include: {
            specializations: true,
          },
        },
      },
    });

    if (!foundVeterinary) throw new Error(`Veterinary not found with id: ${id}`);

    return foundVeterinary;
  },

  async getByPractice(practiceId: number): Promise<veterinaries[]> {
    return await prisma.veterinaries.findMany({
      where: { fk_veterinarypractice: practiceId },
    });
  },

  async getAll(): Promise<veterinaries[]> {
    return await prisma.veterinaries.findMany();
  },

  async update(data: veterinaries): Promise<veterinaries> {
    return await prisma.veterinaries.update({ where: { id: data.id }, data: data });
  },

  async delete(id: number): Promise<void> {
    await prisma.veterinaries.delete({ where: { id } });
  },
};
