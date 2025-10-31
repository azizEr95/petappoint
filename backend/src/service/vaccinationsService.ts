import { prisma } from "../singletonPC";
import { vaccinations } from "../../generated/prisma";

export const vaccinationService = {
  async create(data: vaccinations): Promise<vaccinations> {
    return await prisma.vaccinations.create({ data: data });
  },

  async getById(id: number): Promise<vaccinations> {
    const found = await prisma.vaccinations.findUnique({ where: { id } });

    if (!found) throw new Error(`Vaccination does not exist with id ${id} `);

    return found;
  },

  async getAll(): Promise<vaccinations[]> {
    return await prisma.vaccinations.findMany();
  },

  async update(data: vaccinations): Promise<vaccinations> {
    if (!data.id) throw new Error("ID is required for update");

    return await prisma.vaccinations.update({ where: { id: data.id }, data: data });
  },

  async delete(id: number): Promise<void> {
    await prisma.vaccinations.delete({ where: { id } });
  },
};
