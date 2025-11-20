import { prisma } from "../singletonPC";
import { animal_has_races, animalraces } from "../../generated/prisma";

export const animalRaceService = {
  async create(data: animalraces): Promise<animalraces> {
    return await prisma.animalraces.create({
      data: {
        name: data.name,
        // relation zu animaltypes
        // connectOrCreate gibt es auch. Aber sollte das vom Kunden aus möglich sein?
        // Kann er sich ein spaß erlauben und sagen mein race hat den type ugga-buuga
        // wäre doch besser, wenn er nur welche auswählen kann die wir vorgeben
        // https://www.prisma.io/docs/orm/prisma-client/queries/relation-queries#nested-writes
        animaltypes: { connect: { id: data.fk_animaltypeid } },
      },
    });
  },

  async getById(id: number): Promise<animalraces> {
    const foundAnimalRace = await prisma.animalraces.findUnique({ where: { id } });

    if (!foundAnimalRace) throw new Error(`Animal Kind not found with id: ${id}`);

    return foundAnimalRace;
  },

  async getByName(name: string): Promise<animalraces> {
    const foundAnimalRace = await prisma.animalraces.findFirst({ where: { name } });

    if (!foundAnimalRace) throw new Error(`Animal Race not found with name: ${name}`);

    return foundAnimalRace;
  },

  async getAll(): Promise<animalraces[]> {
    return await prisma.animalraces.findMany();
  },

  async getAllForAnimalType(animalTypeId: number): Promise<animalraces[]> {
    if (!Number.isInteger(animalTypeId)) {
      throw new Error("animalTypeId needs to be an integer.");
    }

    return await prisma.animalraces.findMany({
      where: {
        fk_animaltypeid: animalTypeId
      }
    });
  },

  async getAnimalRaces(animalId: number) {
    if (!Number.isInteger(animalId)) {
      throw new Error("animalId needs to be an integer.");
    }

    return await prisma.animal_has_races.findMany({
      where: {
        fk_animalid: animalId
      },
      include: {
        animalraces: true
      }
    })
  },

  async update(data: animalraces): Promise<animalraces> {
    if (!data.id) throw new Error("ID is required for update");

    return await prisma.animalraces.update({ where: { id: data.id }, data: data });
  },

  async delete(id: number): Promise<void> {
    await prisma.animalraces.delete({ where: { id } });
  },
};
