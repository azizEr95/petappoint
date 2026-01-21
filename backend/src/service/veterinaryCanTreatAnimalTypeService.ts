import { prisma } from '../singletonPC';

export const veterinaryCanTreatAnimalTypeService = {
  async create(data: { veterinaryId: number; animalTypeIds: number[] }): Promise<void> {
    await prisma.veterinaryCanTreatAnimalType.createMany({
      data: data.animalTypeIds.map((typeId) => ({
        veterinaryId: data.veterinaryId,
        animalTypeId: typeId,
      })),
      skipDuplicates: true,
    });
  },

  async deleteAllForVeterinary(veterinaryId: number): Promise<void> {
    await prisma.veterinaryCanTreatAnimalType.deleteMany({
      where: { veterinaryId },
    });
  },
};
