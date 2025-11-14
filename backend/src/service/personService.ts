import { prisma } from "../singletonPC";
import { persons } from "../../generated/prisma";

export const personService = {
  async create(data: persons): Promise<persons> {
    return await prisma.persons.create({ data: data });
  },

  async getById(id: number): Promise<persons> {
    const foundPerson = await prisma.persons.findUnique({ where: { id } });

    if (!foundPerson) throw new Error(`Person not found with id: ${id}`);

    return foundPerson;
  },

  async getByEmail(email: string): Promise<persons> {
    const person = await prisma.persons.findUnique({ where: { email } });

    if (!person) throw new Error(`Person not found with the email ${email}`);

    return person;
  },

  async getAll(): Promise<persons[]> {
    return await prisma.persons.findMany();
  },

  async update(data: persons): Promise<persons> {
    if (!data.id) throw new Error("ID is required for update");

    const updatedPerson = await prisma.persons.update({ where: { id: data.id }, data: data });

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
        data: practiceIds.map(practiceId => ({fk_personid: personId, fk_veterinarypracticeid: practiceId})),
        skipDuplicates: true
      }
    );
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

  async delete(id: number): Promise<void> {
    await prisma.persons.delete({ where: { id } });
  },
};
