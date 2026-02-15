import { prisma } from "../singletonPC"
import { Service } from "../../generated/prisma"
import { ServiceType } from "petappoint-shared/schemas/ZodSchemas"

export default class Treatments {
    static async create(data: Service): Promise<Service> {
        return await prisma.service.create({ data: data })
    }

    static async getById(id: number): Promise<Service> {
        const found = await prisma.service.findUnique({ where: { id } })

        if (!found) throw new Error(`Service does not exist with id ${id} `)

        return found;
    }

    static async getAll(): Promise<ServiceType[]> {
        return await prisma.service.findMany()
    }

    static async update(data: Service): Promise<Service> {
        if (!data.id) throw new Error("ID is required for update");

        return await prisma.service.update({ where: { id: data.id }, data: data })
    }

    static async delete(id: number): Promise<void> {
        await prisma.service.delete({ where: { id } })
    }
}