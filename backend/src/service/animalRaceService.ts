import { prisma } from "../singletonPC";
import { animal_has_races, animal_races } from "../../generated/prisma";
import { AnimalracesCreateType, AnimalracesType } from "vetlib-shared/schemas/ZodSchemas";
import { ResourceNotFoundError } from "../exceptions/errors/ResourceNotFoundError";

export const animalRaceService = {
  async create(data: AnimalracesCreateType): Promise<AnimalracesType> {
    let created = await prisma.animal_races.create({
      data: {
        name: data.name,
        // relation zu animaltypes
        // connectOrCreate gibt es auch. Aber sollte das vom Kunden aus möglich sein?
        // Kann er sich ein spaß erlauben und sagen mein race hat den type ugga-buuga
        // wäre doch besser, wenn er nur welche auswählen kann die wir vorgeben
        // https://www.prisma.io/docs/orm/prisma-client/queries/relation-queries#nested-writes
        animal_types: { connect: { id: data.animaltypeid } },
      },
    });

    return {
      id: created.id,
      name: created.name,
      animaltypeid: created.fk_animaltypeid,
    };
  },

  async getById(id: number): Promise<AnimalracesType> {
    const foundAnimalRace = await prisma.animal_races.findUnique({ where: { id } });

    if (!foundAnimalRace) {
      throw new ResourceNotFoundError(`Animal Kind not found with id: ${id}`, "id", id);
    }

    return {
      id: foundAnimalRace.id,
      name: foundAnimalRace.name,
      animaltypeid: foundAnimalRace.fk_animaltypeid,
    };
  },

  async getByName(name: string): Promise<AnimalracesType> {
    const foundAnimalRace = await prisma.animal_races.findFirst({ where: { name } });

    if (!foundAnimalRace) {
      throw new ResourceNotFoundError(`Animal Race not found with name: ${name}`, "name", name);
    }

    return {
      id: foundAnimalRace.id,
      name: foundAnimalRace.name,
      animaltypeid: foundAnimalRace.fk_animaltypeid,
    };
  },

  async getAll(): Promise<AnimalracesType[]> {
    return (await prisma.animal_races.findMany()).map((x) => ({
      id: x.id,
      name: x.name,
      animaltypeid: x.fk_animaltypeid,
    }));
  },

  async getAllForAnimalType(animalTypeId: number): Promise<AnimalracesType[]> {
    return (
      await prisma.animal_races.findMany({
        where: {
          fk_animaltypeid: animalTypeId,
        },
      })
    ).map((x) => ({
      id: x.id,
      name: x.name,
      animaltypeid: x.fk_animaltypeid,
    }));
  },

  async getAnimalRaces(animalId: number): Promise<AnimalracesType[]> {
    return (
      await prisma.animal_has_races.findMany({
        where: {
          fk_animalid: animalId,
        },
        include: {
          animalraces: true,
        },
      })
    ).map((x) => ({
      id: x.animalraces.id,
      name: x.animalraces.name,
      animaltypeid: x.animalraces.fk_animaltypeid,
    }));
  },

  async update(data: AnimalracesType): Promise<AnimalracesType> {
    const updated = await prisma.animal_races.update({ where: { id: data.id }, data: data });
    return {
      id: updated.id,
      name: updated.name,
      animaltypeid: updated.fk_animaltypeid,
    };
  },

  async delete(id: number): Promise<void> {
    await prisma.animal_races.delete({ where: { id } });
  },
};
