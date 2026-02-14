import { CountryType } from "petappoint-shared/schemas/ZodSchemas";
import { prisma } from "../singletonPC";
import { ResourceNotFoundError } from "../exceptions/errors/ResourceNotFoundError";

export const countryService = {
  async create(data: any): Promise<CountryType> {
    return await prisma.countries.create({
      data: data,
    });
  },

  async getAll(): Promise<CountryType[]> {
    return await prisma.countries.findMany({});
  },

  async getById(id: number): Promise<CountryType> {
    const country = await prisma.countries.findUnique({
      where: {
        id: id,
      },
    });

    if (!country) {
      throw new ResourceNotFoundError("No country found with given id", "id", id);
    }

    return country;
  },
};
