import { prisma } from "../singletonPC";
import { recipes } from "../../generated/prisma";

export const recipeService = {
  async create(data: recipes): Promise<recipes> {
    return await prisma.recipes.create({ data: data });
  },

  async getById(id: number): Promise<recipes> {
    const found = await prisma.recipes.findUnique({ where: { id } });

    if (!found) throw new Error(`Recipe does not exist with id ${id} `);

    return found;
  },

  async getAll(): Promise<recipes[]> {
    return await prisma.recipes.findMany();
  },

  async update(data: recipes): Promise<recipes> {
    if (!data.id) throw new Error("ID is required for update");

    return await prisma.recipes.update({ where: { id: data.id }, data: data });
  },

  async delete(id: number): Promise<void> {
    await prisma.recipes.delete({ where: { id } });
  },
};
