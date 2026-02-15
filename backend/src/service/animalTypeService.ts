import { prisma } from "../singletonPC"
import { AnimalType } from "../../generated/prisma"
import { AnimalTypeType } from "petappoint-shared/schemas/ZodSchemas"
import AnimalFamilies from "../models/AnimalFamilies"

export const animalTypeService = {
  async create(data: AnimalType): Promise<AnimalTypeType> {
    return await AnimalFamilies.create(data)
  },

  async getById(id: number): Promise<AnimalTypeType> {
    return await AnimalFamilies.getById(id)
  },

  async getByName(name: string): Promise<AnimalTypeType> {
    return await AnimalFamilies.getByName(name)
  },

  async getAll(): Promise<AnimalTypeType[]> {
    return await AnimalFamilies.getAll()
  },

  async update(data: AnimalTypeType): Promise<AnimalTypeType> {
    return await AnimalFamilies.update(data)
  },

  async delete(id: number): Promise<void> {
    return await AnimalFamilies.delete(id)
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
}
