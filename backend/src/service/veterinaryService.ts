import { prisma } from "../singletonPC";
import { mapToVeterinary } from "../helper/mapToVeterinary";
import { VeterinariansCreateType, VeterinariansDbType, VeterinariansType, VeterinariansUpdateType } from "vetilib-shared/schemas/ZodSchemas";

export const veterinaryService = {
  async create(data: VeterinariansCreateType): Promise<VeterinariansType> {
    const dbData: VeterinariansDbType = {
      id: data.id,
      infoEmail: data.infoEmail,
      fk_veterinarypracticeid: data.fk_veterinarypracticeid,
    }

    const created = await prisma.veterinarian.create({
      data: dbData,
      include: {
        person: {
          select: {
            firstName: true,
            lastName: true
          }
        }
      },
    });

    if (!created) {
      throw new Error("Vet could not be created")
    }
    return mapToVeterinary(created);
  },

  async getById(id: number): Promise<VeterinariansType> {
    const foundVeterinary = await prisma.veterinarian.findUnique({
      where: { id },
      include: {
        person: true,
        veterinaryHasServices: {
          include: {
            service: true,
          },
        },
      },
    });

    if (!foundVeterinary) throw new Error(`Veterinary not found with id: ${id}`);

    return mapToVeterinary(foundVeterinary as any);
  },

  async getByPractice(practiceId: number): Promise<VeterinariansType[]> {
    const foundVeterinarians = await prisma.veterinarian.findMany({
      where: { fk_veterinarypracticeid: practiceId },
      include: {
        person: true,
        veterinaryHasServices: {
          include: {
            service: true,
          },
        },
      },
    });

    return foundVeterinarians.map((vet) => mapToVeterinary(vet as any))
  },

  async getAll(): Promise<VeterinariansType[]> {
    const foundVets = await prisma.veterinarian.findMany({
      include: {
        person: true,
        veterinaryHasServices: {
          include: {
            service: true,
          },
        },
      },
    });
    return foundVets.map((vet) => mapToVeterinary(vet as any))
  },

  async update(data: VeterinariansUpdateType): Promise<VeterinariansType> {
    const updated = await prisma.veterinarian.update({
      where: { id: data.id },
      include: {
        person: {
          select: {
            firstName: true,
            lastName: true,
          }
        }
      },
      data: data
    });
    return mapToVeterinary(updated as any);
  },

  async delete(id: number): Promise<void> {
    await prisma.veterinarian.delete({ where: { id } });
  },
};
