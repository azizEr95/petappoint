import { prisma } from "../singletonPC";
import { Recipe } from "../../generated/prisma";

export const recipeService = {
  async create(data: Recipe): Promise<Recipe> {
    return await prisma.recipe.create({ data: data });
  },

  async getById(id: number): Promise<Recipe> {
    const found = await prisma.recipe.findUnique({ where: { id } });

    if (!found) throw new Error(`Recipe does not exist with id ${id} `);

    return found;
  },

  async getAll(): Promise<Recipe[]> {
    return await prisma.recipe.findMany();
  },

  async update(data: Recipe): Promise<Recipe> {
    if (!data.id) throw new Error("ID is required for update");

    return await prisma.recipe.update({ where: { id: data.id }, data: data });
  },

  async delete(id: number): Promise<void> {
    await prisma.recipe.delete({ where: { id } });
  },
};
