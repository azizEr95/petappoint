import { prisma } from "../singletonPC";
import { addresses } from "../../generated/prisma";
import { AddressesCreateType, AddressesType } from "vetlib-shared/schemas/ZodSchemas";
import { ResourceNotFoundError } from "../exceptions/errors/ResourceNotFoundError";
import { ConstraintError } from "../exceptions/errors/ConstraintError";

export const addressService = {
  async create(data: AddressesCreateType): Promise<AddressesType> {
    const createdAddress = await prisma.addresses.create({
      data: {
        city: data.city,
        citycode: data.citycode,
        country: data.country,
        latitude: data.latitude,
        longitude: data.longitude,
        street: data.street,
      },
    });
    return createdAddress;
  },

  async getById(id: number): Promise<AddressesType> {
    const foundAddress = await prisma.addresses.findUnique({ where: { id } });

    if (!foundAddress) {
      throw new ResourceNotFoundError(`Address with ${id} does not exist`, "id", id);
    }

    return foundAddress;
  },

  async getAll(): Promise<AddressesType[]> {
    return await prisma.addresses.findMany();
  },

  async update(data: AddressesType): Promise<AddressesType> {
    if (!data.id) {
      throw new ConstraintError("ID is required for update", [{ path: "id", value: data.id }]);
    }

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
