import { prisma } from "../singletonPC";
import {
  AnimalsType,
  PersonsCreateType,
  PersonsType,
  PersonsUpdateType,
  PostgresIdSchema,
} from "vetilib-shared/schemas/ZodSchemas";
import { addressService } from "./addressService";
import { ResourceNotFoundError } from "../exceptions/errors/ResourceNotFoundError";
import fs from "node:fs/promises";
import path from "node:path";
import { ConstraintError } from "../exceptions/errors/ConstraintError";
import { person_has_confirmation_code } from "../../generated/prisma";
import { mapToPerson } from "../helper/mapToPerson";
import { mapToAnimal } from "../helper/mapToAnimal";

export const personService = {
  async create(dataRe: PersonsCreateType): Promise<PersonsType> {
    const existingPerson = await prisma.person.findUnique({
      where: { email: dataRe.email },
    });
    if (existingPerson) {
      throw new ConstraintError("Email wird bereits verwendet", [{ path: "email", value: dataRe.email }]);
    }

    const created = await prisma.person.create({
      include: {
        address: true,
      },
      data: {
        firstName: dataRe.firstName,
        lastName: dataRe.lastName,
        sex: dataRe.sex,
        dateOfBirth: dataRe.dateOfBirth,
        address: {
          create: {
            city: dataRe.address.cityCode,
            cityCode: dataRe.address.cityCode,
            latitude: dataRe.address.latitude,
            longitude: dataRe.address.longitude,
            street: dataRe.address.street,
            fk_country: dataRe.address.country
          },
        },
        phone: dataRe.phone,
        email: dataRe.email,
        password: dataRe.password,
      },
    });

    return mapToPerson(created);
  },

  async connectAnimal(personId: number, animalId: number): Promise<void> {
    await prisma.personHasAnimal.create({
      data: {
        animalId: animalId,
        personId: personId,
      },
    });
  },

  async getById(id: number): Promise<PersonsType> {
    const foundPerson = await prisma.person.findUnique({
      include: {
        address: true,
      },
      where: { id },
    });

    if (!foundPerson) {
      throw new ResourceNotFoundError(`Person not found with id: ${id}`, "id", id);
    }

    return mapToPerson(foundPerson);
  },

  async getByEmail(email: string): Promise<PersonsType | null> {
    const foundPerson = await prisma.person.findUnique({
      include: {
        address: true,
      },
      where: { email },
    });

    if (!foundPerson) {
      return null
    }

    return mapToPerson(foundPerson);
  },

  async getAll(): Promise<PersonsType[]> {
    const found = await prisma.person.findMany({
      include: {
        address: true,
      },
    });

    return found.map((foundPerson) => mapToPerson(foundPerson));
  },

  async update(dataRe: PersonsUpdateType): Promise<PersonsType> {
    if (dataRe.email) {
      const existingPerson = await prisma.person.findUnique({
        where: { email: dataRe.email },
      });
      if (existingPerson && existingPerson.id !== dataRe.id) {
        throw new ConstraintError("Email wird bereits verwendet", [{ path: "email", value: dataRe.email }]);
      }
    }

    await addressService.update(dataRe.address);

    const updateData: any = {
      firstName: dataRe.firstName,
      lastName: dataRe.lastName,
      sex: dataRe.sex,
      dateOfBirth: dataRe.dateOfBirth,
      phone: dataRe.phone,
      email: dataRe.email,
    };

    if (dataRe.password) {
      updateData.password = dataRe.password;
    }

    const updatedPerson = await prisma.person.update({
      where: { id: dataRe.id },
      data: updateData,
      include: {
        address: true,
      },
    });

    return mapToPerson(updatedPerson);
  },

  async updateEmail(id: number, dataEmail: string): Promise<PersonsType> { // only updating the email

      const existingPerson = await prisma.person.findUnique({
        where: { email: dataEmail },
      });
      if (existingPerson && existingPerson.id !== id) {
        throw new ConstraintError("Email already in use", [{ path: "email", value: dataEmail }]);
      }

    const updateData: any = {
      email: dataEmail,
    };

    const updatedPerson = await prisma.person.update({
      where: { id: id },
      data: updateData,
      include: {
        address: true,
      },
    });

    return mapToPerson(updatedPerson);
  },

  async favorizeVeterinaryPracticesByIds(personId: number, practiceIds: number[]): Promise<void> {
    practiceIds = practiceIds
      .map((x) => PostgresIdSchema.safeParse(x))
      .filter((x) => x.success)
      .map((x) => x.data);
    if (practiceIds.length === 0) {
      return;
    }

    const d = await prisma.personHasFavorizedVeterinaryPractice.createMany({
      data: practiceIds.map((practiceId) => ({ personId: personId, veterinaryPracticeId: practiceId })),
      skipDuplicates: true,
    });
  },

  async deleteFavorizedVeterinaryPracticeId(personId: number, practiceId: number): Promise<void> {
    const result = await prisma.personHasFavorizedVeterinaryPractice.delete({
      where: {
        personId_veterinaryPracticeId: {
          personId: personId,
          veterinaryPracticeId: practiceId,
        },
      },
    });
  },

  async getFavorizedVeterinaryPracticeIds(personId: number): Promise<number[]> {
    const result = await prisma.personHasFavorizedVeterinaryPractice.findMany({
      where: {
        personId: personId,
      },
    });
    return result.map((x) => x.veterinaryPracticeId);
  },

  async getAnimalsForPersonId(personId: number): Promise<AnimalsType[]> {
    const animals = await prisma.personHasAnimal.findMany({
      where: {
        personId: personId,
      },
      include: {
        animal: true,
      },
    });

    return animals.map((x) => mapToAnimal(x.animal));
  },

  async delete(id: number): Promise<void> {
    await prisma.person.delete({ where: { id } });
  },

  async getPicturePath(personId: number): Promise<string> {
    const found = await prisma.person.findFirst({
      where: {
        id: personId,
      },
      select: {
        picturePath: true,
      },
    });

    const filepath = found?.picturePath ?? "public/placeholders/unknown.png";
    return path.join(appRootDir, filepath);
  },

  async savePicture(personId: number, fileOnDiskPath: string | null): Promise<void> {
    const old = await prisma.person.findFirst({
      where: {
        id: personId,
      },
      select: {
        picturePath: true,
      },
    });
    if (!old) {
      throw new ConstraintError(`No person with given id exists.`, [{ path: "personId", value: personId }]);
    }

    if (old.picturePath) {
      const oldImagePath = path.join(appRootDir, old.picturePath);
      fs.rm(oldImagePath).catch(() => {});
    }

    await prisma.person.update({
      where: {
        id: personId,
      },
      data: {
        picturePath: fileOnDiskPath,
      },
      select: {
        picturePath: true,
      },
    });
  },
  async checkConfirmationCodeExists(userId: number, generatedCode: string): Promise<boolean> {
    const found = await prisma.person_has_confirmation_code.findFirst({where: {
      fk_personid: userId,
      code: generatedCode,
      dateofcreation: {
        gte: new Date(new Date().valueOf() - 15 * 60000)
      }
    }});
    return !!found;
  },
  async createConfirmationCode(userId: number, generatedCode: string): Promise<person_has_confirmation_code> {
    const created = await prisma.person_has_confirmation_code.upsert({
     where: {
        fk_personid: userId
     },
     update: {
        code: generatedCode,
        dateofcreation: new Date().toISOString()
     },
     create:{
        fk_personid: userId,
        code: generatedCode,
        dateofcreation: new Date().toISOString(),
        verified: false
     }
    });
    return created;
  },
  async checkVerified(userId: number): Promise<boolean> {
    const check = await prisma.person_has_confirmation_code.findUnique({
      where: {
        fk_personid: userId
      }
    })
    if(!check) {
      throw new ResourceNotFoundError("User not found.","userId",userId);
    }
    
    return check.verified
  },
  async updateVerified(userId: number,code: string): Promise<person_has_confirmation_code> {
    const user = await prisma.person_has_confirmation_code.update({
      where: {
        fk_personid: userId,
        code: code
      },
      data: {
        verified: true
      }
    });
    return user;
  }
};
