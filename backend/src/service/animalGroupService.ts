import { prisma } from "../singletonPC";
import { animalgroup } from "../../generated/prisma";
import { ResourceNotFoundError } from "../exceptions/errors/ResourceNotFoundError";
import { AnimalGroupCreateType, AnimalGroupType } from "vetlib-shared/schemas/ZodSchemas";

export const animalGroupService = {
  async create(data: AnimalGroupCreateType): Promise<AnimalGroupType> {
    const created = await prisma.animalgroup.create({ data: data });
    return created;
  },

  async getById(id: number): Promise<AnimalGroupType> {
    const foundGroup = await prisma.animalgroup.findUnique({ where: { id } });

    if (!foundGroup) {
      throw new ResourceNotFoundError(`Animal group with ID ${id} does not exist`, 'id', id);
    }

    return foundGroup;
  },

  async getAll(): Promise<AnimalGroupType[]> {
    return await prisma.animalgroup.findMany();
  },

  async update(data: AnimalGroupType): Promise<AnimalGroupType> {
    if (!data.id) {
      throw new ResourceNotFoundError("ID is required for update", 'id', data.id);
    }

    const updatedGroup = await prisma.animalgroup.update({ where: { id: data.id }, data: data });

    return updatedGroup;
  },

  async delete(id: number): Promise<void> {
    await prisma.animalgroup.delete({ where: { id } });
  },
};
