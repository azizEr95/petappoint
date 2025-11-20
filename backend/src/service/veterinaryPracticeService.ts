import { prisma } from "../singletonPC";
import { veterinarypractices } from "../../generated/prisma";
import { VeterinaryPracticesCreateType, VeterinaryPracticesType } from "vetlib-shared/schemas/ZodSchemas";

export const veterinaryPracticeService = {
  async create(veterinaryPracticeRe: VeterinaryPracticesCreateType): Promise<veterinarypractices> {
    return await prisma.veterinarypractices.create({
      data: {
        name: veterinaryPracticeRe.name,
        phone: veterinaryPracticeRe.phone,
        infoemail: veterinaryPracticeRe.infoemail,
        email: veterinaryPracticeRe.email,
        password: veterinaryPracticeRe.password,
        addresses: {
          create: veterinaryPracticeRe.addresses
        },
        services: {
          create: {
            name: "Allgemeine Untersuchung",
            estimateddurationinminutes: 60,
          }
        }
      }
    });
  },

  async getById(id: string): Promise<VeterinaryPracticesType> {
    const foundPractice = await prisma.veterinarypractices.findUnique({
      include: {
        addresses: true,
        services: {
          omit: {
            fk_veterinarypracticeid: true
          }
        }
      },
      omit: {
        fk_addressid: true
      },
      where: {
        id: parseInt(id)
      }
    });

    if (!foundPractice) {
      throw new Error(`Veterinary Practice not found with id: ${id}`);
    }

    return foundPractice;
  },

  async getByNameOrAdress(name: string, address: string): Promise<veterinarypractices[]> {
    return await prisma.veterinarypractices.findMany({
      include: {
        addresses: true
      },
      where: {
        AND: [
          name.length <= 0 ? {} : {
            name: {
              contains: name,
              mode: "insensitive"
            }
          },
          address.length <= 0 ? {} : {
            addresses: {
              OR: [
                {
                  street: {
                    contains: address,
                    mode: "insensitive"
                  }
                },
                {
                  city: {
                    contains: address,
                    mode: "insensitive"
                  }
                },
                {
                  citycode: {
                    contains: address,
                    mode: "insensitive"
                  }
                },
                {
                  country: {
                    contains: address,
                    mode: "insensitive"
                  }
                }
              ]
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
