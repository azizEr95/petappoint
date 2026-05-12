import { prisma } from "../singletonPC"
import { mapToVeterinary } from "../helper/mapToVeterinary"
import { VeterinariansCreateType, VeterinariansType, VeterinariansUpdateType } from "petappoint-shared/schemas/ZodSchemas"
import Vets from "../models/Vets"

export const veterinaryService = {
  async create(data: VeterinariansCreateType): Promise<VeterinariansType> {
    return await Vets.create(data)
  },

  async getById(id: number): Promise<VeterinariansType> {
    return await Vets.getById(id)
  },

  async getByPractice(practiceId: number): Promise<VeterinariansType[]> {
    return await this.getByPractice(practiceId)
  },

  async getAll(): Promise<VeterinariansType[]> {
    return await Vets.getAll()
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
    return mapToVeterinary(updated);
  },

  async delete(id: number): Promise<void> {
    return await Vets.delete(id)
  },
};
