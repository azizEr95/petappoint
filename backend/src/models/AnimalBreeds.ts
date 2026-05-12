import { prisma } from "../singletonPC"
import { AnimalracesCreateType, AnimalracesType } from "petappoint-shared/schemas/ZodSchemas"
import { ResourceNotFoundError } from "../exceptions/errors/ResourceNotFoundError"

export default class AnimalBreeds {
    static async create(data: AnimalracesCreateType): Promise<AnimalracesType> {
        const created = await prisma.animalRace.create({
            data: {
                name: data.name,
                animalType: { connect: { id: data.animalTypeId } },
            },
        })

        return {
            id: created.id,
            name: created.name,
            animalTypeId: created.animalTypeId,
        }
    }

    static async getById(id: number): Promise<AnimalracesType> {
        const foundAnimalRace = await prisma.animalRace.findUnique({ where: { id } });

        if (!foundAnimalRace) {
            throw new ResourceNotFoundError(`Animal Kind not found with id: ${id}`, "id", id);
        }

        return {
            id: foundAnimalRace.id,
            name: foundAnimalRace.name,
            animalTypeId: foundAnimalRace.animalTypeId,
        }
    }

    static async getByName(name: string): Promise<AnimalracesType> {
        const foundAnimalRace = await prisma.animalRace.findFirst({ where: { name } })

        if (!foundAnimalRace) {
            throw new ResourceNotFoundError(`Animal Race not found with name: ${name}`, "name", name)
        }

        return {
            id: foundAnimalRace.id,
            name: foundAnimalRace.name,
            animalTypeId: foundAnimalRace.animalTypeId,
        }
    }

    static async getAll(): Promise<AnimalracesType[]> {
        return (await prisma.animalRace.findMany()).map((x) => ({
            id: x.id,
            name: x.name,
            animalTypeId: x.animalTypeId,
        }))
    }

    static async update(data: AnimalracesType): Promise<AnimalracesType> {
        const updated = await prisma.animalRace.update({ where: { id: data.id }, data: data })
        return {
            id: updated.id,
            name: updated.name,
            animalTypeId: updated.animalTypeId,
        }
    }

    static async delete(id: number): Promise<void> {
        await prisma.animalRace.delete({ where: { id } })
    }
}