import { prisma } from "../singletonPC";
import { AnimalsType, PersonsCreateType, PersonsType } from "vetlib-shared/schemas/ZodSchemas";
import { addressService } from "./addressService";

export const personService = {
  async create(dataRe: PersonsCreateType): Promise<PersonsType> {
    return await prisma.persons.create({
      include: {
        addresses: true
      },
      data: {
        firstname: dataRe.firstname,
        lastname: dataRe.lastname,
        sex: dataRe.sex,
        dateofbirth: dataRe.dateofbirth,
        addresses: {
          create: dataRe.addresses
        },
        phone: dataRe.phone,
        email: dataRe.email,
        password: dataRe.password
      }
    });
  },

  async connectAnimal(personId: number, animalId: number): Promise<void> {
    await prisma.person_has_animal.create({
      data: {
        fk_animalid: animalId,
        fk_personid: personId
      }
    });
  },

  async getById(id: number): Promise<PersonsType> {
    const foundPerson = await prisma.persons.findUnique({
      include: {
        addresses: true
      },
      where: { id }
    });

    if (!foundPerson) throw new Error(`Person not found with id: ${id}`);

    return foundPerson;
  },

  async getByEmail(email: string): Promise<PersonsType> {
    const person = await prisma.persons.findUnique({
      include: {
        addresses: true
      },
      where: { email }
    });

    if (!person) throw new Error(`Person not found with the email ${email}`);

    return person;
  },

  async getAll(): Promise<PersonsType[]> {
    return await prisma.persons.findMany({
      include: {
        addresses: true
      }
    });
  },

  async update(dataRe: PersonsType): Promise<PersonsType> {
    if (!dataRe.id) throw new Error("ID is required for update");

    await addressService.update(dataRe.addresses);

    const updatedPerson = await prisma.persons.update({
      where: { id: dataRe.id },
      data: {
        firstname: dataRe.firstname,
        lastname: dataRe.lastname,
        sex: dataRe.sex,
        dateofbirth: dataRe.dateofbirth,
        phone: dataRe.phone,
        email: dataRe.email,
        password: dataRe.password,
      },
      include: {
        addresses: true
      }
    });

    return updatedPerson;
  },

  async favorizeVeterinaryPracticesByIds(personId: number, practiceIds: number[]): Promise<void> {
    if (!Number.isInteger(personId)) {
      throw new Error("personId needs to be an integer.");
    }

    practiceIds = practiceIds.filter(x => Number.isInteger(x));
    if (practiceIds.length === 0) {
      return;
    }

    const d = await prisma.person_has_favorized_veterinarypractice.createMany(
      {
        data: practiceIds.map(practiceId => ({ fk_personid: personId, fk_veterinarypracticeid: practiceId })),
        skipDuplicates: true
      }
    );
  },

  async deleteFavorizedVeterinaryPracticeId(personId: number, practiceId: number): Promise<void> {
    if (!Number.isInteger(personId)) {
      throw new Error("personId needs to be an integer.");
    }

    if (!Number.isInteger(practiceId)) {
      throw new Error("practiceId needs to be an integer.");
    }

    const result = await prisma.person_has_favorized_veterinarypractice.delete({
      where: {
        fk_personid_fk_veterinarypracticeid: {
          fk_personid: personId,
          fk_veterinarypracticeid: practiceId
        }
      }
    });
  },

  async getFavorizedVeterinaryPracticeIds(personId: number): Promise<number[]> {
    if (!Number.isInteger(personId)) {
      throw new Error("personId needs to be an integer.");
    }

    const result = await prisma.person_has_favorized_veterinarypractice.findMany({
      where: {
        fk_personid: personId
      }
    });
    return result.map(x => x.fk_veterinarypracticeid);
  },

  async getAnimalsForPersonId(personId: number): Promise<AnimalsType[]> {
    if (!Number.isInteger(personId)) {
      throw new Error("personId needs to be an integer.");
    }

    const animals = await prisma.person_has_animal.findMany({
      where: {
        fk_personid: personId
      },
      omit: {
        fk_personid: true,
        fk_animalid: true
      },
      include: {
        animals: true
      }
    });

    return animals.map(x => ({
      id: x.animals.id,
      name: x.animals.name,
      dateofbirth: x.animals.dateofbirth,
      dateofbirthisexact: x.animals.dateofbirthisexact,
      weightingram: x.animals.weightingram,
      heightincm: x.animals.heightincm,
      timeofdeath: x.animals.timeofdeath,
      iscastrated: x.animals.iscastrated,
      lifestyleisindoors: x.animals.lifestyleisindoors,
      sex: x.animals.sex,
      animaltypeid: x.animals.fk_animaltypeid,
      animalgroupid: x.animals.fk_animaltypeid
    }));
  },

  async delete(id: number): Promise<void> {
    await prisma.persons.delete({ where: { id } });
  },
};
