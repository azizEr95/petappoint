import { prisma } from "../singletonPC";
import { veterinary_has_invitation } from "../../generated/prisma";

export const veterinaryHasInvitationService = {
  async create(data: veterinary_has_invitation): Promise<veterinary_has_invitation> {
    return await prisma.veterinary_has_invitation.create({ data: data });
  },

  async getById(veterinaryId: number, practiceId: number): Promise<veterinary_has_invitation> {
    const found = await prisma.veterinary_has_invitation.findUnique({
      where: {
        fk_veterinaryid_fk_veterinarypracticeid: {
          fk_veterinaryid: veterinaryId,
          fk_veterinarypracticeid: practiceId,
        },
      },
    });

    if (!found) throw new Error(`Invitation not found`);

    return found;
  },

  async getAll(): Promise<veterinary_has_invitation[]> {
    return await prisma.veterinary_has_invitation.findMany();
  },

  async delete(veterinaryId: number, practiceId: number): Promise<void> {
    await prisma.veterinary_has_invitation.delete({
      where: {
        fk_veterinaryid_fk_veterinarypracticeid: {
          fk_veterinaryid: veterinaryId,
          fk_veterinarypracticeid: practiceId,
        },
      },
    });
  },
};
