import { prisma } from "../singletonPC";
import { Animal, Prisma } from "../../generated/prisma";
import { AnimalsCreateType, AnimalsType, AnimalUpdateType } from "vetilib-shared/schemas/ZodSchemas";
import fs from "node:fs/promises";
import path from "node:path";
import { ResourceNotFoundError } from "../exceptions/errors/ResourceNotFoundError";
import { ConstraintError } from "../exceptions/errors/ConstraintError";

export const animalService = {
  async create(data: AnimalsCreateType): Promise<AnimalsType> {
    const created = await prisma.animal.create({
      data: {
        name: data.name,
        dateOfBirth: data.dateOfBirth,
        dateOfBirthIsExact: data.dateOfBirthIsExact,
        weightInGram: data.weightInGram,
        heightInCm: data.heightInCm,
        timeOfDeath: data.timeOfDeath,
        isCastrated: data.isCastrated,
        sex: data.sex,
        lifestyle: data.lifestyle,
        animalGroup: data.animalGroupId ? { connect: { id: data.animalGroupId } } : undefined,
        animalType: {
          connect: {
            id: data.animalTypeId,
          },
        },
      },
    });

    return {
      dateOfBirth: created.dateOfBirth,
      dateOfBirthIsExact: created.dateOfBirthIsExact,
      heightInCm: created.heightInCm,
      id: created.id,
      isCastrated: created.isCastrated,
      lifestyle: created.lifestyle,
      name: created.name,
      sex: created.sex,
      timeOfDeath: created.timeOfDeath,
      weightInGram: created.weightInGram,
      animalGroupId: created.animalGroupId,
      animalTypeId: created.animalTypeId,
    };
  },

  async update(data: AnimalUpdateType): Promise<AnimalsType> {
    const updated = await prisma.animal.update({
      where: {
        id: data.id,
      },
      data: {
        name: data.name,
        dateOfBirth: data.dateOfBirth,
        dateOfBirthIsExact: data.dateOfBirthIsExact,
        weightInGram: data.weightInGram,
        heightInCm: data.heightInCm,
        timeOfDeath: data.timeOfDeath,
        isCastrated: data.isCastrated,
        sex: data.sex,
        lifestyle: data.lifestyle,
      },
    });

    return {
      dateOfBirth: updated.dateOfBirth,
      dateOfBirthIsExact: updated.dateOfBirthIsExact,
      heightInCm: updated.heightInCm,
      id: updated.id,
      isCastrated: updated.isCastrated,
      lifestyle: updated.lifestyle,
      name: updated.name,
      sex: updated.sex,
      timeOfDeath: updated.timeOfDeath,
      weightInGram: updated.weightInGram,
      animalGroupId: updated.animalGroupId,
      animalTypeId: updated.animalTypeId,
    };
  },

  async getById(id: number): Promise<AnimalsType> {
    const foundAnimal = await prisma.animal.findUnique({ where: { id } });

    if (!foundAnimal) {
      throw new ResourceNotFoundError(`Animal not found with id: ${id}`, "id", id);
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
      animalGroupId: foundAnimal.animalGroupId,
      animalTypeId: foundAnimal.animalTypeId,
    };
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
        animalGroupId: animal.animalGroupId,
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
      animalGroupId: foundAnimal.animalGroupId,
      animalTypeId: foundAnimal.animalTypeId,
    };
  },

  async getAll(): Promise<AnimalsType[]> {
    const foundAnimals = await prisma.animal.findMany();
    return foundAnimals.map((foundAnimal) => ({
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
      animalGroupId: foundAnimal.animalGroupId,
      animalTypeId: foundAnimal.animalTypeId,
    }));
  },

  async delete(id: number): Promise<void> {
    const openAppointments = await prisma.appointment.findMany({
      where: {
        animalId: id,
        startTime: {
          lt: new Date(),
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

    await prisma.animal.delete({ where: { id } });
  },

  async getPicturePath(animalId: number): Promise<string> {
    const found = await prisma.animal.findFirst({
      where: {
        id: animalId,
      },
      select: {
        picturePath: true,
      },
    });

    const filepath = found?.picturePath ?? "public/placeholders/animal.png";
    return path.join(appRootDir, filepath);
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
      if (old.picturePath) {
        const oldImagePath = path.join(appRootDir, old.picturePath);
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
};
