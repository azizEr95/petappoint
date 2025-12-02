import { AnimalHasVaccination } from "../../generated/prisma";
import { prisma } from "../singletonPC";

export const animalHasVaccinationService = {
  async create(data: AnimalHasVaccination): Promise<AnimalHasVaccination> {
    return await prisma.animalHasVaccination.create({ data: data });
  },

  async getAnimalByVacinationId(vaccinationId: number) {
    const animalAndVacination = await prisma.animalHasVaccination.findMany({
      where: { vaccinationId: vaccinationId },
      include: {
        animal: true,
        vaccination: true,
      },
    });

    return animalAndVacination.map((aV) => ({
      animal: aV.animal,
      vaccination: aV.vaccination,
    }));
  },

  async getVaccinationByAnimalId(animalId: number) {
    const animalAndVacination = await prisma.animalHasVaccination.findMany({
      where: { animalId: animalId },
      include: {
        animal: true,
        vaccination: true,
      },
    });

    return animalAndVacination.map((aV) => ({
      animal: aV.animal,
      vaccination: aV.vaccination,
    }));
  },

  async delete(data: AnimalHasVaccination): Promise<void> {
    await prisma.animalHasVaccination.delete({ where: { id: data.id } });
  },

  async exists(data: AnimalHasVaccination): Promise<boolean> {
    const association = await prisma.animalHasVaccination.findUnique({ where: { id: data.id } });

    return !!association;
  },
};
