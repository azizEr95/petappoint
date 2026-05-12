import { prisma } from "../singletonPC"
import { AddressesCreateType, AddressesType } from "petappoint-shared/schemas/ZodSchemas"
import Addresses from "../models/Addresses"

export const addressService = {
  async create(data: AddressesCreateType): Promise<AddressesType> {
    return await Addresses.create(data)
  },

  async getById(id: number): Promise<AddressesType> {
    return await Addresses.getById(id)
  },

  async getAll(): Promise<AddressesType[]> {
    return await Addresses.getAll()
  },

  async update(data: AddressesType): Promise<AddressesType> {
    return await Addresses.update(data)
  },

  async delete(id: number): Promise<void> {
    await Addresses.delete(id)
  },

  async getDistinctCities(): Promise<string[]> {
    const addresses = await prisma.address.findMany({
      distinct: ['city'],
      select: { city: true },
      orderBy: { city: 'asc' },
    })
    return addresses.map(a => a.city).filter(city => city !== null)
  },
}