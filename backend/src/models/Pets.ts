import { prisma } from "../singletonPC"
import { mapToAnimal } from "../helper/mapToAnimal"
import { AnimalsCreateType, AnimalsType, AnimalUpdateType } from "petappoint-shared/schemas/ZodSchemas"
import { ResourceNotFoundError } from "../exceptions/errors/ResourceNotFoundError"


export default class Pets {
    static async create(data: AnimalsCreateType): Promise<AnimalsType> {
        const created = await prisma.animal.create({
            data: {
                name: data.name,
                dateOfBirth: data.dateOfBirth,
                dateOfBirthIsExact: data.dateOfBirthIsExact,
                weightInGram: data.weightInGram,
                heightInCm: data.heightInCm,
                timeOfDeath: data.timeOfDeath,
                isCastrated: data.isCastrated,
                sex: data.sex,
                lifestyle: data.lifestyle,
                animalType: {
                    connect: {
                        id: data.animalTypeId,
                    },
                },
            },
        })

        return mapToAnimal(created)
    }

    static async getById(id: number): Promise<AnimalsType> {
        const foundAnimal = await prisma.animal.findUnique({ where: { id } })

        if (!foundAnimal) {
            throw new ResourceNotFoundError(`Animal not found with id: ${id}`, "id", id)
        }

        return mapToAnimal(foundAnimal)
    }

    static async getAll(): Promise<AnimalsType[]> {
        const foundAnimals = await prisma.animal.findMany()
        return foundAnimals.map((foundAnimal) => (mapToAnimal(foundAnimal)))
    }

    static async update(data: AnimalUpdateType): Promise<AnimalsType> {
        const updated = await prisma.animal.update({
            where: {
                id: data.id,
            },
            data: {
                name: data.name,
                dateOfBirth: data.dateOfBirth,
                dateOfBirthIsExact: data.dateOfBirthIsExact,
                weightInGram: data.weightInGram,
                heightInCm: data.heightInCm,
                timeOfDeath: data.timeOfDeath,
                isCastrated: data.isCastrated,
                sex: data.sex,
                lifestyle: data.lifestyle,
            },
        })
        return mapToAnimal(updated)
    }

    static async delete(id: number): Promise<void> {
        await prisma.animal.delete({ where: { id } })
    }
}