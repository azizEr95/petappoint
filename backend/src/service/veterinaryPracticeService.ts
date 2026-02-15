import { prisma } from "../singletonPC";
import {
  AnimalTypeType,
  ServiceType,
  VeterinaryPracticesCreateType,
  VeterinaryPracticeSearchQueryType,
  VeterinaryPracticesType,
  VeterinaryPracticeSearchResultType,
  VeterinariansType,
  AnimalsType,
  PersonsType,
  VeterinariansWithAnimalTypesType,
} from "petappoint-shared/schemas/ZodSchemas";
import { addressService } from "./addressService";
import { ResourceNotFoundError } from "../exceptions/errors/ResourceNotFoundError";
import { ConstraintError } from "../exceptions/errors/ConstraintError";
import { Prisma, veterinarypractices_has_confirmation_code } from "../../generated/prisma";
import { mapToVeterinaryPractice } from "../helper/mapToVeterinaryPractice";
import { mapToAnimal } from "../helper/mapToAnimal";
import { mapToPerson } from "../helper/mapToPerson";
import fs from "node:fs/promises";
import path from "node:path";
import VetPractices from "../models/VetPractices"

async function checkCreateEmailConstraint(veterinaryPracticeRe: VeterinaryPracticesCreateType) {
  const query = {
    where: {
      email: veterinaryPracticeRe.email
    },
    select: {
      id: true
    }
  }

  const [existingPerson, existingPractice] = await Promise.all([prisma.person.findFirst(query), prisma.veterinaryPractice.findUnique(query)]);
  if (existingPerson) {
    throw new ConstraintError("Email wird bereits verwendet", [{ path: "email", value: veterinaryPracticeRe.email }]);
  }

  if (existingPractice) {
    throw new ConstraintError("Email wird bereits verwendet", [{ path: "email", value: veterinaryPracticeRe.email }]);
  }
}

export const veterinaryPracticeService = {
  async create(veterinaryPracticeRe: VeterinaryPracticesCreateType): Promise<VeterinaryPracticesType> {
    await checkCreateEmailConstraint(veterinaryPracticeRe)
    return await VetPractices.create(veterinaryPracticeRe)
  },

  async getById(id: number): Promise<VeterinaryPracticesType> {
    return await VetPractices.getById(id)
  },

  async search(query: VeterinaryPracticeSearchQueryType): Promise<VeterinaryPracticeSearchResultType> {
    const page = query.page ?? 1;
    const pageSize = query.pageSize ?? 10;
    const skip = (page - 1) * pageSize;

    const whereCondition: Prisma.VeterinaryPracticeWhereInput = {
      AND: [
        !query.animalTypeIds || query.animalTypeIds.length <= 0
          ? {}
          : {
            veterinarians: {
              some: {
                veterinaryCanTreatAnimalTypes: {
                  some: {
                    animalTypeId: { in: query.animalTypeIds },
                  },
                },
              },
            },
          },
        !query.serviceTypeIds || query.serviceTypeIds.length <= 0
          ? {}
          : {
            AND: [
              {
                appointments: {
                  some: {
                    serviceId: null,
                    animalId: null
                  }
                },
                OR: [
                  {
                    appointments: {
                      some: {
                        appointmentHasServices: {
                          some: {
                            serviceId: { in: query.serviceTypeIds },
                          },
                        },
                      }
                    }
                  },
                  {
                    appointments: {
                      some: {
                        appointmentHasServices: { none: {} },
                      }
                    },
                    veterinarians: {
                      some: {
                        veterinaryHasServices: {
                          some: {
                            serviceId: { in: query.serviceTypeIds }
                          }
                        }
                      }
                    }
                  },
                ],
              }
            ],
          },
        query.name.length <= 0
          ? {}
          : {
            name: {
              contains: query.name,
              mode: "insensitive" as const,
            },
          },
        query.address.length <= 0
          ? {}
          : {
            address: {
              OR: [
                {
                  street: {
                    contains: query.address,
                    mode: "insensitive" as const,
                  },
                },
                {
                  city: {
                    contains: query.address,
                    mode: "insensitive" as const,
                  },
                },
                {
                  cityCode: {
                    contains: query.address,
                    mode: "insensitive" as const,
                  },
                },
                /*
                {
                  country: {
                    contains: query.address,
                    mode: "insensitive" as const,
                  },
                },
                */
              ],
            },
          },
      ],
    } as const;

    const [searchResults, total] = await Promise.all([
      prisma.veterinaryPractice.findMany({
        include: {
          address: true,
        },
        where: whereCondition,
        skip,
        take: pageSize,
      }),
      prisma.veterinaryPractice.count({
        where: whereCondition,
      }),
    ]);

    return {
      data: searchResults.map(x => mapToVeterinaryPractice(x)),
      total,
      page,
      pageSize,
    };
  },

  async getByEmail(email: string): Promise<VeterinaryPracticesType | null> {
    return await VetPractices.getByEmail(email)
  },

  async getAll(): Promise<VeterinaryPracticesType[]> {
    return await VetPractices.getAll()
  },

  async update(data: VeterinaryPracticesType): Promise<VeterinaryPracticesType> {
    return await VetPractices.update(data)
  },

  async delete(id: number): Promise<void> {
    return await VetPractices.delete(id)
  },

  async getServicesForPractice(veterinaryPracticeId: number): Promise<ServiceType[]> {
    const services = await prisma.veterinarian.findMany({
      select: {
        veterinaryHasServices: {
          select: {
            service: true,
          },
        },
      },
      where: {
        fk_veterinarypracticeid: veterinaryPracticeId,
      },
    });

    const flatServices = services.flatMap((x) => x.veterinaryHasServices).flatMap((x) => x.service);

    // check that every service ist only one time in the array
    const uniqueServicesMap = new Map<number, ServiceType>();
    const serviceArray: ServiceType[] = [];

    for (const service of flatServices) {
      if (service && !uniqueServicesMap.has(service.id)) {
        uniqueServicesMap.set(service.id, service as ServiceType);
        serviceArray.push(service);
      }
    }
    return serviceArray;
  },

  async isPersonACustomerOfPractice(personId: number, praxisId: number): Promise<boolean> {
    const appointmentWithAnimal = await prisma.appointment.findMany({
      where: {
        veterinaryPracticeId: praxisId,
        animal: {
          personHasAnimals: {
            some: {
              personId: personId
            }
          }
        }
      },
      select: {
        id: true
      }
    });

    return appointmentWithAnimal.length !== 0;
  },

  async getAnimalWithPerson(praxisId: number): Promise<{ animal: AnimalsType; person: PersonsType }[]> {
    const appointmentWithAnimal = await prisma.appointment.findMany({
      where: {
        veterinaryPracticeId: praxisId
      },
      include: {
        animal: {
          include: {
            personHasAnimals: {
              include: {
                person: {
                  include: {
                    address: true
                  },
                  omit: {
                    password: true
                  }
                }
              }
            }
          },
        }
      }
    });

    let animalPersons: { animal: AnimalsType; person: PersonsType }[] = []

    for (let apt of appointmentWithAnimal) {

      if (apt.animal?.personHasAnimals?.[0]) {
        const animal = apt.animal
        const person = apt.animal.personHasAnimals[0].person
        if (animal && person) {

          const exists = animalPersons.some(ap => ap.animal.id === animal.id && ap.person.id === person.id);

          if (!exists) {
            animalPersons.push({
              animal: mapToAnimal(animal),
              person: mapToPerson(person)
            });
          }
        }
      }
    }
    return animalPersons
  },

  async getAllAnimalTypes(praxisId: number): Promise<AnimalTypeType[]> {
    const found = await prisma.veterinaryPractice.findMany({
      select: {
        veterinarians: {
          select: {
            veterinaryCanTreatAnimalTypes: {
              include: {
                animalType: true,
              },
            },
          },
        },
      },
      where: { id: praxisId },
    });

    const curableAnimalTypes = found
      .flatMap((x) => x.veterinarians)
      .flatMap((x) => x.veterinaryCanTreatAnimalTypes)
      .flatMap((x) => x.animalType);

    const uniqueAnimalTypes = curableAnimalTypes.filter(
      (item, index, self) => index === self.findIndex((o) => o.id === item.id)
    );

    return uniqueAnimalTypes;
  },

  async getAllVeterinarians(praxisId: number): Promise<VeterinariansType[]> {
    const found = await prisma.veterinarian.findMany({
      where: {
        fk_veterinarypracticeid: praxisId
      },
      select: {
        id: true,
        infoEmail: true,
        person: {
          select: {
            firstName: true,
            lastName: true,
          }
        }
      }
    });
    return found.map(x => ({
      id: x.id,
      firstName: x.person.firstName,
      lastName: x.person.lastName,
      infoEmail: x.infoEmail,
      fk_veterinarypracticeid: praxisId
    }));
  },

  async checkConfirmationCodeExists(vetPracId: number, generatedCode: string): Promise<boolean> {
    const found = await prisma.veterinarypractices_has_confirmation_code.findFirst({
      where: {
        fk_veterinarypracticeid: vetPracId,
        code: generatedCode,
        dateofcreation: {
          gte: new Date(new Date().valueOf() - 15 * 60000)
        }
      }
    });
    return !!found;
  },

  async createConfirmationCode(userId: number, generatedCode: string): Promise<veterinarypractices_has_confirmation_code> {
    const created = await prisma.veterinarypractices_has_confirmation_code.upsert({
      where: {
        fk_veterinarypracticeid: userId
      },
      update: {
        code: generatedCode,
        dateofcreation: new Date().toISOString()
      },
      create: {
        fk_veterinarypracticeid: userId,
        code: generatedCode,
        dateofcreation: new Date().toISOString(),
        verified: false
      }
    });
    return created;
  },

  async checkVerified(vetPracId: number): Promise<boolean> {
    const check = await prisma.veterinarypractices_has_confirmation_code.findUnique({
      where: {
        fk_veterinarypracticeid: vetPracId
      }
    });
    if (!check) {
      throw new ResourceNotFoundError("Pracice not found.", "practiceId", vetPracId);
    }
    return check.verified;
  },

  async updateVerified(vetPracId: number, code: string): Promise<veterinarypractices_has_confirmation_code> {
    const practice = await prisma.veterinarypractices_has_confirmation_code.update({
      where: {
        fk_veterinarypracticeid: vetPracId,
        code: code
      },
      data: {
        verified: true
      }
    });
    return practice;
  },

  async getPicturePath(practiceId: number): Promise<string> {
    const found = await prisma.veterinaryPractice.findFirst({
      where: {
        id: practiceId,
      },
      select: {
        picturePath: true,
      },
    });

    const filepath = found?.picturePath ?? "public/placeholders/unknown.png";
    return path.join(appRootDir, filepath);
  },

  async savePicture(practiceId: number, fileOnDiskPath: string | null): Promise<void> {
    const old = await prisma.veterinaryPractice.findFirst({
      where: {
        id: practiceId,
      },
      select: {
        picturePath: true,
      },
    });
    if (!old) {
      throw new ConstraintError(`No practice with given id exists.`, [{ path: "practiceId", value: practiceId }]);
    }

    if (old.picturePath) {
      const oldImagePath = path.join(appRootDir, old.picturePath);
      fs.rm(oldImagePath).catch(() => { });
    }

    await prisma.veterinaryPractice.update({
      where: {
        id: practiceId,
      },
      data: {
        picturePath: fileOnDiskPath,
      },
      select: {
        picturePath: true,
      },
    });
  },

  async deletePicture(practiceId: number): Promise<void> {
    const practice = await prisma.veterinaryPractice.findFirst({
      where: {
        id: practiceId,
      },
      select: {
        picturePath: true,
      },
    });

    if (!practice) {
      throw new ResourceNotFoundError("Practice not found", "practiceId", practiceId);
    }

    if (practice.picturePath) {
      const imagePath = path.join(appRootDir, practice.picturePath);
      fs.rm(imagePath).catch(() => { });
    }

    await prisma.veterinaryPractice.update({
      where: {
        id: practiceId,
      },
      data: {
        picturePath: null,
      },
    });
  },
  async getTreatableAnimals(practiceId: number): Promise<VeterinariansWithAnimalTypesType[]> {
    const vets = await prisma.veterinaryCanTreatAnimalType.findMany({
      where: {
        veterinarian: {
          fk_veterinarypracticeid: practiceId
        }
      }
    });

    let veterinarians: VeterinariansWithAnimalTypesType[] = [];
    vets.forEach(vet => {
      let vetInList = veterinarians.find(v => v.id === vet.veterinaryId);
      if (vetInList === undefined) {
        veterinarians.push({ id: vet.veterinaryId, treatableAnimalTypes: [vet.animalTypeId] });
      }
      else {
        vetInList.treatableAnimalTypes.push(vet.animalTypeId);
      }
    });
    return veterinarians;
  }
};