import { prisma } from "../singletonPC";
import { services } from "../../generated/prisma";
import { ServiceType } from "vetlib-shared/schemas/ZodSchemas";

export const serviceService = {
  async create(data: services): Promise<services> {
    return await prisma.services.create({ data: data });
  },

  async getById(id: number): Promise<services> {
    const found = await prisma.services.findUnique({ where: { id } });

    if (!found) throw new Error(`Service does not exist with id ${id} `);

    return found;
  },

  async getAll(): Promise<ServiceType[]> {
    return await prisma.services.findMany();
  },

  async getAllAvailable(): Promise<ServiceType[]> {
    const found = await prisma.veterinarypractices.findMany({
      select: {
        veterinarians: {
          select: {
            veterinary_has_service: {
              include: {
                services: true,
              },
            },
          },
        },
      },
    });

    const availableServices = found
      .flatMap((x) => x.veterinarians)
      .flatMap((x) => x.veterinary_has_service)
      .flatMap((x) => x.services);

    const uniqueServices = availableServices.filter(
      (item, index, self) => index === self.findIndex((o) => o.id === item.id)
    );

    return uniqueServices;
  },

  async update(data: services): Promise<services> {
    if (!data.id) throw new Error("ID is required for update");

    return await prisma.services.update({ where: { id: data.id }, data: data });
  },

  async delete(id: number): Promise<void> {
    await prisma.services.delete({ where: { id } });
  },
};
