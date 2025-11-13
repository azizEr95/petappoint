import { prisma } from "../singletonPC";
import { veterinarypractices } from "../../generated/prisma";

type veterinaryPracticeWithAdress = {
  name: string,
  phone: string,
  infoemail: string,
  email: string,
  password: string,
  website: string,
  info: string,
  addresses: {
    street: string,
    citycode: string,
    city: string,
    country: string,
    longitude: number,
    latitude: number
  }
}

export const veterinaryPracticeService = {
  async create(veterinaryPracticeRe: veterinaryPracticeWithAdress): Promise<veterinarypractices> {
    return await prisma.veterinarypractices.create({
      data: {
        name: veterinaryPracticeRe.name,
        phone: veterinaryPracticeRe.phone,
        infoemail: veterinaryPracticeRe.infoemail,
        email: veterinaryPracticeRe.email,
        password: veterinaryPracticeRe.password,
        addresses: {
          create: veterinaryPracticeRe.addresses
        }
      }
    });
  },

  async getById(id: number): Promise<veterinarypractices> {
    const foundPractice = await prisma.veterinarypractices.findUnique({ where: { id } });

    if (!foundPractice) throw new Error(`Veterinary Practice not found with id: ${id}`);

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
