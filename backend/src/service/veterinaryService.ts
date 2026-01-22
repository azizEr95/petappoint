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
        appointments: true,
        veterinaryPractice: true,
        person: true,
        veterinaryHasServices: {
          include: {
            service: true,
            veterinarian: true,
          },
        },
      },
    });

    if (!foundVeterinary) throw new Error(`Veterinary not found with id: ${id}`);

    return mapToVeterinary(foundVeterinary);
  },

  async getByPractice(practiceId: number): Promise<VeterinariansType[]> {
    const foundVeterinarians = await prisma.veterinarian.findMany({
      where: { fk_veterinarypracticeid: practiceId },
      include: { person: true },
    });

    return foundVeterinarians.map((vet) => mapToVeterinary(vet))
  },

  async getAll(): Promise<VeterinariansType[]> {
    const foundVets = await prisma.veterinarian.findMany({ include: { person: true } });
    return foundVets.map((vet) => mapToVeterinary(vet))
  },

  async update(data: VeterinariansUpdateType): Promise<VeterinariansType> {
    const updated = await prisma.veterinarian.update({ where: { id: data.id }, include: { person: true }, data: data });
    return mapToVeterinary(updated);
  },

  async delete(id: number): Promise<void> {
    await prisma.veterinarian.delete({ where: { id } });
  },
};
