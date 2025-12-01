import { prisma } from "../singletonPC";
import { veterinarians } from "../../generated/prisma";

export const veterinaryService = {
  async create(data: veterinarians): Promise<veterinarians> {
    return await prisma.veterinarians.create({ data: data });
  },

  async getById(id: number): Promise<veterinarians> {
    const foundVeterinary = await prisma.veterinarians.findUnique({
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

  async getByPractice(practiceId: number): Promise<veterinarians[]> {
    return await prisma.veterinarians.findMany({
      where: { fk_veterinarypractice: practiceId },
    });
  },

  async getAll(): Promise<veterinarians[]> {
    return await prisma.veterinarians.findMany();
  },

  async update(data: veterinarians): Promise<veterinarians> {
    return await prisma.veterinarians.update({ where: { id: data.id }, data: data });
  },

  async delete(id: number): Promise<void> {
    await prisma.veterinarians.delete({ where: { id } });
  },
};
