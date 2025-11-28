import { prisma } from "../singletonPC";
import { AnimalsType, PersonsCreateType, PersonsType, PersonsUpdateSchema, PersonsUpdateType } from "vetlib-shared/schemas/ZodSchemas";
import { addressService } from "./addressService";
import z from 'zod';

export const personService = {
  async create(dataRe: PersonsCreateType): Promise<PersonsType> {
    const created = await prisma.persons.create({
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

    return {
      id: created.id,
      firstname: created.firstname,
      lastname: created.lastname,
      sex: created.sex,
      dateofbirth: created.dateofbirth,
      addresses: created.address,
      phone: created.phone,
      email: created.email,
    }
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

    return {
      id: foundPerson.id,
      firstname: foundPerson.firstname,
      lastname: foundPerson.lastname,
      sex: foundPerson.sex,
      dateofbirth: foundPerson.dateofbirth,
      addresses: foundPerson.addresses,
      phone: foundPerson.phone,
      email: foundPerson.email,
    };
  },

  async getByEmail(email: string): Promise<PersonsType> {
    const foundPerson = await prisma.persons.findUnique({
      include: {
        addresses: true
      },
      where: { email }
    });

    if (!foundPerson) throw new Error(`Person not found with the email ${email}`);

    return {
      id: foundPerson.id,
      firstname: foundPerson.firstname,
      lastname: foundPerson.lastname,
      sex: foundPerson.sex,
      dateofbirth: foundPerson.dateofbirth,
      addresses: foundPerson.addresses,
      phone: foundPerson.phone,
      email: foundPerson.email,
    };
  },

  async getAll(): Promise<PersonsType[]> {
    const found = await prisma.persons.findMany({
      include: {
        addresses: true
      }
    });

    return found.map(foundPerson => ({
      id: foundPerson.id,
      firstname: foundPerson.firstname,
      lastname: foundPerson.lastname,
      sex: foundPerson.sex,
      dateofbirth: foundPerson.dateofbirth,
      addresses: foundPerson.addresses,
      phone: foundPerson.phone,
      email: foundPerson.email,
    }));
  },

  async update(dataRe: PersonsUpdateType): Promise<PersonsType> {
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

    return {
      id: updatedPerson.id,
      firstname: updatedPerson.firstname,
      lastname: updatedPerson.lastname,
      sex: updatedPerson.sex,
      dateofbirth: updatedPerson.dateofbirth,
      addresses: updatedPerson.addresses,
      phone: updatedPerson.phone,
      email: updatedPerson.email,
    };
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
