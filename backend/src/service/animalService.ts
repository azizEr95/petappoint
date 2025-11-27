import { prisma } from "../singletonPC";
import { animals, Prisma } from "../../generated/prisma";
import { AnimalsCreateType, AnimalsType, AnimalUpdateType } from "vetlib-shared/schemas/ZodSchemas";
import fs from "node:fs/promises";
import path from "node:path";

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
      ...created,
      animalgroupid: created.fk_animalgroupid,
      animaltypeid: created.fk_animaltypeid
    })
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
      ...updated,
      animalgroupid: updated.fk_animalgroupid,
      animaltypeid: updated.fk_animaltypeid
    })
  },

  async getById(id: number): Promise<animals> {
    const foundAnimal = await prisma.animals.findUnique({ where: { id } });

    if (!foundAnimal) throw new Error(`Animal not found with id: ${id}`);

    return foundAnimal;
  },

  async getByPersonId(personId: number): Promise<animals[]> {
    const relations = await prisma.person_has_animal.findMany({
      where: {
        fk_personid: personId
      },
      include: {
        animals: true
      }
    });

    return relations.map(r => r.animals);
  },

  async getByName(name: string): Promise<animals> {
    const foundAnimal = await prisma.animals.findFirst({ where: { name } });

    if (!foundAnimal) throw new Error(`Animal not found with name: ${name}`);

    return foundAnimal;
  },

  async getAll(): Promise<animals[]> {
    return await prisma.animals.findMany();
  },

  async delete(id: number): Promise<void> {
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
      throw new Error(`Animal with ID(${animalId}) does not exist.`);
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
  }
};
