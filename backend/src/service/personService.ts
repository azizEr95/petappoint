import { prisma } from "../singletonPC";
import { AnimalsType, PersonsCreateType, PersonsType, PersonsUpdateSchema, PersonsUpdateType, PostgresIdSchema } from "vetlib-shared/schemas/ZodSchemas";
import { addressService } from "./addressService";
import z from 'zod';
import { ResourceNotFoundError } from "../exceptions/errors/ResourceNotFoundError";

export const personService = {
  async create(dataRe: PersonsCreateType): Promise<PersonsType> {
    const created = await prisma.person.create({
      include: {
        address: true
      },
      data: {
        firstName: dataRe.firstname,
        lastName: dataRe.lastname,
        sex: dataRe.sex,
        dateOfBirth: dataRe.dateofbirth,
        address: {
          create: dataRe.addresses
        },
        phone: dataRe.phone,
        email: dataRe.email,
        password: dataRe.password
      }
    });

    return {
      id: created.id,
      firstname: created.firstName,
      lastname: created.lastName,
      sex: created.sex,
      dateofbirth: created.dateOfBirth,
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
    const foundPerson = await prisma.person.findUnique({
      include: {
        address: true
      },
      where: { id }
    });

    if (!foundPerson) {
      throw new ResourceNotFoundError(`Person not found with id: ${id}`, 'id', id);
    }

    return {
      id: foundPerson.id,
      firstname: foundPerson.firstName,
      lastname: foundPerson.lastName,
      sex: foundPerson.sex,
      dateofbirth: foundPerson.dateOfBirth,
      addresses: foundPerson.address,
      phone: foundPerson.phone,
      email: foundPerson.email,
    };
  },

  async getByEmail(email: string): Promise<PersonsType> {
    const foundPerson = await prisma.person.findUnique({
      include: {
        address: true
      },
      where: { email }
    });

    if (!foundPerson) {
      throw new ResourceNotFoundError(`Person not found with the email ${email}`, 'email', email);
    }

    return {
      id: foundPerson.id,
      firstname: foundPerson.firstName,
      lastname: foundPerson.lastName,
      sex: foundPerson.sex,
      dateofbirth: foundPerson.dateOfBirth,
      addresses: foundPerson.address,
      phone: foundPerson.phone,
      email: foundPerson.email,
    };
  },

  async getAll(): Promise<PersonsType[]> {
    const found = await prisma.person.findMany({
      include: {
        address: true
      }
    });

    return found.map(foundPerson => ({
      id: foundPerson.id,
      firstname: foundPerson.firstName,
      lastname: foundPerson.lastName,
      sex: foundPerson.sex,
      dateofbirth: foundPerson.dateOfBirth,
      addresses: foundPerson.address,
      phone: foundPerson.phone,
      email: foundPerson.email,
    }));
  },

  async update(dataRe: PersonsUpdateType): Promise<PersonsType> {
    await addressService.update(dataRe.addresses);

    const updatedPerson = await prisma.person.update({
      where: { id: dataRe.id },
      data: {
        firstName: dataRe.firstname,
        lastName: dataRe.lastname,
        sex: dataRe.sex,
        dateOfBirth: dataRe.dateofbirth,
        phone: dataRe.phone,
        email: dataRe.email,
        password: dataRe.password,
      },
      include: {
        address: true
      }
    });

    return {
      id: updatedPerson.id,
      firstname: updatedPerson.firstName,
      lastname: updatedPerson.lastName,
      sex: updatedPerson.sex,
      dateofbirth: updatedPerson.dateOfBirth,
      addresses: updatedPerson.address,
      phone: updatedPerson.phone,
      email: updatedPerson.email,
    };
  },

  async favorizeVeterinaryPracticesByIds(personId: number, practiceIds: number[]): Promise<void> {
    practiceIds = practiceIds.map(x => PostgresIdSchema.safeParse(x))
      .filter(x => x.success)
      .map(x => x.data);
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
    const result = await prisma.person_has_favorized_veterinarypractice.findMany({
      where: {
        fk_personid: personId
      }
    });
    return result.map(x => x.fk_veterinarypracticeid);
  },

  async getAnimalsForPersonId(personId: number): Promise<AnimalsType[]> {
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
    await prisma.person.delete({ where: { id } });
  },
};
