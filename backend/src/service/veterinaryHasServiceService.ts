import { prisma } from '../singletonPC';

export const veterinaryHasServiceService = {
  async create(data: { veterinaryId: number; serviceIds: number[] }): Promise<void> {
    await prisma.veterinaryHasService.createMany({
      data: data.serviceIds.map((serviceId) => ({
        veterinaryId: data.veterinaryId,
        serviceId,
        notes: null,
      })),
      skipDuplicates: true,
    });
  },

  async deleteAllForVeterinary(veterinaryId: number): Promise<void> {
    await prisma.veterinaryHasService.deleteMany({
      where: { veterinaryId },
    });
  },
};
