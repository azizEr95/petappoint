import { prisma } from "../singletonPC";
import { animalgroup } from "../../generated/prisma";

export const animalGroupService = {
  async create(data: animalgroup): Promise<animalgroup> {
    return await prisma.animalgroup.create({ data: data });
  },

  async getById(id: number): Promise<animalgroup> {
    const foundGroup = await prisma.animalgroup.findUnique({ where: { id } });

    if (!foundGroup) throw new Error(`Animal group with ID ${id} does not exist`);

    return foundGroup;
  },

  async getAll(): Promise<animalgroup[]> {
    return await prisma.animalgroup.findMany();
  },

  async update(data: animalgroup): Promise<animalgroup> {
    if (!data.id) throw new Error("ID is required for update");

    const updatedGroup = await prisma.animalgroup.update({ where: { id: data.id }, data: data });

    return updatedGroup;
  },

  async delete(id: number): Promise<void> {
    await prisma.animalgroup.delete({ where: { id } });
  },
};
