import { prisma } from "../singletonPC"
import { mapToAddress } from "../helper/mapToAddress"
import { AddressesCreateType, AddressesType } from "petappoint-shared/schemas/ZodSchemas"
import { ResourceNotFoundError } from "../exceptions/errors/ResourceNotFoundError"
import { ConstraintError } from "../exceptions/errors/ConstraintError"

export default class Addresses {
    static async create(data: AddressesCreateType): Promise<AddressesType> {
        const createdAddress = await prisma.address.create({
            data: {
                city: data.city,
                cityCode: data.cityCode,
                fk_country: data.country,
                latitude: data.latitude,
                longitude: data.longitude,
                street: data.street,
            },
        })
        return mapToAddress(createdAddress)
    }

    static async getById(id: number): Promise<AddressesType> {
        const foundAddress = await prisma.address.findUnique({ where: { id } })

        if (!foundAddress) {
            throw new ResourceNotFoundError(`Address with ${id} does not exist`, "id", id)
        }

        return mapToAddress(foundAddress)
    }

    static async getAll(): Promise<AddressesType[]> {
        const allAddresses = await prisma.address.findMany()
        return allAddresses.map(x => mapToAddress(x))
    }

    static async update(data: AddressesType): Promise<AddressesType> {
        if (!data.id) {
            throw new ConstraintError("ID is required for update", [{ path: "id", value: data.id }])
        }

        const updatedAddress = await prisma.address.update({
            where: { id: data.id },
            data: {
                city: data.city,
                cityCode: data.cityCode,
                fk_country: data.country,
                latitude: data.latitude,
                longitude: data.longitude,
                street: data.street,
            },
        })

        return mapToAddress(updatedAddress)
    }

    static async delete(id: number): Promise<void> {
        await prisma.address.delete({ where: { id } })
    }
}