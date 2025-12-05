import { AddRacesToAnimalType, Animal_has_RacesType, AnimalracesType } from "vetilib-shared/schemas/ZodSchemas";
import { AnimalHasRace } from "../../generated/prisma";
import { prisma } from "../singletonPC";

export const animalHasRacesService = {
  async create(data: AddRacesToAnimalType): Promise<AddRacesToAnimalType> {
    const created = await prisma.animalHasRace.createMany({
      data: data.animalraceids.map((x) => ({
        animalId: data.animalId,
        animalRaceId: x,
      })),
      skipDuplicates: true,
    });

    return data;
  },

  async getAnimalByRacesId(racesId: number) {
    const animalAndRaces = await prisma.animalHasRace.findMany({
      where: { animalRaceId: racesId },
      include: {
        animal: true,
        animalRace: true,
      },
    });

    return animalAndRaces.map((pa) => ({
      animal: pa.animal,
      animalRace: pa.animalRace,
    }));
  },

  async getRacesByAnimalId(animalId: number) {
    const racesAndAnimal = await prisma.animalHasRace.findMany({
      where: { animalId: animalId },
      include: {
        animal: true,
        animalRace: true,
      },
    });

    return racesAndAnimal.map((pa) => ({
      animal: pa.animal,
      animalRace: pa.animalRace,
    }));
  },

  async delete(data: AnimalHasRace): Promise<void> {
    await prisma.animalHasRace.delete({
      where: {
        animalId_animalRaceId: {
          animalId: data.animalId,
          animalRaceId: data.animalRaceId,
        },
      },
    });
  },

  async deleteAllRacesFromAnimal(animalId: number): Promise<void> {
    await prisma.animalHasRace.deleteMany({
      where: {
        animalId: animalId,
      },
    });
  },

  async exists(data: AnimalHasRace): Promise<boolean> {
    const association = await prisma.animalHasRace.findUnique({
      where: {
        animalId_animalRaceId: {
          animalId: data.animalId,
          animalRaceId: data.animalRaceId,
        },
      },
    });

    return !!association;
  },
};
