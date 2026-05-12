import { prisma } from "../singletonPC"
import { AnimalsType, PersonsCreateType, PersonsType, PersonsUpdateType } from "petappoint-shared/schemas/ZodSchemas"
import { ResourceNotFoundError } from "../exceptions/errors/ResourceNotFoundError"
import { mapToAnimal } from "../helper/mapToAnimal"
import { mapToPerson } from "../helper/mapToPerson"

export default class PetOwners {

    static async create(data: PersonsCreateType): Promise<PersonsType> {
        const created = await prisma.person.create({
            include: {
                address: true,
            },
            data: {
                firstName: data.firstName,
                lastName: data.lastName,
                sex: data.sex,
                dateOfBirth: data.dateOfBirth,
                address: {
                    create: {
                        city: data.address.cityCode,
                        cityCode: data.address.cityCode,
                        latitude: data.address.latitude,
                        longitude: data.address.longitude,
                        street: data.address.street,
                        fk_country: data.address.country
                    },
                },
                phone: data.phone,
                email: data.email,
                password: data.password,
            },
        })
        return mapToPerson(created)
    }

    static async getByEmail(email: string): Promise<PersonsType | null> {
        const foundPerson = await prisma.person.findUnique({
            include: { address: true },
            where: { email: email },
        })

        if (!foundPerson) {
            return null
        }

        return mapToPerson(foundPerson)
    }

    static async getById(id: number): Promise<PersonsType> {
        const foundPerson = await prisma.person.findUnique({
            include: { address: true },
            where: { id: id },
        })

        if (!foundPerson) {
            throw new ResourceNotFoundError(`Person not found with id: ${id}`, "id", id)
        }

        return mapToPerson(foundPerson)
    }

    static async getAll(): Promise<PersonsType[]> {
        const found = await prisma.person.findMany({
            include: {
                address: true,
            },
        })

        return found.map((foundPerson) => mapToPerson(foundPerson))
    }

    static async update(data: PersonsUpdateType, toUpdateData: any): Promise<PersonsType> {
        const updatedPerson = await prisma.person.update({
            where: { id: data.id },
            data: toUpdateData,
            include: {
                address: true,
            },
        })

        return mapToPerson(updatedPerson)
    }

    static async getFavoritePracticesIds(personId: number): Promise<number[]> {
        const result = await prisma.personHasFavorizedVeterinaryPractice.findMany({
            where: {
                personId: personId,
            },
        })

        return result.map((x) => x.veterinaryPracticeId)
    }

    static async getPetsFromOwner(personId: number): Promise<AnimalsType[]> {
        const animals = await prisma.personHasAnimal.findMany({
            where: {
                personId: personId,
            },
            include: {
                animal: true,
            },
        })

        return animals.map((x) => mapToAnimal(x.animal))
    }

    static async delete(id: number): Promise<Boolean> {
        const deleted = await prisma.person.delete({ where: { id } })

        return deleted ? true : false
    }

    static async connectToPet(personId: number, petId: number): Promise<void> {
        const created = await prisma.personHasAnimal.create({
            data: {
                animalId: petId,
                personId: personId,
            },
        })
    }
}