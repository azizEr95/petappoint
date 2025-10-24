import { prisma } from "../singletonPC";
import { AnimalTypeResource } from "src/Resource";

export const animalTypeService = {
  // Create
  async create(data: AnimalTypeResource): Promise<AnimalTypeResource> {
    const createdAnimalType = await prisma.animaltypes.create({
      data: {
        name: data.name,
        fk_animalkindid: data.animalKindId,
      },
    });

    return mapAnimalTypeToResource(createdAnimalType);
  },

  // Read by ID
  async getById(id: number): Promise<AnimalTypeResource> {
    const foundAnimalType = await prisma.animaltypes.findUnique({
      where: { id },
      include: {
        animals: true, // Optional: Tiere dieses Typs
        animalkinds: true, // Optional: Tierart
      },
    });

    if (!foundAnimalType) {
      throw new Error(`Animal Type not found with id: ${id}`);
    }

    return mapAnimalTypeToResource(foundAnimalType);
  },

  // Update
  async update(data: AnimalTypeResource): Promise<AnimalTypeResource> {
    if (!data.id) {
      throw new Error("ID is required for update");
    }

    const updatedAnimalType = await prisma.animaltypes.update({
      where: { id: data.id },
      data: {
        name: data.name,
        fk_animalkindid: data.animalKindId,
      },
    });

    return mapAnimalTypeToResource(updatedAnimalType);
  },

  // Delete
  async delete(id: number): Promise<void> {
    await prisma.animaltypes.delete({
      where: { id },
    });
  },

  // List all animal types
  async getAll(): Promise<AnimalTypeResource[]> {
    const animalTypes = await prisma.animaltypes.findMany({
      include: {
        animalkinds: true,
      },
    });
    return animalTypes.map(mapAnimalTypeToResource);
  },

  // Optional: Find by name
  async getByName(name: string): Promise<AnimalTypeResource | null> {
    const foundAnimalType = await prisma.animaltypes.findFirst({
      where: { name },
      include: {
        animals: true,
        animalkinds: true,
      },
    });

    return foundAnimalType ? mapAnimalTypeToResource(foundAnimalType) : null;
  },
};

// Helper function to map Prisma animaltypes to resource
function mapAnimalTypeToResource(animalType: any): AnimalTypeResource {
  return {
    id: animalType.id,
    name: animalType.name,
    animalKindId: animalType.fk_animalkindid,
  };
}
