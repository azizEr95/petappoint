import { prisma } from "../singletonPC";
import { Medication } from "../../generated/prisma";

export const medicationService = {
  async create(data: Medication): Promise<Medication> {
    return await prisma.medication.create({ data: data });
  },

  async getById(id: number): Promise<Medication> {
    const found = await prisma.medication.findUnique({ where: { id } });

    if (!found) throw new Error(`Medication with id ${id} does not exist`);

    return found;
  },

  async getAll(): Promise<Medication[]> {
    return await prisma.medication.findMany();
  },

  async update(data: Medication): Promise<Medication> {
    if (!data.id) throw new Error("ID is required for update");

    return await prisma.medication.update({ where: { id: data.id }, data: data });
  },

  async delete(id: number): Promise<void> {
    await prisma.medication.delete({ where: { id } });
  },
};
