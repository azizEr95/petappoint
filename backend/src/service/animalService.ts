import { prisma } from "../singletonPC";
import { animals, Prisma } from "../../generated/prisma";
import { AnimalsCreateType, AnimalsType, AnimalUpdateType } from "vetlib-shared/schemas/ZodSchemas";
import fs from "node:fs/promises";
import path from "node:path";
import { ResourceNotFoundError } from "../exceptions/errors/ResourceNotFoundError";
import { ConstraintError } from "../exceptions/errors/ContraintError";

export const animalService = {
  async create(data: AnimalsCreateType): Promise<AnimalsType> {
    const created = await prisma.animals.create({
      data: {
        name: data.name,
        dateofbirth: data.dateofbirth,
        dateofbirthisexact: data.dateofbirthisexact,
        weightingram: data.weightingram,
        heightincm: data.heightincm,
        timeofdeath: data.timeofdeath,
        iscastrated: data.iscastrated,
        sex: data.sex,
        lifestyleisindoors: data.lifestyleisindoors,
        animalgroup: data.animalgroupid ? { connect: { id: data.animalgroupid } } : undefined,
        animaltypes: {
          connect: {
            id: data.animaltypeid,
          }
        },
      },
    });

    return ({
      dateofbirth: created.dateofbirth,
      dateofbirthisexact: created.dateofbirthisexact,
      heightincm: created.heightincm,
      id: created.id,
      iscastrated: created.iscastrated,
      lifestyleisindoors: created.lifestyleisindoors,
      name: created.name,
      sex: created.sex,
      timeofdeath: created.timeofdeath,
      weightingram: created.weightingram,
      animalgroupid: created.fk_animalgroupid,
      animaltypeid: created.fk_animaltypeid
    });
  },

  async update(data: AnimalUpdateType): Promise<AnimalsType> {
    const updated = await prisma.animals.update({
      where: {
        id: data.id
      },
      data: {
        name: data.name,
        dateofbirth: data.dateofbirth,
        dateofbirthisexact: data.dateofbirthisexact,
        weightingram: data.weightingram,
        heightincm: data.heightincm,
        timeofdeath: data.timeofdeath,
        iscastrated: data.iscastrated,
        sex: data.sex,
        lifestyleisindoors: data.lifestyleisindoors,
      },
    });

    return ({
      dateofbirth: updated.dateofbirth,
      dateofbirthisexact: updated.dateofbirthisexact,
      heightincm: updated.heightincm,
      id: updated.id,
      iscastrated: updated.iscastrated,
      lifestyleisindoors: updated.lifestyleisindoors,
      name: updated.name,
      sex: updated.sex,
      timeofdeath: updated.timeofdeath,
      weightingram: updated.weightingram,
      animalgroupid: updated.fk_animalgroupid,
      animaltypeid: updated.fk_animaltypeid
    });
  },

  async getById(id: number): Promise<AnimalsType> {
    const foundAnimal = await prisma.animals.findUnique({ where: { id } });

    if (!foundAnimal) {
      throw new ResourceNotFoundError(`Animal not found with id: ${id}`, 'id', id);
    }

    return ({
      dateofbirth: foundAnimal.dateofbirth,
      dateofbirthisexact: foundAnimal.dateofbirthisexact,
      heightincm: foundAnimal.heightincm,
      id: foundAnimal.id,
      iscastrated: foundAnimal.iscastrated,
      lifestyleisindoors: foundAnimal.lifestyleisindoors,
      name: foundAnimal.name,
      sex: foundAnimal.sex,
      timeofdeath: foundAnimal.timeofdeath,
      weightingram: foundAnimal.weightingram,
      animalgroupid: foundAnimal.fk_animalgroupid,
      animaltypeid: foundAnimal.fk_animaltypeid
    });
  },

  async getByPersonId(personId: number): Promise<AnimalsType[]> {
    const relations = await prisma.person_has_animal.findMany({
      where: {
        fk_personid: personId
      },
      include: {
        animals: true
      }
    });

    return relations.map(r => r.animals).flatMap(animal => ({
      dateofbirth: animal.dateofbirth,
      dateofbirthisexact: animal.dateofbirthisexact,
      heightincm: animal.heightincm,
      id: animal.id,
      iscastrated: animal.iscastrated,
      lifestyleisindoors: animal.lifestyleisindoors,
      name: animal.name,
      sex: animal.sex,
      timeofdeath: animal.timeofdeath,
      weightingram: animal.weightingram,
      animalgroupid: animal.fk_animalgroupid,
      animaltypeid: animal.fk_animaltypeid
    }));
  },

  async getByName(name: string): Promise<AnimalsType> {
    const foundAnimal = await prisma.animals.findFirst({ where: { name } });

    if (!foundAnimal) {
      throw new ResourceNotFoundError(`Animal not found with name: ${name}`, 'name', name);
    }

    return ({
      dateofbirth: foundAnimal.dateofbirth,
      dateofbirthisexact: foundAnimal.dateofbirthisexact,
      heightincm: foundAnimal.heightincm,
      id: foundAnimal.id,
      iscastrated: foundAnimal.iscastrated,
      lifestyleisindoors: foundAnimal.lifestyleisindoors,
      name: foundAnimal.name,
      sex: foundAnimal.sex,
      timeofdeath: foundAnimal.timeofdeath,
      weightingram: foundAnimal.weightingram,
      animalgroupid: foundAnimal.fk_animalgroupid,
      animaltypeid: foundAnimal.fk_animaltypeid
    });
  },

  async getAll(): Promise<AnimalsType[]> {
    const foundAnimals = await prisma.animals.findMany();
    return foundAnimals.map(foundAnimal => ({
      dateofbirth: foundAnimal.dateofbirth,
      dateofbirthisexact: foundAnimal.dateofbirthisexact,
      heightincm: foundAnimal.heightincm,
      id: foundAnimal.id,
      iscastrated: foundAnimal.iscastrated,
      lifestyleisindoors: foundAnimal.lifestyleisindoors,
      name: foundAnimal.name,
      sex: foundAnimal.sex,
      timeofdeath: foundAnimal.timeofdeath,
      weightingram: foundAnimal.weightingram,
      animalgroupid: foundAnimal.fk_animalgroupid,
      animaltypeid: foundAnimal.fk_animaltypeid
    }));
  },

  async delete(id: number): Promise<void> {
    const openAppointments = await prisma.appointments.findMany({
      where: {
        fk_animalid: id,
        starttime: {
          lt: new Date()
        }
      },
      select: {
        id: true
      }
    });
    
    if (openAppointments.length > 0) {
      throw new ConstraintError("Animal has open appointments", openAppointments.map(x => ({
        path: x.id.toString(),
        value: x.id
      })));
    }

    await prisma.animals.delete({ where: { id } });
  },

  async getPicturePath(animalId: number): Promise<string> {
    const found = await prisma.animals.findFirst({
      where: {
        id: animalId
      },
      select: {
        picturepath: true
      }
    });

    const filepath = found?.picturepath ?? 'public/placeholders/animal.png';
    return path.join(appRootDir, filepath);
  },

  async savePicture(animalId: number, fileOnDiskPath: string | null): Promise<void> {
    const old = await prisma.animals.findFirst({
      where: {
        id: animalId
      },
      select: {
        picturepath: true
      }
    });
    if (!old) {
      throw new ConstraintError(`No animal with given id exists.`, [{ path: 'animalId', value: animalId }]);
    }

    if (old.picturepath) {
      if (old.picturepath) {
        const oldImagePath = path.join(appRootDir, old.picturepath);
        fs.rm(oldImagePath);
      }
    };

    await prisma.animals.update({
      where: {
        id: animalId
      },
      data: {
        picturepath: fileOnDiskPath
      },
      select: {
        picturepath: true
      },
    });
  },

  async canPersonAccessAnimal(personId: number, animalId: number): Promise<boolean> {
    const relationExists = await prisma.person_has_animal.findFirst({
      where: {
        fk_animalid: animalId,
        fk_personid: personId
      }
    });
    if (relationExists) {
      return true;
    }

    return false;
  }
};
