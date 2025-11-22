import { prisma } from "../singletonPC";
import { VeterinaryPracticesCreateType, VeterinaryPracticesType } from "vetlib-shared/schemas/ZodSchemas";
import { addressService } from "./addressService";

export const veterinaryPracticeService = {
  async create(veterinaryPracticeRe: VeterinaryPracticesCreateType): Promise<VeterinaryPracticesType> {
    return await prisma.veterinarypractices.create({
      include: {
        addresses: true
      },
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

  async getById(id: string): Promise<VeterinaryPracticesType> {
    const foundPractice = await prisma.veterinarypractices.findUnique({
      include: {
        addresses: true,
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

  async getByNameOrAdress(name: string, address: string): Promise<VeterinaryPracticesType[]> {
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

  async getByEmail(email: string): Promise<VeterinaryPracticesType | null> {
    return await prisma.veterinarypractices.findFirst({
      include: {
        addresses: true
      },

      where: {
        email
      }
    });
  },

  async getAll(): Promise<VeterinaryPracticesType[]> {
    return await prisma.veterinarypractices.findMany({
      include: {
        addresses: true
      }
    });
  },

  async update(data: VeterinaryPracticesType): Promise<VeterinaryPracticesType> {
    if (!data.id) throw new Error("ID is required for update");

    await addressService.update(data.addresses);

    const updatedPractice = await prisma.veterinarypractices.update({
      where: { id: data.id },
      data: {
        name: data.name,
        phone: data.phone,
        email: data.email,
        //password: data.password,
        infoemail: data.infoemail,
        info: data.info,
        website: data.website,
      },
      include: { addresses: true },
    });

    return updatedPractice;
  },


  async delete(id: number): Promise<void> {
    await prisma.veterinarypractices.delete({
      where: { id }
    });
  },
};
