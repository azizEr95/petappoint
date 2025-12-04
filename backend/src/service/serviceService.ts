import { prisma } from "../singletonPC";
import { Service } from "../../generated/prisma";
import { ServiceType } from "vetlib-shared/schemas/ZodSchemas";

export const serviceService = {
  async create(data: Service): Promise<Service> {
    return await prisma.service.create({ data: data });
  },

  async getById(id: number): Promise<Service> {
    const found = await prisma.service.findUnique({ where: { id } });

    if (!found) throw new Error(`Service does not exist with id ${id} `);

    return found;
  },

  async getAll(): Promise<ServiceType[]> {
    return await prisma.service.findMany();
  },

  async getAllAvailable(): Promise<ServiceType[]> {
    const found = await prisma.veterinaryPractice.findMany({
      select: {
        veterinarians: {
          select: {
            veterinaryHasServices: {
              include: {
                service: true,
              },
            },
          },
        },
      },
    });

    const availableServices = found
      .flatMap((x) => x.veterinarians)
      .flatMap((x) => x.veterinaryHasServices)
      .flatMap((x) => x.service);

    const uniqueServices = availableServices.filter(
      (item, index, self) => index === self.findIndex((o) => o.id === item.id)
    );

    return uniqueServices;
  },

  async update(data: Service): Promise<Service> {
    if (!data.id) throw new Error("ID is required for update");

    return await prisma.service.update({ where: { id: data.id }, data: data });
  },

  async delete(id: number): Promise<void> {
    await prisma.service.delete({ where: { id } });
  },

  async getAvailableServicesForVeterinary(id: number): Promise<ServiceType[]> {
    const found = await prisma.veterinarian.findUnique({
      include: {
        veterinaryHasServices: {
          include: {
            service: true
          }
        }
      },
      where: {
        id: id
      }
    });

    if (!found) {
      return [];
    }

    return found.veterinaryHasServices.flatMap(x => x.service);
  }
};
