import { prisma } from "../singletonPC";
import { medications } from "../../generated/prisma";

export const medicationService = {
  async create(data: medications): Promise<medications> {
    return await prisma.medications.create({ data: data });
  },

  async getById(id: number): Promise<medications> {
    const found = await prisma.medications.findUnique({ where: { id } });

    if (!found) throw new Error(`Medication with id ${id} does not exist`);

    return found;
  },

  async getAll(): Promise<medications[]> {
    return await prisma.medications.findMany();
  },

  async update(data: medications): Promise<medications> {
    if (!data.id) throw new Error("ID is required for update");

    return await prisma.medications.update({ where: { id: data.id }, data: data });
  },

  async delete(id: number): Promise<void> {
    await prisma.medications.delete({ where: { id } });
  },
};
