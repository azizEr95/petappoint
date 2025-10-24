import { prisma } from "../singletonPC";
import { VeterinaryResource } from "src/Resource";

export const veterinaryService = {
  // Create
  async create(data: VeterinaryResource): Promise<VeterinaryResource> {
    const createdVeterinary = await prisma.veterinaries.create({
      data: {
        id: data.id,
        infoemail: data.infoEmail,
        fk_veterinarypractice: data.veterinaryPracticeId,
      },
    });

    return mapVeterinaryToResource(createdVeterinary);
  },

  // Read by ID
  async getById(id: number): Promise<VeterinaryResource> {
    const foundVeterinary = await prisma.veterinaries.findUnique({
      where: { id },
      include: {
        appointments: true,
        veterinarypractices: true,
        persons: true,
        veterinary_has_specialization: {
          include: {
            specializations: true,
          },
        },
      },
    });

    if (!foundVeterinary) {
      throw new Error(`Veterinary not found with id: ${id}`);
    }

    return mapVeterinaryToResource(foundVeterinary);
  },

  // Update
  async update(data: VeterinaryResource): Promise<VeterinaryResource> {
    const updatedVeterinary = await prisma.veterinaries.update({
      where: { id: data.id },
      data: {
        infoemail: data.infoEmail,
        fk_veterinarypractice: data.veterinaryPracticeId,
      },
    });

    return mapVeterinaryToResource(updatedVeterinary);
  },

  // Delete
  async delete(id: number): Promise<void> {
    await prisma.veterinaries.delete({
      where: { id },
    });
  },

  // List all veterinaries
  async getAll(): Promise<VeterinaryResource[]> {
    const veterinaries = await prisma.veterinaries.findMany({
      include: {
        veterinarypractices: true,
        veterinary_has_specialization: {
          include: {
            specializations: true,
          },
        },
      },
    });
    return veterinaries.map(mapVeterinaryToResource);
  },

  // Find veterinaries by practice
  async getByPractice(practiceId: number): Promise<VeterinaryResource[]> {
    const veterinaries = await prisma.veterinaries.findMany({
      where: { fk_veterinarypractice: practiceId },
      include: {
        veterinarypractices: true,
      },
    });

    return veterinaries.map(mapVeterinaryToResource);
  },
};

// Helper function to map Prisma veterinaries to resource
function mapVeterinaryToResource(veterinary: any): VeterinaryResource {
  return {
    id: veterinary.id,
    infoEmail: veterinary.infoemail,
    veterinaryPracticeId: veterinary.fk_veterinarypractice,
  };
}
