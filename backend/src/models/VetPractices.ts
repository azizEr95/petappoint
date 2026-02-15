import { prisma } from "../singletonPC"
import { mapToVeterinaryPractice } from "../helper/mapToVeterinaryPractice"
import { ResourceNotFoundError } from "../exceptions/errors/ResourceNotFoundError"
import { ConstraintError } from "../exceptions/errors/ConstraintError"
import { VeterinaryPracticesCreateType, VeterinaryPracticesType } from "petappoint-shared/schemas/ZodSchemas"
import Addresses from "./Addresses"

export default class VetPractices {
    static async create(data: VeterinaryPracticesCreateType) {
        const created = await prisma.veterinaryPractice.create({
            include: {
                address: true,
            },
            data: {
                name: data.name,
                phone: data.phone,
                infoEmail: data.infoEmail,
                email: data.email,
                password: data.password,
                address: {
                    create: {
                        city: data.address.city,
                        cityCode: data.address.cityCode,
                        latitude: data.address.latitude,
                        longitude: data.address.longitude,
                        street: data.address.street,
                        fk_country: data.address.country
                    },
                },
            },
        })

        return mapToVeterinaryPractice(created)
    }

    static async getById(id: number): Promise<VeterinaryPracticesType> {
        const foundPractice = await prisma.veterinaryPractice.findUnique({
            include: {
                address: true,
            },
            omit: {
                addressId: true,
            },
            where: {
                id: id,
            },
        });

        if (!foundPractice) {
            throw new ResourceNotFoundError("Veterinary Practice not found with id:", "id", id);
        }
        return mapToVeterinaryPractice(foundPractice);
    }

    static async getByEmail(email: string): Promise<VeterinaryPracticesType | null> {
        const found = await prisma.veterinaryPractice.findFirst({
            include: {
                address: true,
            },

            where: {
                email,
            },
        });

        if (!found) {
            return null;
        }

        return mapToVeterinaryPractice(found);
    }

    static async getAll(): Promise<VeterinaryPracticesType[]> {
        const allPractices = await prisma.veterinaryPractice.findMany({
            include: {
                address: true,
            },
        })

        return allPractices.map(x => mapToVeterinaryPractice(x))
    }

    static async update(data: VeterinaryPracticesType): Promise<VeterinaryPracticesType> {
        if (!data.id) {
            throw new ConstraintError("ID is required for update", [{ path: "veterinarypractice.id", value: data.id }]);
        }

        await Addresses.update(data.address)

        const updatedPractice = await prisma.veterinaryPractice.update({
            where: { id: data.id },
            data: {
                name: data.name,
                phone: data.phone,
                email: data.email,
                infoEmail: data.infoEmail,
                info: data.info,
                website: data.website,
            },
            include: { address: true },
        });

        return mapToVeterinaryPractice(updatedPractice)
    }

    static async delete(id: number): Promise<void> {
        await prisma.veterinaryPractice.delete({ where: { id: id } })
    }
}