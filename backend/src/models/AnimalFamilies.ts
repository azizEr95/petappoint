import { prisma } from "../singletonPC"
import { AnimalType } from "../../generated/prisma"
import { AnimalTypeType } from "petappoint-shared/schemas/ZodSchemas"

export default class AnimalFamilies {
    static async create(data: AnimalType): Promise<AnimalTypeType> {
        return await prisma.animalType.create({ data: data })
    }

    static async getById(id: number): Promise<AnimalTypeType> {
        const foundAnimalType = await prisma.animalType.findUnique({ where: { id } })

        if (!foundAnimalType) throw new Error(`Animal Type not found with id: ${id}`)

        return foundAnimalType
    }

    static async getByName(name: string): Promise<AnimalTypeType> {
        const foundAnimalType = await prisma.animal.findFirst({ where: { name } })

        if (!foundAnimalType) throw new Error(`Animal Type not found with name: ${name}`)

        return foundAnimalType
    }

    static async getAll(): Promise<AnimalTypeType[]> {
        return await prisma.animalType.findMany()
    }

    static async update(data: AnimalTypeType): Promise<AnimalTypeType> {
        if (!data.id) throw new Error("ID is required for update")

        return await prisma.animalType.update({ where: { id: data.id }, data: data.name })
    }

    static async delete(id: number): Promise<void> {
        await prisma.animalType.delete({ where: { id } })
    }
}