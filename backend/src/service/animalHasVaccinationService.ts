import { animal_has_vaccination } from "../../generated/prisma";
import { prisma } from "../singletonPC";

export const animalHasVaccinationService = {
  async create(data: animal_has_vaccination): Promise<animal_has_vaccination> {
    return await prisma.animal_has_vaccination.create({ data: data });
  },

  async getAnimalByVacinationId(vaccinationId: number) {
    const animalAndVacination = await prisma.animal_has_vaccination.findMany({
      where: { fk_vaccinationid: vaccinationId },
      include: {
        animals: true,
        vaccinations: true,
      },
    });

    return animalAndVacination.map((aV) => ({
      animal: aV.animals,
      vaccinations: aV.vaccinations,
    }));
  },

  async getVaccinationByAnimalId(animalId: number) {
    const animalAndVacination = await prisma.animal_has_vaccination.findMany({
      where: { fk_animalid: animalId },
      include: {
        animals: true,
        vaccinations: true,
      },
    });

    return animalAndVacination.map((aV) => ({
      animal: aV.animals,
      vaccinations: aV.vaccinations,
    }));
  },

  async delete(data: animal_has_vaccination): Promise<void> {
    await prisma.animal_has_vaccination.delete({ where: { id: data.id } });
  },

  async exists(data: animal_has_vaccination): Promise<boolean> {
    const association = await prisma.animal_has_vaccination.findUnique({ where: { id: data.id } });

    return !!association;
  },
};
