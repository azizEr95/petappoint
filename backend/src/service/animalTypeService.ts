import { prisma } from "../singletonPC";
import { animaltypes } from "../../generated/prisma";

export const animalTypeService = {
  async create(data: animaltypes): Promise<animaltypes> {
    return await prisma.animaltypes.create({ data: data });
  },

  async getById(id: number): Promise<animaltypes> {
    const foundAnimalType = await prisma.animaltypes.findUnique({ where: { id } });

    if (!foundAnimalType) throw new Error(`Animal Type not found with id: ${id}`);

    return foundAnimalType;
  },

  async getByName(name: string): Promise<animaltypes> {
    const foundAnimalType = await prisma.animals.findFirst({ where: { name } });

    if (!foundAnimalType) throw new Error(`Animal Type not found with name: ${name}`);

    return foundAnimalType;
  },

  async getAll(): Promise<animaltypes[]> {
    return await prisma.animaltypes.findMany();
  },

  async update(data: animaltypes): Promise<animaltypes> {
    if (!data.id) throw new Error("ID is required for update");

    return await prisma.animaltypes.update({ where: { id: data.id }, data: data.name });
  },

  async delete(id: number): Promise<void> {
    await prisma.animaltypes.delete({ where: { id } });
  },
};
