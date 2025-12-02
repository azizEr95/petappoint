import { prisma } from "../singletonPC";
import { Animal, Person, PersonHasAnimal } from "../../generated/prisma";

export const personHasAnimalService = {
  async create(data: PersonHasAnimal): Promise<PersonHasAnimal> {
    return await prisma.personHasAnimal.create({ data: data });
  },

  async getAnimalsByPersonId(personId: number) {
    const personAndAnimals = await prisma.personHasAnimal.findMany({
      where: { personId: personId },
      include: {
        animal: true,
        person: true,
      },
    });

    return personAndAnimals.map((pa) => ({
      animal: pa.animal,
      person: pa.person,
    }));
  },

  async getPersonsByAnimalId(animalId: number) {
    const animalAndPersons = await prisma.personHasAnimal.findMany({
      where: { animalId: animalId },
      include: {
        animal: true,
        person: true,
      },
    });

    return animalAndPersons.map((pa) => ({
      animal: pa.animal,
      person: pa.person,
    }));
  },

  async delete(data: PersonHasAnimal): Promise<void> {
    await prisma.personHasAnimal.delete({
      where: {
        personId_animalId: {
          personId: data.personId,
          animalId: data.animalId,
        },
      },
    });
  },

  async exists(data: PersonHasAnimal): Promise<boolean> {
    const association = await prisma.personHasAnimal.findUnique({
      where: {
        personId_animalId: {
          personId: data.personId,
          animalId: data.animalId,
        },
      },
    });

    return !!association;
  },
};
