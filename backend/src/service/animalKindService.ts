import { prisma } from "../singletonPC";
import { animalKindResource } from "src/Resource";

export const animalKindService = {
  // Create
  async create(data: animalKindResource): Promise<animalKindResource> {
    const createdAnimalKind = await prisma.animalkinds.create({
      data: {
        name: data.name,
      },
    });

    return mapAnimalKindToResource(createdAnimalKind);
  },

  // Read by ID
  async getById(id: number): Promise<animalKindResource> {
    const foundAnimalKind = await prisma.animalkinds.findUnique({
      where: { id },
    });

    if (!foundAnimalKind) {
      throw new Error(`Animal Kind not found with id: ${id}`);
    }

    // Konvertiere den Datenbank-Eintrag in eine Ressource
    return mapAnimalKindToResource(foundAnimalKind);
  },

  // Update
  async update(data: animalKindResource): Promise<animalKindResource> {
    if (!data.id) {
      throw new Error("ID is required for update");
    }

    const updatedAnimalKind = await prisma.animalkinds.update({
      where: { id: data.id },
      data: {
        name: data.name,
      },
    });

    return mapAnimalKindToResource(updatedAnimalKind);
  },

  // Delete
  async delete(id: number): Promise<void> {
    await prisma.animalkinds.delete({
      where: { id },
    });
  },

  // List all animal kinds
  async getAll(): Promise<animalKindResource[]> {
    const animalKinds = await prisma.animalkinds.findMany({
      include: {
        animaltypes: true, // Lädt zusätzlich verknüpfte animaltypes
      },
    });
    return animalKinds.map(mapAnimalKindToResource);
  },

  // Optional: Find by name
  async getByName(name: string): Promise<animalKindResource | null> {
    const foundAnimalKind = await prisma.animalkinds.findFirst({
      where: { name },
      include: {
        animaltypes: true,
      },
    });

    return foundAnimalKind ? mapAnimalKindToResource(foundAnimalKind) : null;
  },
};

// Helper function to map Prisma animalkinds to resource
function mapAnimalKindToResource(animalKind: any): animalKindResource {
  return {
    id: animalKind.id,
    name: animalKind.name,
  };
}
