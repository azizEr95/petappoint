import { prisma } from "../singletonPC";
import { animal_has_races, animalraces } from "../../generated/prisma";
import { AnimalracesType } from "vetlib-shared/schemas/ZodSchemas";

export const animalRaceService = {
  async create(data: animalraces): Promise<AnimalracesType> {
    let created = await prisma.animalraces.create({
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

    return ({
      id: created.id,
      name: created.name,
      animaltypeid: created.fk_animaltypeid
    });
  },

  async getById(id: number): Promise<AnimalracesType> {
    const foundAnimalRace = await prisma.animalraces.findUnique({ where: { id } });

    if (!foundAnimalRace) throw new Error(`Animal Kind not found with id: ${id}`);

    return ({
      id: foundAnimalRace.id,
      name: foundAnimalRace.name,
      animaltypeid: foundAnimalRace.fk_animaltypeid
    });
  },

  async getByName(name: string): Promise<AnimalracesType> {
    const foundAnimalRace = await prisma.animalraces.findFirst({ where: { name } });

    if (!foundAnimalRace) throw new Error(`Animal Race not found with name: ${name}`);

    return ({
      id: foundAnimalRace.id,
      name: foundAnimalRace.name,
      animaltypeid: foundAnimalRace.fk_animaltypeid
    });
  },

  async getAll(): Promise<AnimalracesType[]> {
    return (await prisma.animalraces.findMany()).map(x => ({
      id: x.id,
      name: x.name,
      animaltypeid: x.fk_animaltypeid
    }));
  },

  async getAllForAnimalType(animalTypeId: number): Promise<AnimalracesType[]> {
    if (!Number.isInteger(animalTypeId)) {
      throw new Error("animalTypeId needs to be an integer.");
    }

    return (await prisma.animalraces.findMany({
      where: {
        fk_animaltypeid: animalTypeId
      }
    })).map(x => ({
      id: x.id,
      name: x.name,
      animaltypeid: x.fk_animaltypeid
    }));
  },

  async getAnimalRaces(animalId: number): Promise<AnimalracesType[]> {
    if (!Number.isInteger(animalId)) {
      throw new Error("animalId needs to be an integer.");
    }

    return (await prisma.animal_has_races.findMany({
      where: {
        fk_animalid: animalId
      },
      include: {
        animalraces: true
      }
    })).map(x => ({
      id: x.animalraces.id,
      name: x.animalraces.name,
      animaltypeid: x.animalraces.fk_animaltypeid
    }));
  },

  async update(data: AnimalracesType): Promise<AnimalracesType> {
    if (!data.id) throw new Error("ID is required for update");

    const updated = await prisma.animalraces.update({ where: { id: data.id }, data: data });
    return ({
      id: updated.id,
      name: updated.name,
      animaltypeid: updated.fk_animaltypeid
    });
  },

  async delete(id: number): Promise<void> {
    await prisma.animalraces.delete({ where: { id } });
  },
};
