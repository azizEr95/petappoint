import { prisma } from "../singletonPC";
import { AddressesCreateType, AddressesType } from "vetilib-shared/schemas/ZodSchemas";
import { ResourceNotFoundError } from "../exceptions/errors/ResourceNotFoundError";
import { ConstraintError } from "../exceptions/errors/ConstraintError";
import { mapToAddress } from "../helper/mapToAddress";

export const addressService = {
  async create(data: AddressesCreateType): Promise<AddressesType> {
    const createdAddress = await prisma.address.create({
      data: {
        city: data.city,
        cityCode: data.cityCode,
        fk_country: data.country,
        latitude: data.latitude,
        longitude: data.longitude,
        street: data.street,
      },
    });
    return mapToAddress(createdAddress);
  },

  async getById(id: number): Promise<AddressesType> {
    const foundAddress = await prisma.address.findUnique({ where: { id } });

    if (!foundAddress) {
      throw new ResourceNotFoundError(`Address with ${id} does not exist`, "id", id);
    }

    return mapToAddress(foundAddress);
  },

  async getAll(): Promise<AddressesType[]> {
    const allAddresses = await prisma.address.findMany();
    return allAddresses.map(x => mapToAddress(x));
  },

  async update(data: AddressesType): Promise<AddressesType> {
    if (!data.id) {
      throw new ConstraintError("ID is required for update", [{ path: "id", value: data.id }]);
    }

    const updatedAddress = await prisma.address.update({
      where: { id: data.id },
      data: {
        city: data.city,
        cityCode: data.cityCode,
        fk_country: data.country,
        latitude: data.latitude,
        longitude: data.longitude,
        street: data.street,
      },
    });

    return mapToAddress(updatedAddress);
  },

  async delete(id: number): Promise<void> {
    await prisma.address.delete({ where: { id } });
  },

  async getDistinctCities(): Promise<string[]> {
    const addresses = await prisma.address.findMany({
      distinct: ['city'],
      select: { city: true },
      orderBy: { city: 'asc' },
    });
    return addresses.map(a => a.city).filter(city => city !== null);
  },
};
