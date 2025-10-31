import { prisma } from "../singletonPC";
import { animals, persons, person_has_animal } from "../../generated/prisma";

export const personHasAnimalService = {
  async create(data: person_has_animal): Promise<person_has_animal> {
    return await prisma.person_has_animal.create({ data: data });
  },

  async getAnimalsByPersonId(personId: number) {
    const personAndAnimals = await prisma.person_has_animal.findMany({
      where: { fk_personid: personId },
      include: {
        animals: true,
        persons: true,
      },
    });

    return personAndAnimals.map((pa) => ({
      animal: pa.animals,
      person: pa.persons,
    }));
  },

  async getPersonsByAnimalId(animalId: number) {
    const animalAndPersons = await prisma.person_has_animal.findMany({
      where: { fk_animalid: animalId },
      include: {
        animals: true,
        persons: true,
      },
    });

    return animalAndPersons.map((pa) => ({
      animal: pa.animals,
      person: pa.persons,
    }));
  },

  async delete(data: person_has_animal): Promise<void> {
    await prisma.person_has_animal.delete({
      where: {
        fk_personid_fk_animalid: {
          fk_personid: data.fk_personid,
          fk_animalid: data.fk_animalid,
        },
      },
    });
  },

  async exists(data: person_has_animal): Promise<boolean> {
    const association = await prisma.person_has_animal.findUnique({
      where: {
        fk_personid_fk_animalid: {
          fk_personid: data.fk_personid,
          fk_animalid: data.fk_animalid,
        },
      },
    });

    return !!association;
  },
};
