import { prisma } from "../singletonPC"
import { PersonHasAnimal } from "../../generated/prisma"

export default class PetsOwnerships {
    static async create(data: PersonHasAnimal): Promise<PersonHasAnimal> {
        return await prisma.personHasAnimal.create({ data: data })
    }

    static async getAnimalsByPersonId(personId: number) {
        const personAndAnimals = await prisma.personHasAnimal.findMany({
            where: { personId: personId },
            include: {
                animal: true,
                person: true,
            },
        })

        return personAndAnimals.map((pa) => ({
            animal: pa.animal,
            person: pa.person,
        }))
    }

    static async getPersonsByAnimalId(animalId: number) {
        const animalAndPersons = await prisma.personHasAnimal.findMany({
            where: { animalId: animalId },
            include: {
                animal: true,
                person: true,
            },
        })

        return animalAndPersons.map((pa) => ({
            animal: pa.animal,
            person: pa.person,
        }))
    }

    static async delete(data: PersonHasAnimal): Promise<void> {
        await prisma.personHasAnimal.delete({
            where: {
                personId_animalId: {
                    personId: data.personId,
                    animalId: data.animalId,
                },
            },
        })
    }

    static async exists(data: PersonHasAnimal): Promise<boolean> {
        const association = await prisma.personHasAnimal.findUnique({
            where: {
                personId_animalId: {
                    personId: data.personId,
                    animalId: data.animalId,
                },
            },
        })

        return !!association
    }
}