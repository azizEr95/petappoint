import { prisma } from "../singletonPC"
import { AnimalracesCreateType, AnimalracesType } from "petappoint-shared/schemas/ZodSchemas"
import AnimalBreeds from "../models/AnimalBreeds"

export const animalRaceService = {
  async create(data: AnimalracesCreateType): Promise<AnimalracesType> {
    return await AnimalBreeds.create(data)
  },

  async getById(id: number): Promise<AnimalracesType> {
    return await AnimalBreeds.getById(id)
  },

  async getByName(name: string): Promise<AnimalracesType> {
    return await AnimalBreeds.getByName(name)
  },

  async getAll(): Promise<AnimalracesType[]> {
    return await AnimalBreeds.getAll()
  },

  async getAllForAnimalType(animalTypeId: number): Promise<AnimalracesType[]> {
    return (
      await prisma.animalRace.findMany({
        where: {
          animalTypeId: animalTypeId,
        },
      })
    ).map((x) => ({
      id: x.id,
      name: x.name,
      animalTypeId: x.animalTypeId,
    }))
  },

  async getAnimalRaces(animalId: number): Promise<AnimalracesType[]> {
    return (
      await prisma.animalHasRace.findMany({
        where: {
          animalId: animalId,
        },
        include: {
          animalRace: true,
        },
      })
    ).map((x) => ({
      id: x.animalRace.id,
      name: x.animalRace.name,
      animalTypeId: x.animalRace.animalTypeId,
    }))
  },

  async update(data: AnimalracesType): Promise<AnimalracesType> {
    return await AnimalBreeds.update(data)
  },

  async delete(id: number): Promise<void> {
    return await AnimalBreeds.delete(id)
  },
}
