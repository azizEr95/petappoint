import { prisma } from "../singletonPC";
import { services } from "../../generated/prisma";

export const serviceService = {
  async create(data: services): Promise<services> {
    return await prisma.services.create({ data: data });
  },

  async getById(id: number): Promise<services> {
    const found = await prisma.services.findUnique({ where: { id } });

    if (!found) throw new Error(`Service does not exist with id ${id} `);

    return found;
  },

  async getAll(): Promise<services[]> {
    return await prisma.services.findMany();
  },

  async update(data: services): Promise<services> {
    if (!data.id) throw new Error("ID is required for update");

    return await prisma.services.update({ where: { id: data.id }, data: data });
  },

  async delete(id: number): Promise<void> {
    await prisma.services.delete({ where: { id } });
  },
};
