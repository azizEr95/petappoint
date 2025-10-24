import { prisma } from "../singletonPC";
import { VeterinaryHasSpecializationResource } from "src/Resource";

export const veterinaryHasSpecializationService = {
  // Create (Verbindung zwischen Tierarzt und Spezialisierung)
  async create(
    data: VeterinaryHasSpecializationResource
  ): Promise<VeterinaryHasSpecializationResource> {
    const createdVetSpecialization =
      await prisma.veterinary_has_specialization.create({
        data: {
          fk_veterinaryid: data.veterinaryId,
          fk_specializationid: data.specializationId,
        },
      });

    return mapVetSpecializationToResource(createdVetSpecialization);
  },

  // Find all specializations for a specific veterinary
  async getSpecializationsByVeterinary(veterinaryId: number) {
    const vetSpecializations =
      await prisma.veterinary_has_specialization.findMany({
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

  // Find all veterinaries with a specific specialization
  async getVeterinariesBySpecialization(specializationId: number) {
    const vetSpecializations =
      await prisma.veterinary_has_specialization.findMany({
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

  // Remove association
  async delete(data: VeterinaryHasSpecializationResource): Promise<void> {
    await prisma.veterinary_has_specialization.delete({
      where: {
        fk_veterinaryid_fk_specializationid: {
          fk_veterinaryid: data.veterinaryId,
          fk_specializationid: data.specializationId,
        },
      },
    });
  },

  // Check if association exists
  async exists(data: VeterinaryHasSpecializationResource): Promise<boolean> {
    const association = await prisma.veterinary_has_specialization.findUnique({
      where: {
        fk_veterinaryid_fk_specializationid: {
          fk_veterinaryid: data.veterinaryId,
          fk_specializationid: data.specializationId,
        },
      },
    });

    return !!association;
  },
};

// Helper function to map Prisma veterinary_has_specialization to resource
function mapVetSpecializationToResource(
  vetSpecialization: any
): VeterinaryHasSpecializationResource {
  return {
    veterinaryId: vetSpecialization.fk_veterinaryid,
    specializationId: vetSpecialization.fk_specializationid,
  };
}
