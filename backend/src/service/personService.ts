import { prisma } from "../singletonPC";
import { AnimalsType, PersonsCreateType, PersonsType, PersonsUpdateType, PostgresIdSchema } from "petappoint-shared/schemas/ZodSchemas";
import { addressService } from "./addressService";
import { ResourceNotFoundError } from "../exceptions/errors/ResourceNotFoundError";
import fs from "node:fs/promises";
import path from "node:path";
import { ConstraintError } from "../exceptions/errors/ConstraintError";
import { person_has_confirmation_code } from "../../generated/prisma";
import PetOwners from "../models/PetOwners"

export const personService = {
  async create(dataRe: PersonsCreateType): Promise<PersonsType> {
    const emailExists = await this.existWithEmail(dataRe.email)
    
    if (emailExists) {
      throw new ConstraintError("Email wird bereits verwendet", [{ path: "email", value: dataRe.email }])
    }

    return PetOwners.create(dataRe)
  },

  async connectAnimal(personId: number, animalId: number): Promise<void> {
    await prisma.personHasAnimal.create({
      data: {
        animalId: animalId,
        personId: personId,
      },
    })
  },

  async getById(id: number): Promise<PersonsType> {
    return await PetOwners.getById(id)
  },

  async getByEmail(email: string): Promise<PersonsType | null> {
    return await PetOwners.getByEmail(email)
  },

  async getAll(): Promise<PersonsType[]> {
    return await PetOwners.getAll()
  },

  async update(dataRe: PersonsUpdateType): Promise<PersonsType> {
    const personExist = await PetOwners.getByEmail(dataRe.email)

    if (personExist && personExist.id !== dataRe.id) {
      throw new ConstraintError("Email wird bereits verwendet", [{ path: "email", value: dataRe.email }])
    }

    await addressService.update(dataRe.address);

    const updateData: any = {
      firstName: dataRe.firstName,
      lastName: dataRe.lastName,
      sex: dataRe.sex,
      dateOfBirth: dataRe.dateOfBirth,
      phone: dataRe.phone,
      email: dataRe.email,
    }

    if (dataRe.password) {
      updateData.password = dataRe.password;
    }

    return PetOwners.update(dataRe, updateData)
  },

  async updateEmail(id: number, dataEmail: string): Promise<PersonsType> {
    const personExist = await PetOwners.getByEmail(dataEmail) as PersonsUpdateType

    if (personExist && personExist.id !== id) {
      throw new ConstraintError("Email wird bereits verwendet", [{ path: "email", value: dataEmail }])
    }

    const toUpdateData = {
      email: dataEmail,
    }

    return await PetOwners.update(personExist, toUpdateData)
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
    return PetOwners.getFavoritePracticesIds(personId)
  },

  async existWithEmail(email: string): Promise<Boolean> {
    const existPerson = await PetOwners.getByEmail(email)
    return existPerson ? true : false
  },

  async existWithId(personId: number): Promise<Boolean> {
    const existPerson = await PetOwners.getById(personId)
    return existPerson ? true : false
  },

  async getAnimalsForPersonId(personId: number): Promise<AnimalsType[]> {
    return PetOwners.getPetsFromOwner(personId)
  },

  async delete(id: number): Promise<Boolean> {
    return await PetOwners.delete(id)
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
      fs.rm(oldImagePath).catch(() => { });
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
    const found = await prisma.person_has_confirmation_code.findFirst({
      where: {
        fk_personid: userId,
        code: generatedCode,
        dateofcreation: {
          gte: new Date(new Date().valueOf() - 15 * 60000)
        }
      }
    });
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
      create: {
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
    if (!check) {
      throw new ResourceNotFoundError("User not found.", "userId", userId);
    }

    return check.verified
  },
  async updateVerified(userId: number, code: string): Promise<person_has_confirmation_code> {
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
