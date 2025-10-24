import { prisma } from "../singletonPC";
import { PersonHasAnimalResource } from "src/Resource";

export const personHasAnimalService = {
  // Create (Verbindung zwischen Person und Tier)
  async create(
    data: PersonHasAnimalResource
  ): Promise<PersonHasAnimalResource> {
    const createdPersonHasAnimal = await prisma.person_has_animal.create({
      data: {
        fk_personid: data.personId,
        fk_animalid: data.animalId,
      },
    });

    return mapPersonHasAnimalToResource(createdPersonHasAnimal);
  },

  // Find all animals for a specific person
  async getAnimalsByPersonId(personId: number) {
    const personAnimals = await prisma.person_has_animal.findMany({
      where: { fk_personid: personId },
      include: {
        animals: true,
        persons: true,
      },
    });

    return personAnimals.map((pa) => ({
      animal: pa.animals,
      person: pa.persons,
    }));
  },

  // Find all persons for a specific animal
  async getPersonsByAnimalId(animalId: number) {
    const animalPersons = await prisma.person_has_animal.findMany({
      where: { fk_animalid: animalId },
      include: {
        animals: true,
        persons: true,
      },
    });

    return animalPersons.map((pa) => ({
      animal: pa.animals,
      person: pa.persons,
    }));
  },

  // Remove association
  async delete(data: PersonHasAnimalResource): Promise<void> {
    await prisma.person_has_animal.delete({
      where: {
        fk_personid_fk_animalid: {
          fk_personid: data.personId,
          fk_animalid: data.animalId,
        },
      },
    });
  },

  // Check if association exists
  async exists(data: PersonHasAnimalResource): Promise<boolean> {
    const association = await prisma.person_has_animal.findUnique({
      where: {
        fk_personid_fk_animalid: {
          fk_personid: data.personId,
          fk_animalid: data.animalId,
        },
      },
    });

    return !!association;
  },
};

// Helper function to map Prisma person_has_animal to resource
function mapPersonHasAnimalToResource(
  personHasAnimal: any
): PersonHasAnimalResource {
  return {
    personId: personHasAnimal.fk_personid,
    animalId: personHasAnimal.fk_animalid,
  };
}
