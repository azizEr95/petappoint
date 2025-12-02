import { prisma } from "../singletonPC";
import { animal_types } from "../../generated/prisma";
import { AnimalTypeType } from "vetlib-shared/schemas/ZodSchemas";

export const animalTypeService = {
  async create(data: animal_types): Promise<AnimalTypeType> {
    return await prisma.animal_types.create({ data: data });
  },

  async getById(id: number): Promise<AnimalTypeType> {
    const foundAnimalType = await prisma.animal_types.findUnique({ where: { id } });

    if (!foundAnimalType) throw new Error(`Animal Type not found with id: ${id}`);

    return foundAnimalType;
  },

  async getByName(name: string): Promise<AnimalTypeType> {
    const foundAnimalType = await prisma.animals.findFirst({ where: { name } });

    if (!foundAnimalType) throw new Error(`Animal Type not found with name: ${name}`);

    return foundAnimalType;
  },

  async getAll(): Promise<AnimalTypeType[]> {
    return await prisma.animal_types.findMany();
  },

  async update(data: AnimalTypeType): Promise<AnimalTypeType> {
    if (!data.id) throw new Error("ID is required for update");

    return await prisma.animal_types.update({ where: { id: data.id }, data: data.name });
  },

  async delete(id: number): Promise<void> {
    await prisma.animal_types.delete({ where: { id } });
  },
};
