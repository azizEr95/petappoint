import { prisma } from "../singletonPC";
import { veterinarypractices } from "../../generated/prisma";

export const veterinaryPracticeService = {
  async create(data: veterinarypractices): Promise<veterinarypractices> {
    return await prisma.veterinarypractices.create({ data: data });
  },

  async getById(id: number): Promise<veterinarypractices> {
    const foundPractice = await prisma.veterinarypractices.findUnique({ where: { id } });

    if (!foundPractice) throw new Error(`Veterinary Practice not found with id: ${id}`);

    return foundPractice;
  },

  async getByNameOrAdress(name: string): Promise<veterinarypractices[]> {
    return await prisma.veterinarypractices.findMany({
      include: {
        addresses: true,
      },
      where: {
        OR: [
          {
            name: { contains: name },
          },
          {
            addresses: {
              street: { contains: name },
              citycode: { contains: name },
              city: { contains: name },
              country: { contains: name },
            }
          }
        ]
      }
    });
  },

  async getByEmail(email: string): Promise<veterinarypractices | null> {
    return await prisma.veterinarypractices.findFirst({ where: { email } });
  },

  async getAll(): Promise<veterinarypractices[]> {
    return await prisma.veterinarypractices.findMany();
  },

  async update(data: veterinarypractices): Promise<veterinarypractices> {
    if (!data.id) throw new Error("ID is required for update");

    return await prisma.veterinarypractices.update({ where: { id: data.id }, data: data });
  },

  async delete(id: number): Promise<void> {
    await prisma.veterinarypractices.delete({ where: { id } });
  },
};
