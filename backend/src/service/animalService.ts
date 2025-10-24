import { prisma } from "../singletonPC";
import { AnimalResource } from "src/Resource";

export const animalService = {
  // Create
  async create(data: AnimalResource): Promise<AnimalResource> {
    const createdAnimal = await prisma.animals.create({
      data: {
        name: data.name,
        dateofbirth: data.dateOfBirth,
        fk_animaltypeid: data.animalTypeId,
      },
    });

    return mapAnimalToResource(createdAnimal);
  },

  // Read by ID
  async getById(id: number): Promise<AnimalResource> {
    const foundAnimal = await prisma.animals.findUnique({
      where: { id },
      include: {
        animaltypes: true, // Optional: laden der Tierart
        appointments: true, // Optional: Termine
        person_has_animal: true, // Optional: Besitzerinformationen
      },
    });

    if (!foundAnimal) {
      throw new Error(`Animal not found with id: ${id}`);
    }

    return mapAnimalToResource(foundAnimal);
  },

  // Update
  async update(data: AnimalResource): Promise<AnimalResource> {
    if (!data.id) {
      throw new Error("ID is required for update");
    }

    const updatedAnimal = await prisma.animals.update({
      where: { id: data.id },
      data: {
        name: data.name,
        dateofbirth: data.dateOfBirth,
        fk_animaltypeid: data.animalTypeId,
      },
    });

    return mapAnimalToResource(updatedAnimal);
  },

  // Delete
  async delete(id: number): Promise<void> {
    await prisma.animals.delete({
      where: { id },
    });
  },

  // List all animals
  async getAll(): Promise<AnimalResource[]> {
    const animals = await prisma.animals.findMany({
      include: {
        animaltypes: true,
      },
    });
    return animals.map(mapAnimalToResource);
  },
};

// Helper function to map Prisma animals to resource
function mapAnimalToResource(animal: any): AnimalResource {
  return {
    id: animal.id,
    name: animal.name,
    dateOfBirth: animal.dateofbirth,
    animalTypeId: animal.fk_animaltypeid,
  };
}
