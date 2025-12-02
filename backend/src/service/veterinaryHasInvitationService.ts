import { prisma } from "../singletonPC";
import { VeterinaryHasInvitation } from "../../generated/prisma";

export const veterinaryHasInvitationService = {
  async create(data: VeterinaryHasInvitation): Promise<VeterinaryHasInvitation> {
    return await prisma.veterinaryHasInvitation.create({ data: data });
  },

  async getById(veterinaryId: number, practiceId: number): Promise<VeterinaryHasInvitation> {
    const found = await prisma.veterinaryHasInvitation.findUnique({
      where: {
        veterinaryId_veterinaryPracticeId: {
          veterinaryId: veterinaryId,
          veterinaryPracticeId: practiceId,
        },
      },
    });

    if (!found) throw new Error(`Invitation not found`);

    return found;
  },

  async getAll(): Promise<VeterinaryHasInvitation[]> {
    return await prisma.veterinaryHasInvitation.findMany();
  },

  async delete(veterinaryId: number, practiceId: number): Promise<void> {
    await prisma.veterinaryHasInvitation.delete({
      where: {
        veterinaryId_veterinaryPracticeId: {
          veterinaryId: veterinaryId,
          veterinaryPracticeId: practiceId,
        },
      },
    });
  },
};
