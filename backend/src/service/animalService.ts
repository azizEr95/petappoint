import { prisma } from "../singletonPC";
import { animals } from "../../generated/prisma";

export const animalService = {
  async create(data: animals): Promise<animals> {
    return await prisma.animals.create({
      data: {
        name: data.name,
        dateofbirth: data.dateofbirth,
        dateofbirthisexact: data.dateofbirthisexact,
        weightingram: data.weightingram,
        heightincm: data.heightincm,
        timeofdeath: data.timeofdeath,
        iscastrated: data.iscastrated,
        lifestyle: data.lifestyle,
        animalgroup: { connect: { id: data.fk_animalgroupid ?? undefined } },
        animaltypes: { connect: { id: data.fk_animaltypeid } },
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

  async update(data: animals): Promise<animals> {
    if (!data.id) throw new Error("ID is required for update");

    return await prisma.animals.update({ where: { id: data.id }, data: data });
  },

  async delete(id: number): Promise<void> {
    await prisma.animals.delete({ where: { id } });
  },
};
