import { prisma } from "../singletonPC";
import { AnimalType } from "../../generated/prisma";
import { AnimalTypeType } from "petappoint-shared/schemas/ZodSchemas";

export const animalTypeService = {
  async create(data: AnimalType): Promise<AnimalTypeType> {
    return await prisma.animalType.create({ data: data });
  },

  async getById(id: number): Promise<AnimalTypeType> {
    const foundAnimalType = await prisma.animalType.findUnique({ where: { id } });

    if (!foundAnimalType) throw new Error(`Animal Type not found with id: ${id}`);

    return foundAnimalType;
  },

  async getByName(name: string): Promise<AnimalTypeType> {
    const foundAnimalType = await prisma.animal.findFirst({ where: { name } });

    if (!foundAnimalType) throw new Error(`Animal Type not found with name: ${name}`);

    return foundAnimalType;
  },

  async getAll(): Promise<AnimalTypeType[]> {
    return await prisma.animalType.findMany();
  },

  async update(data: AnimalTypeType): Promise<AnimalTypeType> {
    if (!data.id) throw new Error("ID is required for update");

    return await prisma.animalType.update({ where: { id: data.id }, data: data.name });
  },

  async delete(id: number): Promise<void> {
    await prisma.animalType.delete({ where: { id } });
  },

  async getTreatableTypesForVeterinaryId(veterinaryId: number): Promise<AnimalTypeType[]> {
    const found = await prisma.veterinaryCanTreatAnimalType.findMany({
      include: {
        animalType: true
      },
      where: {
        veterinaryId: veterinaryId
      }
    });

    return found.map(x => x.animalType);
  }
};
