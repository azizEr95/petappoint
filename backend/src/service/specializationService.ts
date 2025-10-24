import { prisma } from "../singletonPC";
import { SpecializationResource } from "src/Resource";

export const specializationService = {
  // Create
  async create(data: SpecializationResource): Promise<SpecializationResource> {
    const createdSpecialization = await prisma.specializations.create({
      data: {
        name: data.name,
      },
    });

    return mapSpecializationToResource(createdSpecialization);
  },

  // Read by ID
  async getById(id: number): Promise<SpecializationResource> {
    const foundSpecialization = await prisma.specializations.findUnique({
      where: { id },
      include: {
        veterinary_has_specialization: true,
      },
    });

    if (!foundSpecialization) {
      throw new Error(`Specialization not found with id: ${id}`);
    }

    return mapSpecializationToResource(foundSpecialization);
  },

  // Update
  async update(data: SpecializationResource): Promise<SpecializationResource> {
    if (!data.id) {
      throw new Error("ID is required for update");
    }

    const updatedSpecialization = await prisma.specializations.update({
      where: { id: data.id },
      data: {
        name: data.name,
      },
    });

    return mapSpecializationToResource(updatedSpecialization);
  },

  // Delete
  async delete(id: number): Promise<void> {
    await prisma.specializations.delete({
      where: { id },
    });
  },

  // List all specializations
  async getAll(): Promise<SpecializationResource[]> {
    const specializations = await prisma.specializations.findMany({
      include: {
        veterinary_has_specialization: true,
      },
    });
    return specializations.map(mapSpecializationToResource);
  },

  // Find by name
  async getByName(name: string): Promise<SpecializationResource | null> {
    const specialization = await prisma.specializations.findFirst({
      where: { name },
    });

    return specialization ? mapSpecializationToResource(specialization) : null;
  },
};

// Helper function to map Prisma specializations to resource
function mapSpecializationToResource(
  specialization: any
): SpecializationResource {
  return {
    id: specialization.id,
    name: specialization.name,
  };
}
