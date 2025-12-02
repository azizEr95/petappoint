import { prisma } from "../singletonPC";
import { Review } from "../../generated/prisma";

export const reviewService = {
  async create(data: Review): Promise<Review> {
    return await prisma.review.create({ data: data });
  },

  async getById(id: number): Promise<Review> {
    const found = await prisma.review.findUnique({ where: { id } });

    if (!found) throw new Error(`Review does not exist with id ${id} `);

    return found;
  },

  async getAll(): Promise<Review[]> {
    return await prisma.review.findMany();
  },

  async update(data: Review): Promise<Review> {
    if (!data.id) throw new Error("ID is required for update");

    return await prisma.review.update({ where: { id: data.id }, data: data });
  },

  async delete(id: number): Promise<void> {
    await prisma.review.delete({ where: { id } });
  },
};
