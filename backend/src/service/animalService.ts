import { prisma } from "../singletonPC"
import { AnimalsCreateType, AnimalsType, AnimalUpdateType } from "petappoint-shared/schemas/ZodSchemas"
import fs from "node:fs/promises"
import path from "node:path"
import { ResourceNotFoundError } from "../exceptions/errors/ResourceNotFoundError"
import { ConstraintError } from "../exceptions/errors/ConstraintError"
import Pets from "../models/Pets"

export const animalService = {
  async create(data: AnimalsCreateType): Promise<AnimalsType> {
    return await Pets.create(data)
  },

  async update(data: AnimalUpdateType): Promise<AnimalsType> {
    return await Pets.update(data)
  },

  async getById(id: number): Promise<AnimalsType> {
    return await Pets.getById(id)
  },

  async getByPersonId(personId: number): Promise<AnimalsType[]> {
    const relations = await prisma.personHasAnimal.findMany({
      where: {
        personId: personId,
      },
      include: {
        animal: true,
      },
    });

    return relations
      .map((r) => r.animal)
      .flatMap((animal) => ({
        dateOfBirth: animal.dateOfBirth,
        dateOfBirthIsExact: animal.dateOfBirthIsExact,
        heightInCm: animal.heightInCm,
        id: animal.id,
        isCastrated: animal.isCastrated,
        lifestyle: animal.lifestyle,
        name: animal.name,
        sex: animal.sex,
        timeOfDeath: animal.timeOfDeath,
        weightInGram: animal.weightInGram,
        animalTypeId: animal.animalTypeId,
      }));
  },

  async getByName(name: string): Promise<AnimalsType> {
    const foundAnimal = await prisma.animal.findFirst({ where: { name } });

    if (!foundAnimal) {
      throw new ResourceNotFoundError(`Animal not found with name: ${name}`, "name", name);
    }

    return {
      dateOfBirth: foundAnimal.dateOfBirth,
      dateOfBirthIsExact: foundAnimal.dateOfBirthIsExact,
      heightInCm: foundAnimal.heightInCm,
      id: foundAnimal.id,
      isCastrated: foundAnimal.isCastrated,
      lifestyle: foundAnimal.lifestyle,
      name: foundAnimal.name,
      sex: foundAnimal.sex,
      timeOfDeath: foundAnimal.timeOfDeath,
      weightInGram: foundAnimal.weightInGram,
      animalTypeId: foundAnimal.animalTypeId,
    };
  },

  async getAll(): Promise<AnimalsType[]> {
    return await Pets.getAll()
  },

  async delete(id: number): Promise<void> {
    const openAppointments = await prisma.appointment.findMany({
      where: {
        animalId: id,
        startTime: {
          gte: new Date(),
        },
      },
      select: {
        id: true,
      },
    });

    if (openAppointments.length > 0) {
      throw new ConstraintError(
        "Animal has open appointments",
        openAppointments.map((x) => ({
          path: x.id.toString(),
          value: x.id,
        }))
      );
    }

    await Pets.delete(id)
  },

  async deleteWithAppointmentCancellation(id: number): Promise<void> {
    // Find future appointments
    const futureAppointments = await prisma.appointment.findMany({
      where: {
        animalId: id,
        startTime: {
          gte: new Date(),
        },
      },
      select: {
        id: true,
      },
    });

    // Cancel all future appointments
    if (futureAppointments.length > 0) {
      await prisma.appointment.deleteMany({
        where: {
          id: {
            in: futureAppointments.map((a) => a.id),
          },
        },
      });
    }

    // Delete the animal
    await prisma.animal.delete({ where: { id } });
  },

  async getPicturePath(animalId?: number): Promise<string> {
    if (animalId !== undefined) { // if animalId is undefined return the placeholder picture for animals
      const found = await prisma.animal.findFirst({
        where: {
          id: animalId,
        },
        select: {
          picturePath: true,
        },
      });

      const filepath = found?.picturePath ?? "public/placeholders/animal-unknown.png";
      return path.join(appRootDir, filepath);
    } else {
      const filepath = "public/placeholders/animal-unknown.png";
      return path.join(appRootDir, filepath);
    }
  },

  async savePicture(animalId: number, fileOnDiskPath: string | null): Promise<void> {
    const old = await prisma.animal.findFirst({
      where: {
        id: animalId,
      },
      select: {
        picturePath: true,
      },
    });
    if (!old) {
      throw new ConstraintError(`No animal with given id exists.`, [{ path: "animalId", value: animalId }]);
    }

    if (old.picturePath) {
      const oldImagePath = path.join(appRootDir, old.picturePath);
      if (!oldImagePath.includes("placeholders")) { // do not delete placeholder images
        fs.rm(oldImagePath);
      }
    }

    await prisma.animal.update({
      where: {
        id: animalId,
      },
      data: {
        picturePath: fileOnDiskPath,
      },
      select: {
        picturePath: true,
      },
    });
  },

  async deletePicture(animalId: number): Promise<void> {
    const animal = await prisma.animal.findFirst({
      where: {
        id: animalId,
      },
      select: {
        picturePath: true,
      },
    });
    if (!animal) {
      throw new ConstraintError(`No animal with given id exists.`, [{ path: "animalId", value: animalId }]);
    }

    if (animal.picturePath) {
      const oldImagePath = path.join(appRootDir, animal.picturePath);
      if (!oldImagePath.includes("placeholders")) { // do not delete placeholder images
        fs.rm(oldImagePath);
      }
    }

    await prisma.animal.update({
      where: {
        id: animalId,
      },
      data: {
        picturePath: "public/placeholders/animal-unknown.png",
      },
      select: {
        picturePath: true,
      },
    });
  },

  async canPersonAccessAnimal(personId: number, animalId: number): Promise<boolean> {
    const relationExists = await prisma.personHasAnimal.findFirst({
      where: {
        animalId: animalId,
        personId: personId,
      },
    });
    if (relationExists) {
      return true;
    }

    return false;
  },

  async canCompanyAccessAnimal(companyId: number, animalId: number): Promise<boolean> {
    const relationExists = await prisma.appointment.findFirst({
      where: {
        animalId: animalId,
        veterinaryPracticeId: companyId
      }
    });
    
    if (relationExists) {
      return true;
    }
    
    return false;
  }
};
