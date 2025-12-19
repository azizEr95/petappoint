import { prisma } from "../singletonPC";
import { Appointment } from "../../generated/prisma";
import {
  AppointmentFilterType,
  AppointmentsCreateType,
  AppointmentsType,
  ServiceType,
} from "vetilib-shared/schemas/ZodSchemas";
import { animalService } from "./animalService";
import { ResourceNotFoundError } from "../exceptions/errors/ResourceNotFoundError";
import { ConstraintError } from "../exceptions/errors/ConstraintError";

export const appointmentService = {
  async create(data: AppointmentsCreateType): Promise<AppointmentsType> {
    const created = await prisma.appointment.create({
      include: {
        animal: true,
        service: true,
        appointmentHasServices: {
          include: {
            service: true,
          },
        },
        veterinarian: {
          include: {
            person: {
              select: {
                firstName: true,
                lastName: true
              }
            }
          }
        },
        veterinaryPractice: {
          include: {
            address: true,
          },
          omit: {
            password: true,
          },
        },
      },
      data: {
        startTime: data.startTime,
        endTime: data.endTime,
        animal: data.animalId ? { connect: { id: data.animalId } } : undefined,
        veterinarian: { connect: { id: data.veterinaryId } },
        veterinaryPractice: { connect: { id: data.veterinaryPracticeId } },
      },
    });

    const availableServices = created.appointmentHasServices.flatMap((x) => x.service);
    return {
      id: created.id,
      startTime: created.startTime,
      endTime: created.endTime,
      animal: created.animal
        ? {
          id: created.animal.id,
          name: created.animal.name,
          dateOfBirth: created.animal.dateOfBirth,
          dateOfBirthIsExact: created.animal.dateOfBirthIsExact,
          heightInCm: created.animal.heightInCm,
          weightInGram: created.animal.weightInGram,
          isCastrated: created.animal.isCastrated,
          lifestyle: created.animal.lifestyle,
          sex: created.animal.sex,
          timeOfDeath: created.animal.timeOfDeath,
          animalGroupId: created.animal.animalGroupId,
          animalTypeId: created.animal.animalTypeId,
        }
        : null,
      veterinaryPractice: {
        id: created.veterinaryPractice.id,
        address: created.veterinaryPractice.address,
        email: created.veterinaryPractice.email,
        info: created.veterinaryPractice.info,
        infoEmail: created.veterinaryPractice.infoEmail,
        name: created.veterinaryPractice.name,
        phone: created.veterinaryPractice.phone,
        website: created.veterinaryPractice.website,
      },
      veterinary: {
        id: created.veterinarian.id,
        firstName: created.veterinarian.person.firstName,
        lastName: created.veterinarian.person.lastName,
        infoEmail: created.veterinarian.infoEmail,
        veterinaryPracticeId: created.veterinaryPractice.id,
      },
      service: created.service
        ? {
          id: created.service.id,
          name: created.service.name,
        }
        : null,
      availableServices: created.service ? availableServices : [],
      notes: created.notes,
    };
  },

  async getById(id: number): Promise<AppointmentsType> {
    const foundAppointment = await prisma.appointment.findUnique({
      where: { id },
      include: {
        animal: true,
        service: true,
        appointmentHasServices: {
          include: {
            service: true,
          },
        },
        veterinarian: {
          include: {
            person: {
              select: {
                firstName: true,
                lastName: true
              }
            },
            veterinaryHasServices: {
              include: {
                service: true,
              },
            },
          },
        },
        veterinaryPractice: {
          include: {
            address: true,
          },
          omit: {
            password: true,
          },
        },
      },
    });

    if (!foundAppointment) {
      throw new Error(`Appointment not found with id: ${id}`);
    }

    const availableServices: ServiceType[] =
      foundAppointment.appointmentHasServices.length > 0
        ? foundAppointment.appointmentHasServices.map((x) => x.service)
        : foundAppointment.veterinarian.veterinaryHasServices.map((x) => x.service);
    return {
      id: foundAppointment.id,
      startTime: foundAppointment.startTime,
      endTime: foundAppointment.endTime,
      animal: foundAppointment.animal
        ? {
          id: foundAppointment.animal.id,
          name: foundAppointment.animal.name,
          dateOfBirth: foundAppointment.animal.dateOfBirth,
          dateOfBirthIsExact: foundAppointment.animal.dateOfBirthIsExact,
          heightInCm: foundAppointment.animal.heightInCm,
          weightInGram: foundAppointment.animal.weightInGram,
          isCastrated: foundAppointment.animal.isCastrated,
          lifestyle: foundAppointment.animal.lifestyle,
          sex: foundAppointment.animal.sex,
          timeOfDeath: foundAppointment.animal.timeOfDeath,
          animalGroupId: foundAppointment.animal.animalGroupId,
          animalTypeId: foundAppointment.animal.animalTypeId,
        }
        : null,
      veterinaryPractice: {
        id: foundAppointment.veterinaryPractice.id,
        address: foundAppointment.veterinaryPractice.address,
        email: foundAppointment.veterinaryPractice.email,
        info: foundAppointment.veterinaryPractice.info,
        infoEmail: foundAppointment.veterinaryPractice.infoEmail,
        name: foundAppointment.veterinaryPractice.name,
        phone: foundAppointment.veterinaryPractice.phone,
        website: foundAppointment.veterinaryPractice.website,
      },
      veterinary: {
        id: foundAppointment.veterinarian.id,
        firstName: foundAppointment.veterinarian.person.firstName,
        lastName: foundAppointment.veterinarian.person.lastName,
        infoEmail: foundAppointment.veterinarian.infoEmail,
        veterinaryPracticeId: foundAppointment.veterinaryPractice.id,
      },
      service: foundAppointment.service
        ? {
          id: foundAppointment.service.id,
          name: foundAppointment.service.name,
        }
        : null,
      availableServices: availableServices,
      notes: foundAppointment.notes,
    };
  },

  async getAppointmentsByDateRange(
    startDate: Date,
    endDate: Date,
    filter?: AppointmentFilterType
  ): Promise<AppointmentsType[]> {
    const found = await prisma.appointment.findMany({
      include: {
        animal: true,
        service: true,
        appointmentHasServices: {
          include: {
            service: true,
          },
        },
        veterinarian: {
          include: {
            person: {
              select: {
                firstName: true,
                lastName: true
              }
            }
          }
        },
        veterinaryPractice: {
          include: {
            address: true,
          },
          omit: {
            password: true,
          },
        },
      },
      where: {
        startTime: {
          gte: startDate,
          lte: endDate,
        },
        // FILTER
        ...(filter &&
          filter.animalTypeIds && {
          veterinaryPractice: {
            veterinarians: {
              some: {
                veterinaryCanTreatAnimalTypes: {
                  some: {
                    animalTypeId: { in: filter.animalTypeIds },
                  },
                },
              },
            },
          },
        }),
        ...(filter &&
          filter.serviceTypeIds && {
          OR: [
            { serviceId: { in: filter.serviceTypeIds } },
            {
              serviceId: null,
              service: {
                id: {
                  in: filter.serviceTypeIds,
                },
              },
            },
          ],
        }),
        //
      },
    });

    return found.map((foundAppointment) => ({
      id: foundAppointment.id,
      startTime: foundAppointment.startTime,
      endTime: foundAppointment.endTime,
      animal: foundAppointment.animal
        ? {
          id: foundAppointment.animal.id,
          name: foundAppointment.animal.name,
          dateOfBirth: foundAppointment.animal.dateOfBirth,
          dateOfBirthIsExact: foundAppointment.animal.dateOfBirthIsExact,
          heightInCm: foundAppointment.animal.heightInCm,
          weightInGram: foundAppointment.animal.weightInGram,
          isCastrated: foundAppointment.animal.isCastrated,
          lifestyle: foundAppointment.animal.lifestyle,
          sex: foundAppointment.animal.sex,
          timeOfDeath: foundAppointment.animal.timeOfDeath,
          animalGroupId: foundAppointment.animal.animalGroupId,
          animalTypeId: foundAppointment.animal.animalTypeId,
        }
        : null,
      veterinaryPractice: {
        id: foundAppointment.veterinaryPractice.id,
        address: foundAppointment.veterinaryPractice.address,
        email: foundAppointment.veterinaryPractice.email,
        info: foundAppointment.veterinaryPractice.info,
        infoEmail: foundAppointment.veterinaryPractice.infoEmail,
        name: foundAppointment.veterinaryPractice.name,
        phone: foundAppointment.veterinaryPractice.phone,
        website: foundAppointment.veterinaryPractice.website,
      },
      veterinary: {
        id: foundAppointment.veterinarian.id,
        firstName: foundAppointment.veterinarian.person.firstName,
        lastName: foundAppointment.veterinarian.person.lastName,
        infoEmail: foundAppointment.veterinarian.infoEmail,
        veterinaryPracticeId: foundAppointment.veterinaryPractice.id,
      },
      service: foundAppointment.service
        ? {
          id: foundAppointment.service.id,
          name: foundAppointment.service.name,
        }
        : null,
      availableServices: foundAppointment.serviceId
        ? foundAppointment.appointmentHasServices.flatMap((x) => x.service)
        : [],
      notes: foundAppointment.notes,
    }));
  },

  async getAppointmentsByVeterinary(veterinaryId: number, filter?: AppointmentFilterType, includePast: boolean = false, includeUnbooked: boolean = false): Promise<AppointmentsType[]> {
    const found = await prisma.appointment.findMany({
      where: {
        veterinaryId: veterinaryId,
        // FILTER
        ...(!includePast &&
        {
          endTime: {
            gte: new Date()
          }
        }
        ),
        ...(!includeUnbooked &&
        {
          NOT: {
            animalId: null,
            serviceId: null
          }
        }
        ),
        ...(filter &&
          filter.animalTypeIds && {
          veterinaryPractice: {
            veterinarians: {
              some: {
                veterinaryCanTreatAnimalTypes: {
                  some: {
                    animalTypeId: { in: filter.animalTypeIds },
                  },
                },
              },
            },
          },
        }),
        ...(filter &&
          filter.serviceTypeIds && {
          OR: [
            { serviceId: { in: filter.serviceTypeIds } },
            {
              serviceId: null,
              service: {
                id: {
                  in: filter.serviceTypeIds,
                },
              },
            },
          ],
        }),
        //
      },
      include: {
        animal: true,
        service: true,
        appointmentHasServices: {
          include: {
            service: true,
          },
        },
        veterinarian: {
          include: {
            person: {
              select: {
                firstName: true,
                lastName: true
              }
            }
          }
        },
        veterinaryPractice: {
          include: {
            address: true,
          },
          omit: {
            password: true,
          },
        },
      },
    });

    return found.map((foundAppointment) => ({
      id: foundAppointment.id,
      startTime: foundAppointment.startTime,
      endTime: foundAppointment.endTime,
      animal: foundAppointment.animal
        ? {
          id: foundAppointment.animal.id,
          name: foundAppointment.animal.name,
          dateOfBirth: foundAppointment.animal.dateOfBirth,
          dateOfBirthIsExact: foundAppointment.animal.dateOfBirthIsExact,
          heightInCm: foundAppointment.animal.heightInCm,
          weightInGram: foundAppointment.animal.weightInGram,
          isCastrated: foundAppointment.animal.isCastrated,
          lifestyle: foundAppointment.animal.lifestyle,
          sex: foundAppointment.animal.sex,
          timeOfDeath: foundAppointment.animal.timeOfDeath,
          animalGroupId: foundAppointment.animal.animalGroupId,
          animalTypeId: foundAppointment.animal.animalTypeId,
        }
        : null,
      veterinaryPractice: {
        id: foundAppointment.veterinaryPractice.id,
        address: foundAppointment.veterinaryPractice.address,
        email: foundAppointment.veterinaryPractice.email,
        info: foundAppointment.veterinaryPractice.info,
        infoEmail: foundAppointment.veterinaryPractice.infoEmail,
        name: foundAppointment.veterinaryPractice.name,
        phone: foundAppointment.veterinaryPractice.phone,
        website: foundAppointment.veterinaryPractice.website,
      },
      veterinary: {
        id: foundAppointment.veterinarian.id,
        firstName: foundAppointment.veterinarian.person.firstName,
        lastName: foundAppointment.veterinarian.person.lastName,
        infoEmail: foundAppointment.veterinarian.infoEmail,
        veterinaryPracticeId: foundAppointment.veterinaryPractice.id,
      },
      service: foundAppointment.service
        ? {
          id: foundAppointment.service.id,
          name: foundAppointment.service.name,
        }
        : null,
      availableServices: foundAppointment.serviceId
        ? foundAppointment.appointmentHasServices.flatMap((x) => x.service)
        : [],
      notes: foundAppointment.notes,
    }));
  },

  async getForPractice(veterinaryPracticeId: number, filter?: AppointmentFilterType): Promise<AppointmentsType[]> {
    const found = await prisma.appointment.findMany({
      include: {
        animal: true,
        service: true,
        appointmentHasServices: {
          include: {
            service: true,
          },
        },
        veterinarian: {
          include: {
            person: {
              select: {
                firstName: true,
                lastName: true
              }
            }
          }
        },
        veterinaryPractice: {
          include: {
            address: true,
          },
          omit: {
            password: true,
          },
        },
      },
      where: {
        veterinaryPracticeId: veterinaryPracticeId,
        // FILTER
        ...(filter &&
          filter.animalTypeIds && {
          veterinaryPractice: {
            veterinarians: {
              some: {
                veterinaryCanTreatAnimalTypes: {
                  some: {
                    animalTypeId: { in: filter.animalTypeIds },
                  },
                },
              },
            },
          },
        }),
        ...(filter &&
          filter.serviceTypeIds && {
          OR: [
            { serviceId: { in: filter.serviceTypeIds } },
            {
              serviceId: null,
              service: {
                id: {
                  in: filter.serviceTypeIds,
                },
              },
            },
          ],
        }),
        //
      },
    });

    return found.map((foundAppointment) => ({
      id: foundAppointment.id,
      startTime: foundAppointment.startTime,
      endTime: foundAppointment.endTime,
      animal: foundAppointment.animal
        ? {
          id: foundAppointment.animal.id,
          name: foundAppointment.animal.name,
          dateOfBirth: foundAppointment.animal.dateOfBirth,
          dateOfBirthIsExact: foundAppointment.animal.dateOfBirthIsExact,
          heightInCm: foundAppointment.animal.heightInCm,
          weightInGram: foundAppointment.animal.weightInGram,
          isCastrated: foundAppointment.animal.isCastrated,
          lifestyle: foundAppointment.animal.lifestyle,
          sex: foundAppointment.animal.sex,
          timeOfDeath: foundAppointment.animal.timeOfDeath,
          animalGroupId: foundAppointment.animal.animalGroupId,
          animalTypeId: foundAppointment.animal.animalTypeId,
        }
        : null,
      veterinaryPractice: {
        id: foundAppointment.veterinaryPractice.id,
        address: foundAppointment.veterinaryPractice.address,
        email: foundAppointment.veterinaryPractice.email,
        info: foundAppointment.veterinaryPractice.info,
        infoEmail: foundAppointment.veterinaryPractice.infoEmail,
        name: foundAppointment.veterinaryPractice.name,
        phone: foundAppointment.veterinaryPractice.phone,
        website: foundAppointment.veterinaryPractice.website,
      },
      veterinary: {
        id: foundAppointment.veterinarian.id,
        firstName: foundAppointment.veterinarian.person.firstName,
        lastName: foundAppointment.veterinarian.person.lastName,
        infoEmail: foundAppointment.veterinarian.infoEmail,
        veterinaryPracticeId: foundAppointment.veterinaryPractice.id,
      },
      service: foundAppointment.service
        ? {
          id: foundAppointment.service.id,
          name: foundAppointment.service.name,
        }
        : null,
      availableServices: foundAppointment.serviceId
        ? foundAppointment.appointmentHasServices.flatMap((x) => x.service)
        : [],
      notes: foundAppointment.notes,
    }));
  },

  async getAvailableAppointmentsForPractice(
    veterinaryPracticeId: number,
    filter?: AppointmentFilterType
  ): Promise<AppointmentsType[]> {
    const found = await prisma.appointment.findMany({
      include: {
        animal: true,
        service: true,
        appointmentHasServices: {
          include: {
            service: true,
          },
        },
        veterinarian: {
          include: {
            person: {
              select: {
                firstName: true,
                lastName: true
              }
            },
            veterinaryCanTreatAnimalTypes: true,
            veterinaryHasServices: {
              include: {
                service: true,
              },
            },
          },
        },
        veterinaryPractice: {
          include: {
            address: true,
          },
          omit: {
            password: true,
          },
        },
      },
      where: {
        veterinaryPracticeId: veterinaryPracticeId,
        animalId: null,
        serviceId: null,
        // FILTER
        ...(filter &&
          filter.animalTypeIds &&
          filter.animalTypeIds.length > 0 && {
          veterinarian: {
            veterinaryCanTreatAnimalTypes: {
              some: {
                animalTypeId: { in: filter.animalTypeIds },
              }
            }
          }
        }),
        ...(filter &&
          filter.serviceTypeIds &&
          filter.serviceTypeIds.length > 0 && {
          OR: [
            {
              appointmentHasServices: {
                some: {
                  serviceId: { in: filter.serviceTypeIds },
                },
              },
            },
            {
              appointmentHasServices: { none: {} },
              veterinarian: {
                veterinaryHasServices: {
                  some: {
                    serviceId: { in: filter.serviceTypeIds },
                  },
                },
              },
            },
          ],
        }),
        //
      },
    });

    return found.map((foundAppointment) => {
      let availableServices: ServiceType[] =
        foundAppointment.appointmentHasServices.length > 0
          ? foundAppointment.appointmentHasServices.map((x) => x.service)
          : foundAppointment.veterinarian.veterinaryHasServices.map((x) => x.service);
      if (filter && filter.serviceTypeIds && filter.serviceTypeIds.length > 0) {
        availableServices = availableServices.filter((x) => filter.serviceTypeIds?.includes(x.id));
      }
      return {
        id: foundAppointment.id,
        startTime: foundAppointment.startTime,
        endTime: foundAppointment.endTime,
        animal: foundAppointment.animal
          ? {
            id: foundAppointment.animal.id,
            name: foundAppointment.animal.name,
            dateOfBirth: foundAppointment.animal.dateOfBirth,
            dateOfBirthIsExact: foundAppointment.animal.dateOfBirthIsExact,
            heightInCm: foundAppointment.animal.heightInCm,
            weightInGram: foundAppointment.animal.weightInGram,
            isCastrated: foundAppointment.animal.isCastrated,
            lifestyle: foundAppointment.animal.lifestyle,
            sex: foundAppointment.animal.sex,
            timeOfDeath: foundAppointment.animal.timeOfDeath,
            animalGroupId: foundAppointment.animal.animalGroupId,
            animalTypeId: foundAppointment.animal.animalTypeId,
          }
          : null,
        veterinaryPractice: {
          id: foundAppointment.veterinaryPractice.id,
          address: foundAppointment.veterinaryPractice.address,
          email: foundAppointment.veterinaryPractice.email,
          info: foundAppointment.veterinaryPractice.info,
          infoEmail: foundAppointment.veterinaryPractice.infoEmail,
          name: foundAppointment.veterinaryPractice.name,
          phone: foundAppointment.veterinaryPractice.phone,
          website: foundAppointment.veterinaryPractice.website,
        },
        veterinary: {
          id: foundAppointment.veterinarian.id,
          firstName: foundAppointment.veterinarian.person.firstName,
          lastName: foundAppointment.veterinarian.person.lastName,
          infoEmail: foundAppointment.veterinarian.infoEmail,
          veterinaryPracticeId: foundAppointment.veterinaryPractice.id,
        },
        service: foundAppointment.service
          ? {
            id: foundAppointment.service.id,
            name: foundAppointment.service.name,
          }
          : null,
        availableServices: availableServices,
        notes: foundAppointment.notes,
      };
    });
  },

  async getBookedAppointmentsForPractice(
    veterinaryPracticeId: number,
    filter?: AppointmentFilterType,
    includePast: boolean = false
  ): Promise<AppointmentsType[]> {
    const found = await prisma.appointment.findMany({
      include: {
        animal: true,
        service: true,
        appointmentHasServices: {
          include: {
            service: true,
          },
        },
        veterinarian: {
          include: {
            person: true,
            veterinaryCanTreatAnimalTypes: true,
            veterinaryHasServices: {
              include: {
                service: true,
              },
            },
          },
        },
        veterinaryPractice: {
          include: {
            address: true,
          },
          omit: {
            password: true,
          },
        },
      },
      where: {
        veterinaryPracticeId: veterinaryPracticeId,
        NOT: {
          animalId: null,
          serviceId: null
        },
        // FILTER
        ...(!includePast &&
        {
          endTime: {
            gte: new Date()
          }
        }
        ),
        ...(filter &&
          filter.animalTypeIds &&
          filter.animalTypeIds.length > 0 && {
          veterinarian: {
            veterinaryCanTreatAnimalTypes: {
              some: {
                animalTypeId: { in: filter.animalTypeIds },
              }
            }
          }
        }),
        ...(filter &&
          filter.serviceTypeIds &&
          filter.serviceTypeIds.length > 0 && {
          OR: [
            {
              appointmentHasServices: {
                some: {
                  serviceId: { in: filter.serviceTypeIds },
                },
              },
            },
            {
              appointmentHasServices: { none: {} },
              veterinarian: {
                veterinaryHasServices: {
                  some: {
                    serviceId: { in: filter.serviceTypeIds },
                  },
                },
              },
            },
          ],
        }),
        //
      },
    });

    return found.map((foundAppointment) => {
      let availableServices: ServiceType[] =
        foundAppointment.appointmentHasServices.length > 0
          ? foundAppointment.appointmentHasServices.map((x) => x.service)
          : foundAppointment.veterinarian.veterinaryHasServices.map((x) => x.service);
      if (filter && filter.serviceTypeIds && filter.serviceTypeIds.length > 0) {
        availableServices = availableServices.filter((x) => filter.serviceTypeIds?.includes(x.id));
      }
      return {
        id: foundAppointment.id,
        startTime: foundAppointment.startTime,
        endTime: foundAppointment.endTime,
        animal: foundAppointment.animal
          ? {
            id: foundAppointment.animal.id,
            name: foundAppointment.animal.name,
            dateOfBirth: foundAppointment.animal.dateOfBirth,
            dateOfBirthIsExact: foundAppointment.animal.dateOfBirthIsExact,
            heightInCm: foundAppointment.animal.heightInCm,
            weightInGram: foundAppointment.animal.weightInGram,
            isCastrated: foundAppointment.animal.isCastrated,
            lifestyle: foundAppointment.animal.lifestyle,
            sex: foundAppointment.animal.sex,
            timeOfDeath: foundAppointment.animal.timeOfDeath,
            animalGroupId: foundAppointment.animal.animalGroupId,
            animalTypeId: foundAppointment.animal.animalTypeId,
          }
          : null,
        veterinaryPractice: {
          id: foundAppointment.veterinaryPractice.id,
          address: foundAppointment.veterinaryPractice.address,
          email: foundAppointment.veterinaryPractice.email,
          info: foundAppointment.veterinaryPractice.info,
          infoEmail: foundAppointment.veterinaryPractice.infoEmail,
          name: foundAppointment.veterinaryPractice.name,
          phone: foundAppointment.veterinaryPractice.phone,
          website: foundAppointment.veterinaryPractice.website,
        },
        veterinary: {
          id: foundAppointment.veterinarian.id,
          firstName: foundAppointment.veterinarian.person.firstName,
          lastName: foundAppointment.veterinarian.person.lastName,
          infoEmail: foundAppointment.veterinarian.infoEmail,
          veterinaryPracticeId: foundAppointment.veterinaryPractice.id,
        },
        service: foundAppointment.service
          ? {
            id: foundAppointment.service.id,
            name: foundAppointment.service.name,
          }
          : null,
        availableServices: availableServices,
        notes: foundAppointment.notes,
      };
    });
  },

  async getPastAppointmentsForPerson(personId: number, filter?: AppointmentFilterType): Promise<AppointmentsType[]> {
    const now = new Date();
    const animals = await animalService.getByPersonId(personId);

    if (animals.length == 0) {
      return [];
    }

    const animalIds = animals.map((a) => a.id);
    const appointments = await prisma.appointment.findMany({
      include: {
        animal: true,
        veterinarian: {
          include: {
            person: {
              select: {
                firstName: true,
                lastName: true
              }
            }
          }
        },
        service: true,
        appointmentHasServices: {
          include: {
            service: true,
          },
        },
        veterinaryPractice: {
          include: {
            address: true,
          },
          omit: {
            password: true,
          },
        },
      },
      where: {
        animalId: {
          in: animalIds, // in the list
        },
        startTime: {
          lt: now, // less than
        },
        // FILTER
        ...(filter &&
          filter.animalTypeIds && {
          veterinaryPractice: {
            veterinarians: {
              some: {
                veterinaryCanTreatAnimalTypes: {
                  some: {
                    animalTypeId: { in: filter.animalTypeIds },
                  },
                },
              },
            },
          },
        }),
        ...(filter &&
          filter.serviceTypeIds && {
          serviceId: { in: filter.serviceTypeIds },
        }),
        //
      },
    });

    return appointments.map((foundAppointment) => ({
      id: foundAppointment.id,
      startTime: foundAppointment.startTime,
      endTime: foundAppointment.endTime,
      animal: foundAppointment.animal
        ? {
          id: foundAppointment.animal.id,
          name: foundAppointment.animal.name,
          dateOfBirth: foundAppointment.animal.dateOfBirth,
          dateOfBirthIsExact: foundAppointment.animal.dateOfBirthIsExact,
          heightInCm: foundAppointment.animal.heightInCm,
          weightInGram: foundAppointment.animal.weightInGram,
          isCastrated: foundAppointment.animal.isCastrated,
          lifestyle: foundAppointment.animal.lifestyle,
          sex: foundAppointment.animal.sex,
          timeOfDeath: foundAppointment.animal.timeOfDeath,
          animalGroupId: foundAppointment.animal.animalGroupId,
          animalTypeId: foundAppointment.animal.animalTypeId,
        }
        : null,
      veterinaryPractice: {
        id: foundAppointment.veterinaryPractice.id,
        address: foundAppointment.veterinaryPractice.address,
        email: foundAppointment.veterinaryPractice.email,
        info: foundAppointment.veterinaryPractice.info,
        infoEmail: foundAppointment.veterinaryPractice.infoEmail,
        name: foundAppointment.veterinaryPractice.name,
        phone: foundAppointment.veterinaryPractice.phone,
        website: foundAppointment.veterinaryPractice.website,
      },
      veterinary: {
        id: foundAppointment.veterinarian.id,
        firstName: foundAppointment.veterinarian.person.firstName,
        lastName: foundAppointment.veterinarian.person.lastName,
        infoEmail: foundAppointment.veterinarian.infoEmail,
        veterinaryPracticeId: foundAppointment.veterinaryPractice.id,
      },
      service: foundAppointment.service
        ? {
          id: foundAppointment.service.id,
          name: foundAppointment.service.name,
        }
        : null,
      availableServices: foundAppointment.serviceId
        ? foundAppointment.appointmentHasServices.flatMap((x) => x.service)
        : [],
      notes: foundAppointment.notes,
    }));
  },

  async getFutureAppointmentsForPerson(personId: number, filter?: AppointmentFilterType): Promise<AppointmentsType[]> {
    const now = new Date();
    const animals = await animalService.getByPersonId(personId);

    if (animals.length == 0) {
      return [];
    }

    const animalIds = animals.map((a) => a.id);
    const appointments = await prisma.appointment.findMany({
      include: {
        animal: true,
        service: true,
        appointmentHasServices: {
          include: {
            service: true,
          },
        },
        veterinarian: {
          include: {
            person: {
              select: {
                firstName: true,
                lastName: true
              }
            }
          }
        },
        veterinaryPractice: {
          include: {
            address: true,
          },
          omit: {
            password: true,
          },
        },
      },
      where: {
        animalId: {
          in: animalIds,
        },
        startTime: {
          gt: now, // greater than
        },
        // FILTER
        ...(filter &&
          filter.animalTypeIds && {
          veterinaryPractice: {
            veterinarians: {
              some: {
                veterinaryCanTreatAnimalTypes: {
                  some: {
                    animalTypeId: { in: filter.animalTypeIds },
                  },
                },
              },
            },
          },
        }),
        ...(filter &&
          filter.serviceTypeIds && {
          serviceId: { in: filter.serviceTypeIds },
        }),
        //
      },
    });

    return appointments.map((foundAppointment) => ({
      id: foundAppointment.id,
      startTime: foundAppointment.startTime,
      endTime: foundAppointment.endTime,
      animal: foundAppointment.animal
        ? {
          id: foundAppointment.animal.id,
          name: foundAppointment.animal.name,
          dateOfBirth: foundAppointment.animal.dateOfBirth,
          dateOfBirthIsExact: foundAppointment.animal.dateOfBirthIsExact,
          heightInCm: foundAppointment.animal.heightInCm,
          weightInGram: foundAppointment.animal.weightInGram,
          isCastrated: foundAppointment.animal.isCastrated,
          lifestyle: foundAppointment.animal.lifestyle,
          sex: foundAppointment.animal.sex,
          timeOfDeath: foundAppointment.animal.timeOfDeath,
          animalGroupId: foundAppointment.animal.animalGroupId,
          animalTypeId: foundAppointment.animal.animalTypeId,
        }
        : null,
      veterinaryPractice: {
        id: foundAppointment.veterinaryPractice.id,
        address: foundAppointment.veterinaryPractice.address,
        email: foundAppointment.veterinaryPractice.email,
        info: foundAppointment.veterinaryPractice.info,
        infoEmail: foundAppointment.veterinaryPractice.infoEmail,
        name: foundAppointment.veterinaryPractice.name,
        phone: foundAppointment.veterinaryPractice.phone,
        website: foundAppointment.veterinaryPractice.website,
      },
      veterinary: {
        id: foundAppointment.veterinarian.id,
        firstName: foundAppointment.veterinarian.person.firstName,
        lastName: foundAppointment.veterinarian.person.lastName,
        infoEmail: foundAppointment.veterinarian.infoEmail,
        veterinaryPracticeId: foundAppointment.veterinaryPractice.id,
      },
      service: foundAppointment.service
        ? {
          id: foundAppointment.service.id,
          name: foundAppointment.service.name,
        }
        : null,
      availableServices: foundAppointment.serviceId
        ? foundAppointment.appointmentHasServices.flatMap((x) => x.service)
        : [],
      notes: foundAppointment.notes,
    }));
  },

  async getAll(): Promise<AppointmentsType[]> {
    const found = await prisma.appointment.findMany({
      include: {
        animal: true,
        service: true,
        appointmentHasServices: {
          include: {
            service: true,
          },
        },
        veterinarian: {
          include: {
            person: {
              select: {
                firstName: true,
                lastName: true
              }
            }
          }
        },
        veterinaryPractice: {
          include: {
            address: true,
          },
          omit: {
            password: true,
          },
        },
      },
    });

    return found.map((foundAppointment) => ({
      id: foundAppointment.id,
      startTime: foundAppointment.startTime,
      endTime: foundAppointment.endTime,
      animal: foundAppointment.animal
        ? {
          id: foundAppointment.animal.id,
          name: foundAppointment.animal.name,
          dateOfBirth: foundAppointment.animal.dateOfBirth,
          dateOfBirthIsExact: foundAppointment.animal.dateOfBirthIsExact,
          heightInCm: foundAppointment.animal.heightInCm,
          weightInGram: foundAppointment.animal.weightInGram,
          isCastrated: foundAppointment.animal.isCastrated,
          lifestyle: foundAppointment.animal.lifestyle,
          sex: foundAppointment.animal.sex,
          timeOfDeath: foundAppointment.animal.timeOfDeath,
          animalGroupId: foundAppointment.animal.animalGroupId,
          animalTypeId: foundAppointment.animal.animalTypeId,
        }
        : null,
      veterinaryPractice: {
        id: foundAppointment.veterinaryPractice.id,
        address: foundAppointment.veterinaryPractice.address,
        email: foundAppointment.veterinaryPractice.email,
        info: foundAppointment.veterinaryPractice.info,
        infoEmail: foundAppointment.veterinaryPractice.infoEmail,
        name: foundAppointment.veterinaryPractice.name,
        phone: foundAppointment.veterinaryPractice.phone,
        website: foundAppointment.veterinaryPractice.website,
      },
      veterinary: {
        id: foundAppointment.veterinarian.id,
        firstName: foundAppointment.veterinarian.person.firstName,
        lastName: foundAppointment.veterinarian.person.lastName,
        infoEmail: foundAppointment.veterinarian.infoEmail,
        veterinaryPracticeId: foundAppointment.veterinaryPractice.id,
      },
      service: foundAppointment.service
        ? {
          id: foundAppointment.service.id,
          name: foundAppointment.service.name,
        }
        : null,
      availableServices: foundAppointment.service
        ? foundAppointment.appointmentHasServices.flatMap((x) => x.service)
        : [],
      notes: foundAppointment.notes,
    }));
  },

  async update(data: Appointment): Promise<AppointmentsType> {
    if (!data.id) {
      throw new Error("ID is required for update");
    }

    const updated = await prisma.appointment.update({
      include: {
        animal: true,
        service: true,
        appointmentHasServices: {
          include: {
            service: true,
          },
        },
        veterinarian: {
          include: {
            person: {
              select: {
                firstName: true,
                lastName: true
              }
            }
          }
        },
        veterinaryPractice: {
          include: {
            address: true,
          },
          omit: {
            password: true,
          },
        },
      },
      where: { id: data.id },
      data: data,
    });

    return {
      id: updated.id,
      startTime: updated.startTime,
      endTime: updated.endTime,
      animal: updated.animal
        ? {
          id: updated.animal.id,
          name: updated.animal.name,
          dateOfBirth: updated.animal.dateOfBirth,
          dateOfBirthIsExact: updated.animal.dateOfBirthIsExact,
          heightInCm: updated.animal.heightInCm,
          weightInGram: updated.animal.weightInGram,
          isCastrated: updated.animal.isCastrated,
          lifestyle: updated.animal.lifestyle,
          sex: updated.animal.sex,
          timeOfDeath: updated.animal.timeOfDeath,
          animalGroupId: updated.animal.animalGroupId,
          animalTypeId: updated.animal.animalTypeId,
        }
        : null,
      veterinaryPractice: {
        id: updated.veterinaryPractice.id,
        address: updated.veterinaryPractice.address,
        email: updated.veterinaryPractice.email,
        info: updated.veterinaryPractice.info,
        infoEmail: updated.veterinaryPractice.infoEmail,
        name: updated.veterinaryPractice.name,
        phone: updated.veterinaryPractice.phone,
        website: updated.veterinaryPractice.website,
      },
      veterinary: {
        id: updated.veterinarian.id,
        firstName: updated.veterinarian.person.firstName,
        lastName: updated.veterinarian.person.lastName,
        infoEmail: updated.veterinarian.infoEmail,
        veterinaryPracticeId: updated.veterinaryPractice.id,
      },
      service: updated.service
        ? {
          id: updated.service.id,
          name: updated.service.name,
        }
        : null,
      availableServices: updated.service ? updated.appointmentHasServices.flatMap((x) => x.service) : [],
      notes: updated.notes,
    };
  },

  async updateAppointmentAsPerson(id: number, animalId: number, serviceId: number): Promise<AppointmentsType> {
    // check if appointment is available
    const appointment = await prisma.appointment.findUnique({
      where: {
        id: id,
      },
    });
    if (!appointment) {
      throw new ResourceNotFoundError(`Appointment with id(${id}) does not exist`, "id", id);
    }

    if (appointment.animalId) {
      throw new ConstraintError("Appointment is already taken.", [
        {
          path: "id",
          value: id,
        },
      ]);
    }

    const updated = await prisma.appointment.update({
      include: {
        animal: true,
        service: true,
        appointmentHasServices: {
          include: {
            service: true,
          },
        },
        veterinarian: {
          include: {
            person: {
              select: {
                firstName: true,
                lastName: true
              }
            }
          }
        },
        veterinaryPractice: {
          include: {
            address: true,
          },
          omit: {
            password: true,
          },
        },
      },
      where: {
        id: id,
      },
      data: {
        animalId: animalId,
        serviceId: serviceId,
      },
    });

    return {
      id: updated.id,
      startTime: updated.startTime,
      endTime: updated.endTime,
      animal: updated.animal
        ? {
          id: updated.animal.id,
          name: updated.animal.name,
          dateOfBirth: updated.animal.dateOfBirth,
          dateOfBirthIsExact: updated.animal.dateOfBirthIsExact,
          heightInCm: updated.animal.heightInCm,
          weightInGram: updated.animal.weightInGram,
          isCastrated: updated.animal.isCastrated,
          lifestyle: updated.animal.lifestyle,
          sex: updated.animal.sex,
          timeOfDeath: updated.animal.timeOfDeath,
          animalGroupId: updated.animal.animalGroupId,
          animalTypeId: updated.animal.animalTypeId,
        }
        : null,
      veterinaryPractice: {
        id: updated.veterinaryPractice.id,
        address: updated.veterinaryPractice.address,
        email: updated.veterinaryPractice.email,
        info: updated.veterinaryPractice.info,
        infoEmail: updated.veterinaryPractice.infoEmail,
        name: updated.veterinaryPractice.name,
        phone: updated.veterinaryPractice.phone,
        website: updated.veterinaryPractice.website,
      },
      veterinary: {
        id: updated.veterinarian.id,
        firstName: updated.veterinarian.person.firstName,
        lastName: updated.veterinarian.person.lastName,
        infoEmail: updated.veterinarian.infoEmail,
        veterinaryPracticeId: updated.veterinaryPractice.id,
      },
      service: updated.service
        ? {
          id: updated.service.id,
          name: updated.service.name,
        }
        : null,
      availableServices: updated.service ? updated.appointmentHasServices.flatMap((x) => x.service) : [],
      notes: updated.notes,
    };
  },

  async delete(id: number): Promise<void> {
    await prisma.appointment.delete({ where: { id } });
  },

  async cancelAppointmentAsPerson(id: number): Promise<AppointmentsType> {
    const updated = await prisma.appointment.update({
      include: {
        animal: true,
        service: true,
        appointmentHasServices: {
          include: {
            service: true,
          },
        },
        veterinarian: {
          include: {
            person: {
              select: {
                firstName: true,
                lastName: true
              }
            }
          }
        },
        veterinaryPractice: {
          include: {
            address: true,
          },
          omit: {
            password: true,
          },
        },
      },
      where: { id },
      data: {
        animalId: null,
        serviceId: null,
      },
    });

    return {
      id: updated.id,
      startTime: updated.startTime,
      endTime: updated.endTime,
      animal: updated.animal
        ? {
          id: updated.animal.id,
          name: updated.animal.name,
          dateOfBirth: updated.animal.dateOfBirth,
          dateOfBirthIsExact: updated.animal.dateOfBirthIsExact,
          heightInCm: updated.animal.heightInCm,
          weightInGram: updated.animal.weightInGram,
          isCastrated: updated.animal.isCastrated,
          lifestyle: updated.animal.lifestyle,
          sex: updated.animal.sex,
          timeOfDeath: updated.animal.timeOfDeath,
          animalGroupId: updated.animal.animalGroupId,
          animalTypeId: updated.animal.animalTypeId,
        }
        : null,
      veterinaryPractice: {
        id: updated.veterinaryPractice.id,
        address: updated.veterinaryPractice.address,
        email: updated.veterinaryPractice.email,
        info: updated.veterinaryPractice.info,
        infoEmail: updated.veterinaryPractice.infoEmail,
        name: updated.veterinaryPractice.name,
        phone: updated.veterinaryPractice.phone,
        website: updated.veterinaryPractice.website,
      },
      veterinary: {
        id: updated.veterinarian.id,
        firstName: updated.veterinarian.person.firstName,
        lastName: updated.veterinarian.person.lastName,
        infoEmail: updated.veterinarian.infoEmail,
        veterinaryPracticeId: updated.veterinaryPractice.id,
      },
      service: updated.service
        ? {
          id: updated.service.id,
          name: updated.service.name,
        }
        : null,
      availableServices: updated.service ? updated.appointmentHasServices.flatMap((x) => x.service) : [],
      notes: updated.notes,
    };
  },

  async updateNotes(id: number, notes: string | null): Promise<AppointmentsType> {
    const updated = await prisma.appointment.update({
      include: {
        animal: true,
        service: true,
        appointmentHasServices: {
          include: {
            service: true,
          },
        },
        veterinarian: {
          include: {
            person:{
              select:{
                firstName: true,
                lastName: true
              }
            }
          }
        },
        veterinaryPractice: {
          include: {
            address: true,
          },
          omit: {
            password: true,
          },
        },
      },
      where: { id },
      data: { notes },
    });

    return {
      id: updated.id,
      startTime: updated.startTime,
      endTime: updated.endTime,
      animal: updated.animal
        ? {
          id: updated.animal.id,
          name: updated.animal.name,
          dateOfBirth: updated.animal.dateOfBirth,
          dateOfBirthIsExact: updated.animal.dateOfBirthIsExact,
          heightInCm: updated.animal.heightInCm,
          weightInGram: updated.animal.weightInGram,
          isCastrated: updated.animal.isCastrated,
          lifestyle: updated.animal.lifestyle,
          sex: updated.animal.sex,
          timeOfDeath: updated.animal.timeOfDeath,
          animalGroupId: updated.animal.animalGroupId,
          animalTypeId: updated.animal.animalTypeId,
        }
        : null,
      veterinaryPractice: {
        id: updated.veterinaryPractice.id,
        address: updated.veterinaryPractice.address,
        email: updated.veterinaryPractice.email,
        info: updated.veterinaryPractice.info,
        infoEmail: updated.veterinaryPractice.infoEmail,
        name: updated.veterinaryPractice.name,
        phone: updated.veterinaryPractice.phone,
        website: updated.veterinaryPractice.website,
      },
      veterinary: {
        id: updated.veterinarian.id,
        firstName: updated.veterinarian.person.firstName,
        lastName: updated.veterinarian.person.lastName,
        infoEmail: updated.veterinarian.infoEmail,
        veterinaryPracticeId: updated.veterinaryPractice.id,
      },
      service: updated.service
        ? {
          id: updated.service.id,
          name: updated.service.name,
        }
        : null,
      availableServices: updated.service ? updated.appointmentHasServices.flatMap((x) => x.service) : [],
      notes: updated.notes,
    };
  },

  async canPersonAccessAppointment(personId: number, appointmentId: number): Promise<boolean> {
    const appointment = await prisma.appointment.findUnique({
      where: {
        id: appointmentId,
      },
      select: {
        animalId: true,
      },
    });

    if (!appointment) {
      return false;
    }

    if (!appointment.animalId) {
      return true;
    }

    return animalService.canPersonAccessAnimal(personId, appointment.animalId);
  },

  async canPersonEditAppointment(personId: number, appointmentId: number): Promise<boolean> {
    const appointment = await prisma.appointment.findUnique({
      where: {
        id: appointmentId,
      },
      select: {
        animalId: true,
      },
    });

    if (!appointment) {
      return false;
    }

    if (!appointment.animalId) {
      return false;
    }

    return animalService.canPersonAccessAnimal(personId, appointment.animalId);
  },
};
