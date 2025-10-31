import { prisma } from "../singletonPC";
import { reviews } from "../../generated/prisma";

export const reviewService = {
  async create(data: reviews): Promise<reviews> {
    return await prisma.reviews.create({ data: data });
  },

  async getById(id: number): Promise<reviews> {
    const found = await prisma.reviews.findUnique({ where: { id } });

    if (!found) throw new Error(`Review does not exist with id ${id} `);

    return found;
  },

  async getAll(): Promise<reviews[]> {
    return await prisma.reviews.findMany();
  },

  async update(data: reviews): Promise<reviews> {
    if (!data.id) throw new Error("ID is required for update");

    return await prisma.reviews.update({ where: { id: data.id }, data: data });
  },

  async delete(id: number): Promise<void> {
    await prisma.reviews.delete({ where: { id } });
  },
};
