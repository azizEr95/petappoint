import { prisma } from "../singletonPC";
import { AnimalHasRace, AnimalRace } from "../../generated/prisma";
import { AnimalracesCreateType, AnimalracesType } from "petappoint-shared/schemas/ZodSchemas";
import { ResourceNotFoundError } from "../exceptions/errors/ResourceNotFoundError";

export const animalRaceService = {
  async create(data: AnimalracesCreateType): Promise<AnimalracesType> {
    let created = await prisma.animalRace.create({
      data: {
        name: data.name,
        // relation zu animaltypes
        // connectOrCreate gibt es auch. Aber sollte das vom Kunden aus möglich sein?
        // Kann er sich ein spaß erlauben und sagen mein race hat den type ugga-buuga
        // wäre doch besser, wenn er nur welche auswählen kann die wir vorgeben
        // https://www.prisma.io/docs/orm/prisma-client/queries/relation-queries#nested-writes
        animalType: { connect: { id: data.animalTypeId } },
      },
    });

    return {
      id: created.id,
      name: created.name,
      animalTypeId: created.animalTypeId,
    };
  },

  async getById(id: number): Promise<AnimalracesType> {
    const foundAnimalRace = await prisma.animalRace.findUnique({ where: { id } });

    if (!foundAnimalRace) {
      throw new ResourceNotFoundError(`Animal Kind not found with id: ${id}`, "id", id);
    }

    return {
      id: foundAnimalRace.id,
      name: foundAnimalRace.name,
      animalTypeId: foundAnimalRace.animalTypeId,
    };
  },

  async getByName(name: string): Promise<AnimalracesType> {
    const foundAnimalRace = await prisma.animalRace.findFirst({ where: { name } });

    if (!foundAnimalRace) {
      throw new ResourceNotFoundError(`Animal Race not found with name: ${name}`, "name", name);
    }

    return {
      id: foundAnimalRace.id,
      name: foundAnimalRace.name,
      animalTypeId: foundAnimalRace.animalTypeId,
    };
  },

  async getAll(): Promise<AnimalracesType[]> {
    return (await prisma.animalRace.findMany()).map((x) => ({
      id: x.id,
      name: x.name,
      animalTypeId: x.animalTypeId,
    }));
  },

  async getAllForAnimalType(animalTypeId: number): Promise<AnimalracesType[]> {
    return (
      await prisma.animalRace.findMany({
        where: {
          animalTypeId: animalTypeId,
        },
      })
    ).map((x) => ({
      id: x.id,
      name: x.name,
      animalTypeId: x.animalTypeId,
    }));
  },

  async getAnimalRaces(animalId: number): Promise<AnimalracesType[]> {
    return (
      await prisma.animalHasRace.findMany({
        where: {
          animalId: animalId,
        },
        include: {
          animalRace: true,
        },
      })
    ).map((x) => ({
      id: x.animalRace.id,
      name: x.animalRace.name,
      animalTypeId: x.animalRace.animalTypeId,
    }));
  },

  async update(data: AnimalracesType): Promise<AnimalracesType> {
    const updated = await prisma.animalRace.update({ where: { id: data.id }, data: data });
    return {
      id: updated.id,
      name: updated.name,
      animalTypeId: updated.animalTypeId,
    };
  },

  async delete(id: number): Promise<void> {
    await prisma.animalRace.delete({ where: { id } });
  },
};
