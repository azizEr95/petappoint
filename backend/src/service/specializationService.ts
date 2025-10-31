import { prisma } from "../singletonPC";
import { specializations } from "../../generated/prisma";

export const specializationService = {
  async create(data: specializations): Promise<specializations> {
    return await prisma.specializations.create({ data: data });
  },

  async getById(id: number): Promise<specializations> {
    const foundSpecialization = await prisma.specializations.findUnique({ where: { id } });

    if (!foundSpecialization) throw new Error(`Specialization not found with id: ${id}`);

    return foundSpecialization;
  },

  async getByName(name: string): Promise<specializations> {
    const specialization = await prisma.specializations.findFirst({ where: { name } });

    if (!specialization) throw new Error(`Specialization not found with name: ${name}`);

    return specialization;
  },

  async getAll(): Promise<specializations[]> {
    return await prisma.specializations.findMany({
      include: {
        veterinary_has_specialization: true,
      },
    });
  },

  async update(data: specializations): Promise<specializations> {
    if (!data.id) throw new Error("ID is required for update");

    return await prisma.specializations.update({ where: { id: data.id }, data: data });
  },

  async delete(id: number): Promise<void> {
    await prisma.specializations.delete({ where: { id } });
  },
};
