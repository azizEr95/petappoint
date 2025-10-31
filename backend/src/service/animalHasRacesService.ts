import { animal_has_races } from "../../generated/prisma";
import { prisma } from "../singletonPC";

export const animalHasRacesService = {
  async create(data: animal_has_races): Promise<animal_has_races> {
    return await prisma.animal_has_races.create({ data: data });
  },

  async getAnimalByRacesId(racesId: number) {
    const animalAndRaces = await prisma.animal_has_races.findMany({
      where: { fk_animalraceid: racesId },
      include: {
        animals: true,
        animalraces: true,
      },
    });

    return animalAndRaces.map((pa) => ({
      animal: pa.animals,
      animalraces: pa.animalraces,
    }));
  },

  async getRacesByAnimalId(animalId: number) {
    const racesAndAnimal = await prisma.animal_has_races.findMany({
      where: { fk_animalid: animalId },
      include: {
        animals: true,
        animalraces: true,
      },
    });

    return racesAndAnimal.map((pa) => ({
      animal: pa.animals,
      animalraces: pa.animalraces,
    }));
  },

  async delete(data: animal_has_races): Promise<void> {
    await prisma.animal_has_races.delete({
      where: {
        fk_animalid_fk_animalraceid: {
          fk_animalid: data.fk_animalid,
          fk_animalraceid: data.fk_animalraceid,
        },
      },
    });
  },

  async exists(data: animal_has_races): Promise<boolean> {
    const association = await prisma.animal_has_races.findUnique({
      where: {
        fk_animalid_fk_animalraceid: {
          fk_animalid: data.fk_animalid,
          fk_animalraceid: data.fk_animalraceid,
        },
      },
    });

    return !!association;
  },
};
