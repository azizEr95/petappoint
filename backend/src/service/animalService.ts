import { prisma } from "../singletonPC";
import { animals, Prisma } from "../../generated/prisma";
import { AnimalsCreateType, AnimalUpdateType } from "vetlib-shared/schemas/ZodSchemas";

export const animalService = {
  async create(data: AnimalsCreateType): Promise<animals> {
    return await prisma.animals.create({
      data: {
        name: data.name,
        dateofbirth: data.dateofbirth,
        dateofbirthisexact: data.dateofbirthisexact,
        weightingram: data.weightingram,
        heightincm: data.heightincm,
        timeofdeath: data.timeofdeath,
        iscastrated: data.iscastrated,
        lifestyleisindoors: data.lifestyleisindoors,
        animalgroup: {
          connect: {
            id: data.fk_animalgroupid ?? undefined
          }
        },
        animaltypes: {
          connect: {
            id: data.fk_animaltypeid,
          }
        },
      },
    });
  },

  async update(data: AnimalUpdateType): Promise<animals> {
    return await prisma.animals.update({
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
        lifestyleisindoors: data.lifestyleisindoors,
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
