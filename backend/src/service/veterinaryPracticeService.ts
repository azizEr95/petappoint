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

  async getByName(name: string): Promise<veterinarypractices[]> {
    return await prisma.veterinarypractices.findMany({ where:
       { name: {
        contains: name
       }} 
    });
  },

  async getByEmail(email: string): Promise<veterinarypractices | null> {
    return await prisma.veterinarypractices.findFirst({ where: { email } });
  },

  async getByAddress(addressId: number): Promise<veterinarypractices[]> {
    return await prisma.veterinarypractices.findMany({ where: { fk_addressid: addressId } });
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
