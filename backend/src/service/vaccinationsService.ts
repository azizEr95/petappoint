import { prisma } from "../singletonPC";
import { Vaccination } from "../../generated/prisma";

export const vaccinationService = {
  async create(data: Vaccination): Promise<Vaccination> {
    return await prisma.vaccination.create({ data: data });
  },

  async getById(id: number): Promise<Vaccination> {
    const found = await prisma.vaccination.findUnique({ where: { id } });

    if (!found) throw new Error(`Vaccination does not exist with id ${id} `);

    return found;
  },

  async getAll(): Promise<Vaccination[]> {
    return await prisma.vaccination.findMany();
  },

  async update(data: Vaccination): Promise<Vaccination> {
    if (!data.id) throw new Error("ID is required for update");

    return await prisma.vaccination.update({ where: { id: data.id }, data: data });
  },

  async delete(id: number): Promise<void> {
    await prisma.vaccination.delete({ where: { id } });
  },
};
