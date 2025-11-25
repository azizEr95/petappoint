import { prisma } from "../singletonPC";
import { AnimalTypeType, ServiceType, VeterinaryPracticesCreateType, VeterinaryPracticeSearchQueryType, VeterinaryPracticesType } from "vetlib-shared/schemas/ZodSchemas";
import { addressService } from "./addressService";

export const veterinaryPracticeService = {
  async create(veterinaryPracticeRe: VeterinaryPracticesCreateType): Promise<VeterinaryPracticesType> {
    return await prisma.veterinarypractices.create({
      include: {
        addresses: true
      },
      data: {
        name: veterinaryPracticeRe.name,
        phone: veterinaryPracticeRe.phone,
        infoemail: veterinaryPracticeRe.infoemail,
        email: veterinaryPracticeRe.email,
        password: veterinaryPracticeRe.password,
        addresses: {
          create: veterinaryPracticeRe.addresses
        }
      }
    });
  },

  async getById(id: string): Promise<VeterinaryPracticesType> {
    const foundPractice = await prisma.veterinarypractices.findUnique({
      include: {
        addresses: true,
      },
      omit: {
        fk_addressid: true
      },
      where: {
        id: parseInt(id)
      }
    });

    if (!foundPractice) {
      throw new Error(`Veterinary Practice not found with id: ${id}`);
    }

    return foundPractice;
  },

  async search(query: VeterinaryPracticeSearchQueryType): Promise<VeterinaryPracticesType[]> {
    const searchResults = await prisma.veterinarypractices.findMany({
      include: {
        addresses: true
      },
      where: {
        AND: [
          (!query.animalTypeIds || query.animalTypeIds.length <= 0) ? {} : {
            veterinaries: {
              some: {
                veterinary_can_treat_animaltype: {
                  some: {
                    fk_animaltypeid: { in: query.animalTypeIds }
                  }
                }
              }
            }
          },
          (!query.serviceTypeIds || query.serviceTypeIds.length <= 0) ? {} : {
            veterinaries: {
              some: {
                veterinary_has_service: {
                  some: {
                    fk_serviceid: { in: query.serviceTypeIds }
                  }
                }
              }
            }
          },
          query.name.length <= 0 ? {} : {
            name: {
              contains: query.name,
              mode: "insensitive"
            }
          },
          query.address.length <= 0 ? {} : {
            addresses: {
              OR: [
                {
                  street: {
                    contains: query.address,
                    mode: "insensitive"
                  }
                },
                {
                  city: {
                    contains: query.address,
                    mode: "insensitive"
                  }
                },
                {
                  citycode: {
                    contains: query.address,
                    mode: "insensitive"
                  }
                },
                {
                  country: {
                    contains: query.address,
                    mode: "insensitive"
                  }
                }
              ]
            }
          }
        ]
      }
    });

    return searchResults;
  },

  async getByEmail(email: string): Promise<VeterinaryPracticesType | null> {
    return await prisma.veterinarypractices.findFirst({
      include: {
        addresses: true
      },

      where: {
        email
      }
    });
  },

  async getAll(): Promise<VeterinaryPracticesType[]> {
    return await prisma.veterinarypractices.findMany({
      include: {
        addresses: true
      }
    });
  },

  async update(data: VeterinaryPracticesType): Promise<VeterinaryPracticesType> {
    if (!data.id) throw new Error("ID is required for update");

    await addressService.update(data.addresses);

    const updatedPractice = await prisma.veterinarypractices.update({
      where: { id: data.id },
      data: {
        name: data.name,
        phone: data.phone,
        email: data.email,
        //password: data.password,
        infoemail: data.infoemail,
        info: data.info,
        website: data.website,
      },
      include: { addresses: true },
    });

    return updatedPractice;
  },


  async delete(id: number): Promise<void> {
    await prisma.veterinarypractices.delete({
      where: { id }
    });
  },

  async getServicesForPractice(veterinaryPracticeId: number): Promise<ServiceType[]> {
    const services = await prisma.veterinaries.findMany({
      select: {
        veterinary_has_service: {
          select: {
            services: true
          }
        }
      },
      where: {
        fk_veterinarypractice: veterinaryPracticeId
      }
    });

    const flatServices = services.flatMap(x => x.veterinary_has_service).flatMap(x => x.services);

    // check that every service ist only one time in the array
    const uniqueServicesMap = new Map<number, ServiceType>();
    const serviceArray: ServiceType[] = []

    for (const service of flatServices) {
      if (service && !uniqueServicesMap.has(service.id)) {
        uniqueServicesMap.set(service.id, service as ServiceType);
        serviceArray.push(service);
      }
    }
    return serviceArray;
  },

  async getAllAnimalTypes(praxisId: number): Promise<AnimalTypeType[]> {
    const found = await prisma.veterinarypractices.findMany({
      select: {
        veterinaries: {
          select: {
            veterinary_can_treat_animaltype: {
              include: {
                animaltypes: true
              }
            }
          }
        }
      },
      where: { id: praxisId }
    });

    const curableAnimalTypes = found.flatMap(x => x.veterinaries)
      .flatMap(x => x.veterinary_can_treat_animaltype)
      .flatMap(x => x.animaltypes);

    const uniqueAnimalTypes = curableAnimalTypes
      .filter((item, index, self) => index === self.findIndex(o => o.id === item.id));

    return uniqueAnimalTypes;
  }
};
