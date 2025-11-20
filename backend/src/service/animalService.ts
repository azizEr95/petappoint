import { prisma } from "../singletonPC";
import { animals, Prisma } from "../../generated/prisma";
import { AnimalsPostBodyType, AnimalUpdateType } from "vetlib-shared/schemas/ZodSchemas";

export const animalService = {
  async create(data: AnimalsPostBodyType): Promise<animals> {
    return await prisma.animals.create({
      data: {
        name: data.animal.name,
        dateofbirth: data.animal.dateofbirth,
        dateofbirthisexact: data.animal.dateofbirthisexact,
        weightingram: data.animal.weightingram,
        heightincm: data.animal.heightincm,
        timeofdeath: data.animal.timeofdeath,
        iscastrated: data.animal.iscastrated,
        lifestyleisindoors: data.animal.lifestyleisindoors,
        animalgroup: {
          connect: {
            id: data.groupid
          }
        },
        animaltypes: {
          connect: {
            id: data.typeid,
          }
        },
      },
    });
  },

  async update(data: AnimalUpdateType): Promise<animals> {
    return await prisma.animals.update({
      where: {
        id: data.animal.id
      },
      data: {
        name: data.animal.name,
        dateofbirth: data.animal.dateofbirth,
        dateofbirthisexact: data.animal.dateofbirthisexact,
        weightingram: data.animal.weightingram,
        heightincm: data.animal.heightincm,
        timeofdeath: data.animal.timeofdeath,
        iscastrated: data.animal.iscastrated,
        lifestyleisindoors: data.animal.lifestyleisindoors,
      },
    });
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
};
