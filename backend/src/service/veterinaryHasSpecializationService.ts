import { prisma } from "../singletonPC";
import { veterinary_has_specialization } from "../../generated/prisma";

export const veterinaryHasSpecializationService = {
  async create(data: veterinary_has_specialization): Promise<veterinary_has_specialization> {
    return await prisma.veterinary_has_specialization.create({ data: data });
  },

  async getSpecializationsByVeterinary(veterinaryId: number) {
    const vetSpecializations = await prisma.veterinary_has_specialization.findMany({
      where: { fk_veterinaryid: veterinaryId },
      include: {
        specializations: true,
        veterinaries: true,
      },
    });

    return vetSpecializations.map((vs) => ({
      specialization: vs.specializations,
      veterinary: vs.veterinaries,
    }));
  },

  async getVeterinariesBySpecialization(specializationId: number) {
    const vetSpecializations = await prisma.veterinary_has_specialization.findMany({
      where: { fk_specializationid: specializationId },
      include: {
        specializations: true,
        veterinaries: true,
      },
    });

    return vetSpecializations.map((vs) => ({
      specialization: vs.specializations,
      veterinary: vs.veterinaries,
    }));
  },

  async delete(data: veterinary_has_specialization): Promise<void> {
    await prisma.veterinary_has_specialization.delete({
      where: {
        fk_veterinaryid_fk_specializationid: {
          fk_veterinaryid: data.fk_veterinaryid,
          fk_specializationid: data.fk_specializationid,
        },
      },
    });
  },

  async exists(data: veterinary_has_specialization): Promise<boolean> {
    const association = await prisma.veterinary_has_specialization.findUnique({
      where: {
        fk_veterinaryid_fk_specializationid: {
          fk_veterinaryid: data.fk_veterinaryid,
          fk_specializationid: data.fk_specializationid,
        },
      },
    });

    return !!association;
  },
};
