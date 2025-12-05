import { prisma } from "../singletonPC";
import { AnimalGroup } from "../../generated/prisma";
import { ResourceNotFoundError } from "../exceptions/errors/ResourceNotFoundError";
import { AnimalGroupCreateType, AnimalGroupType } from "vetilib-shared/schemas/ZodSchemas";

export const animalGroupService = {
  async create(data: AnimalGroupCreateType): Promise<AnimalGroupType> {
    const created = await prisma.animalGroup.create({ data: data });
    return created;
  },

  async getById(id: number): Promise<AnimalGroupType> {
    const foundGroup = await prisma.animalGroup.findUnique({ where: { id } });

    if (!foundGroup) {
      throw new ResourceNotFoundError(`Animal group with ID ${id} does not exist`, "id", id);
    }

    return foundGroup;
  },

  async getAll(): Promise<AnimalGroupType[]> {
    return await prisma.animalGroup.findMany();
  },

  async update(data: AnimalGroupType): Promise<AnimalGroupType> {
    if (!data.id) {
      throw new ResourceNotFoundError("ID is required for update", "id", data.id);
    }

    const updatedGroup = await prisma.animalGroup.update({ where: { id: data.id }, data: data });

    return updatedGroup;
  },

  async delete(id: number): Promise<void> {
    await prisma.animalGroup.delete({ where: { id } });
  },
};
