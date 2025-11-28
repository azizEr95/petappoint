import { prisma } from "../singletonPC";
import { addresses } from "../../generated/prisma";
import { AddressesCreateType, AddressesType } from "vetlib-shared/schemas/ZodSchemas";

export const addressService = {
  async create(data: AddressesCreateType): Promise<AddressesType> {
    const createdAddress = await prisma.addresses.create({ data: {
      city: data.city,
      citycode: data.citycode,
      country: data.country,
      latitude: data.latitude,
      longitude: data.longitude,
      street: data.street
    } });
    return createdAddress;
  },

  async getById(id: number): Promise<addresses> {
    const foundAddress = await prisma.addresses.findUnique({ where: { id } });

    if (!foundAddress) throw new Error(`Address with ${id} does not exist`);

    return foundAddress;
  },

  async getAll(): Promise<addresses[]> {
    return await prisma.addresses.findMany();
  },

  async update(data: addresses): Promise<addresses> {
    if (!data.id) throw new Error("ID is required for update");

    const updatedAddress = await prisma.addresses.update({
      where: { id: data.id },
      data: data,
    });

    return updatedAddress;
  },

  async delete(id: number): Promise<void> {
    await prisma.addresses.delete({ where: { id } });
  },
};
