import { prisma } from "../singletonPC";
import { Service } from "../../generated/prisma";
import { ServiceType } from "petappoint-shared/schemas/ZodSchemas";
import Treatments from "../models/Treatments";

export const serviceService = {
  async create(data: Service): Promise<Service> {
    return await Treatments.create(data)
  },

  async getById(id: number): Promise<Service> {
    return await Treatments.getById(id)
  },

  async getAll(): Promise<ServiceType[]> {
    return await Treatments.getAll()
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
    return await Treatments.update(data)
  },

  async delete(id: number): Promise<void> {
    return await Treatments.delete(id)
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
