import { CountryType } from "petappoint-shared/schemas/ZodSchemas";
import Countries from "../models/Countries";

export const countryService = {
  async create(data: any): Promise<CountryType> {
    return await Countries.create(data)
  },

  async getAll(): Promise<CountryType[]> {
    return await Countries.getAll()
  },

  async getById(id: number): Promise<CountryType> {
    return await Countries.getById(id)
  },
};
