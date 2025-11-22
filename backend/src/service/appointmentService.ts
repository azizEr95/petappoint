import { prisma } from "../singletonPC";
import { appointments } from "../../generated/prisma";
import { AppointmentsCreateType, AppointmentsType, ServiceType } from "vetlib-shared/schemas/ZodSchemas";
import { animalService } from "./animalService";

export const appointmentService = {
  async create(data: AppointmentsCreateType): Promise<AppointmentsType> {
    const created = await prisma.appointments.create({
      include: {
        animals: true,
        services: true,
        veterinaries: true,
        veterinarypractices: {
          include: {
            addresses: true
          },
          omit: {
            password: true
          }
        }
      },
      data: {
        starttime: data.starttime,
        endtime: data.endtime,
        animals: data.animalid ? { connect: { id: data.animalid } } : undefined,
        veterinaries: { connect: { id: data.veterinaryid } },
        veterinarypractices: { connect: { id: data.veterinarypracticeid } },
      },
    });

    return {
      id: created.id,
      starttime: created.starttime,
      endtime: created.endtime,
      animal: created.animals ? {
        id: created.animals.id,
        name: created.animals.name,
        dateofbirth: created.animals.dateofbirth,
        dateofbirthisexact: created.animals.dateofbirthisexact,
        heightincm: created.animals.heightincm,
        weightingram: created.animals.weightingram,
        iscastrated: created.animals.iscastrated,
        lifestyleisindoors: created.animals.lifestyleisindoors,
        sex: created.animals.sex,
        timeofdeath: created.animals.timeofdeath,
        animalgroupid: created.animals.fk_animalgroupid,
        animaltypeid: created.animals.fk_animaltypeid
      } : null,
      veterinarypractice: {
        id: created.veterinarypractices.id,
        addresses: created.veterinarypractices.addresses,
        email: created.veterinarypractices.email,
        info: created.veterinarypractices.info,
        infoemail: created.veterinarypractices.infoemail,
        name: created.veterinarypractices.name,
        phone: created.veterinarypractices.phone,
        website: created.veterinarypractices.website
      },
      veterinary: {
        id: created.veterinaries.id,
        infoemail: created.veterinaries.infoemail,
        veterinarypractice: created.veterinarypractices.id
      },
      service: created.services ? {
        id: created.services.id,
        name: created.services.name
      } : null,
      availableservices: created.services ? [] : [],
      notiz: created.notiz
    }
  },

  async getById(id: number): Promise<AppointmentsType> {
    const foundAppointment = await prisma.appointments.findUnique({
      where: { id },
      include: {
        animals: true,
        services: true,
        veterinaries: true,
        veterinarypractices: {
          include: {
            addresses: true
          },
          omit: {
            password: true
          }
        }
      },
    });

    if (!foundAppointment) {
      throw new Error(`Appointment not found with id: ${id}`);
    }

    return {
      id: foundAppointment.id,
      starttime: foundAppointment.starttime,
      endtime: foundAppointment.endtime,
      animal: foundAppointment.animals ? {
        id: foundAppointment.animals.id,
        name: foundAppointment.animals.name,
        dateofbirth: foundAppointment.animals.dateofbirth,
        dateofbirthisexact: foundAppointment.animals.dateofbirthisexact,
        heightincm: foundAppointment.animals.heightincm,
        weightingram: foundAppointment.animals.weightingram,
        iscastrated: foundAppointment.animals.iscastrated,
        lifestyleisindoors: foundAppointment.animals.lifestyleisindoors,
        sex: foundAppointment.animals.sex,
        timeofdeath: foundAppointment.animals.timeofdeath,
        animalgroupid: foundAppointment.animals.fk_animalgroupid,
        animaltypeid: foundAppointment.animals.fk_animaltypeid
      } : null,
      veterinarypractice: {
        id: foundAppointment.veterinarypractices.id,
        addresses: foundAppointment.veterinarypractices.addresses,
        email: foundAppointment.veterinarypractices.email,
        info: foundAppointment.veterinarypractices.info,
        infoemail: foundAppointment.veterinarypractices.infoemail,
        name: foundAppointment.veterinarypractices.name,
        phone: foundAppointment.veterinarypractices.phone,
        website: foundAppointment.veterinarypractices.website
      },
      veterinary: {
        id: foundAppointment.veterinaries.id,
        infoemail: foundAppointment.veterinaries.infoemail,
        veterinarypractice: foundAppointment.veterinarypractices.id
      },
      service: foundAppointment.services ? {
        id: foundAppointment.services.id,
        name: foundAppointment.services.name
      } : null,
      availableservices: foundAppointment.services ? [] : [],
      notiz: foundAppointment.notiz
    }
  },

  async getAppointmentsByDateRange(startDate: Date, endDate: Date): Promise<AppointmentsType[]> {
    const found = await prisma.appointments.findMany({
      include: {
        animals: true,
        services: true,
        veterinaries: true,
        veterinarypractices: {
          include: {
            addresses: true
          },
          omit: {
            password: true
          }
        }
      },
      where: {
        starttime: {
          gte: startDate,
          lte: endDate,
        },
      },
    });

    return found.map(foundAppointment => ({
      id: foundAppointment.id,
      starttime: foundAppointment.starttime,
      endtime: foundAppointment.endtime,
      animal: foundAppointment.animals ? {
        id: foundAppointment.animals.id,
        name: foundAppointment.animals.name,
        dateofbirth: foundAppointment.animals.dateofbirth,
        dateofbirthisexact: foundAppointment.animals.dateofbirthisexact,
        heightincm: foundAppointment.animals.heightincm,
        weightingram: foundAppointment.animals.weightingram,
        iscastrated: foundAppointment.animals.iscastrated,
        lifestyleisindoors: foundAppointment.animals.lifestyleisindoors,
        sex: foundAppointment.animals.sex,
        timeofdeath: foundAppointment.animals.timeofdeath,
        animalgroupid: foundAppointment.animals.fk_animalgroupid,
        animaltypeid: foundAppointment.animals.fk_animaltypeid
      } : null,
      veterinarypractice: {
        id: foundAppointment.veterinarypractices.id,
        addresses: foundAppointment.veterinarypractices.addresses,
        email: foundAppointment.veterinarypractices.email,
        info: foundAppointment.veterinarypractices.info,
        infoemail: foundAppointment.veterinarypractices.infoemail,
        name: foundAppointment.veterinarypractices.name,
        phone: foundAppointment.veterinarypractices.phone,
        website: foundAppointment.veterinarypractices.website
      },
      veterinary: {
        id: foundAppointment.veterinaries.id,
        infoemail: foundAppointment.veterinaries.infoemail,
        veterinarypractice: foundAppointment.veterinarypractices.id
      },
      service: foundAppointment.services ? {
        id: foundAppointment.services.id,
        name: foundAppointment.services.name
      } : null,
      availableservices: foundAppointment.services ? [] : [],
      notiz: foundAppointment.notiz
    }));
  },

  async getAppointmentsByVeterinary(veterinaryId: number): Promise<AppointmentsType[]> {
    const found = await prisma.appointments.findMany({
      where: { fk_veterinaryid: veterinaryId },
      include: {
        animals: true,
        services: true,
        veterinaries: true,
        veterinarypractices: {
          include: {
            addresses: true
          },
          omit: {
            password: true
          }
        }
      },
    });

    return found.map(foundAppointment => ({
      id: foundAppointment.id,
      starttime: foundAppointment.starttime,
      endtime: foundAppointment.endtime,
      animal: foundAppointment.animals ? {
        id: foundAppointment.animals.id,
        name: foundAppointment.animals.name,
        dateofbirth: foundAppointment.animals.dateofbirth,
        dateofbirthisexact: foundAppointment.animals.dateofbirthisexact,
        heightincm: foundAppointment.animals.heightincm,
        weightingram: foundAppointment.animals.weightingram,
        iscastrated: foundAppointment.animals.iscastrated,
        lifestyleisindoors: foundAppointment.animals.lifestyleisindoors,
        sex: foundAppointment.animals.sex,
        timeofdeath: foundAppointment.animals.timeofdeath,
        animalgroupid: foundAppointment.animals.fk_animalgroupid,
        animaltypeid: foundAppointment.animals.fk_animaltypeid
      } : null,
      veterinarypractice: {
        id: foundAppointment.veterinarypractices.id,
        addresses: foundAppointment.veterinarypractices.addresses,
        email: foundAppointment.veterinarypractices.email,
        info: foundAppointment.veterinarypractices.info,
        infoemail: foundAppointment.veterinarypractices.infoemail,
        name: foundAppointment.veterinarypractices.name,
        phone: foundAppointment.veterinarypractices.phone,
        website: foundAppointment.veterinarypractices.website
      },
      veterinary: {
        id: foundAppointment.veterinaries.id,
        infoemail: foundAppointment.veterinaries.infoemail,
        veterinarypractice: foundAppointment.veterinarypractices.id
      },
      service: foundAppointment.services ? {
        id: foundAppointment.services.id,
        name: foundAppointment.services.name
      } : null,
      availableservices: foundAppointment.services ? [] : [],
      notiz: foundAppointment.notiz
    }));
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

  async getForPractice(veterinaryPracticeId: number): Promise<AppointmentsType[]> {
    const found = await prisma.appointments.findMany({
      include: {
        animals: true,
        services: true,
        veterinaries: true,
        veterinarypractices: {
          include: {
            addresses: true
          },
          omit: {
            password: true
          }
        }
      },
      where: { fk_veterinarypracticeid: veterinaryPracticeId },
    });

    return found.map(foundAppointment => ({
      id: foundAppointment.id,
      starttime: foundAppointment.starttime,
      endtime: foundAppointment.endtime,
      animal: foundAppointment.animals ? {
        id: foundAppointment.animals.id,
        name: foundAppointment.animals.name,
        dateofbirth: foundAppointment.animals.dateofbirth,
        dateofbirthisexact: foundAppointment.animals.dateofbirthisexact,
        heightincm: foundAppointment.animals.heightincm,
        weightingram: foundAppointment.animals.weightingram,
        iscastrated: foundAppointment.animals.iscastrated,
        lifestyleisindoors: foundAppointment.animals.lifestyleisindoors,
        sex: foundAppointment.animals.sex,
        timeofdeath: foundAppointment.animals.timeofdeath,
        animalgroupid: foundAppointment.animals.fk_animalgroupid,
        animaltypeid: foundAppointment.animals.fk_animaltypeid
      } : null,
      veterinarypractice: {
        id: foundAppointment.veterinarypractices.id,
        addresses: foundAppointment.veterinarypractices.addresses,
        email: foundAppointment.veterinarypractices.email,
        info: foundAppointment.veterinarypractices.info,
        infoemail: foundAppointment.veterinarypractices.infoemail,
        name: foundAppointment.veterinarypractices.name,
        phone: foundAppointment.veterinarypractices.phone,
        website: foundAppointment.veterinarypractices.website
      },
      veterinary: {
        id: foundAppointment.veterinaries.id,
        infoemail: foundAppointment.veterinaries.infoemail,
        veterinarypractice: foundAppointment.veterinarypractices.id
      },
      service: foundAppointment.services ? {
        id: foundAppointment.services.id,
        name: foundAppointment.services.name
      } : null,
      availableservices: foundAppointment.services ? [] : [],
      notiz: foundAppointment.notiz
    }));
  },

  async getAvailableAppointmentsForPractice(veterinaryPracticeId: number): Promise<AppointmentsType[]> {
    const found = await prisma.appointments.findMany({
      include: {
        animals: true,
        services: true,
        veterinaries: true,
        veterinarypractices: {
          include: {
            addresses: true
          },
          omit: {
            password: true
          }
        }
      },
      where: { fk_veterinarypracticeid: veterinaryPracticeId, fk_animalid: null },
    });

    return found.map(foundAppointment => ({
      id: foundAppointment.id,
      starttime: foundAppointment.starttime,
      endtime: foundAppointment.endtime,
      animal: foundAppointment.animals ? {
        id: foundAppointment.animals.id,
        name: foundAppointment.animals.name,
        dateofbirth: foundAppointment.animals.dateofbirth,
        dateofbirthisexact: foundAppointment.animals.dateofbirthisexact,
        heightincm: foundAppointment.animals.heightincm,
        weightingram: foundAppointment.animals.weightingram,
        iscastrated: foundAppointment.animals.iscastrated,
        lifestyleisindoors: foundAppointment.animals.lifestyleisindoors,
        sex: foundAppointment.animals.sex,
        timeofdeath: foundAppointment.animals.timeofdeath,
        animalgroupid: foundAppointment.animals.fk_animalgroupid,
        animaltypeid: foundAppointment.animals.fk_animaltypeid
      } : null,
      veterinarypractice: {
        id: foundAppointment.veterinarypractices.id,
        addresses: foundAppointment.veterinarypractices.addresses,
        email: foundAppointment.veterinarypractices.email,
        info: foundAppointment.veterinarypractices.info,
        infoemail: foundAppointment.veterinarypractices.infoemail,
        name: foundAppointment.veterinarypractices.name,
        phone: foundAppointment.veterinarypractices.phone,
        website: foundAppointment.veterinarypractices.website
      },
      veterinary: {
        id: foundAppointment.veterinaries.id,
        infoemail: foundAppointment.veterinaries.infoemail,
        veterinarypractice: foundAppointment.veterinarypractices.id
      },
      service: foundAppointment.services ? {
        id: foundAppointment.services.id,
        name: foundAppointment.services.name
      } : null,
      availableservices: foundAppointment.services ? [] : [],
      notiz: foundAppointment.notiz
    }));
  },

  async getPastAppointmentsForPerson(personId: number): Promise<AppointmentsType[]> {
    const now = new Date();
    const animals = await animalService.getByPersonId(personId);

    if (animals.length == 0) {
      return [];
    }

    const animalIds = animals.map(a => a.id);
    const appointments = await prisma.appointments.findMany({
      include: {
        animals: true,
        veterinaries: true,
        services: true,
        veterinarypractices: {
          include: {
            addresses: true
          },
          omit: {
            password: true
          }
        }
      },
      where: {
        fk_animalid: {
          in: animalIds // in the list
        },
        starttime: {
          lt: now // less than
        }
      },
    });

    return appointments.map(foundAppointment => ({
      id: foundAppointment.id,
      starttime: foundAppointment.starttime,
      endtime: foundAppointment.endtime,
      animal: foundAppointment.animals ? {
        id: foundAppointment.animals.id,
        name: foundAppointment.animals.name,
        dateofbirth: foundAppointment.animals.dateofbirth,
        dateofbirthisexact: foundAppointment.animals.dateofbirthisexact,
        heightincm: foundAppointment.animals.heightincm,
        weightingram: foundAppointment.animals.weightingram,
        iscastrated: foundAppointment.animals.iscastrated,
        lifestyleisindoors: foundAppointment.animals.lifestyleisindoors,
        sex: foundAppointment.animals.sex,
        timeofdeath: foundAppointment.animals.timeofdeath,
        animalgroupid: foundAppointment.animals.fk_animalgroupid,
        animaltypeid: foundAppointment.animals.fk_animaltypeid
      } : null,
      veterinarypractice: {
        id: foundAppointment.veterinarypractices.id,
        addresses: foundAppointment.veterinarypractices.addresses,
        email: foundAppointment.veterinarypractices.email,
        info: foundAppointment.veterinarypractices.info,
        infoemail: foundAppointment.veterinarypractices.infoemail,
        name: foundAppointment.veterinarypractices.name,
        phone: foundAppointment.veterinarypractices.phone,
        website: foundAppointment.veterinarypractices.website
      },
      veterinary: {
        id: foundAppointment.veterinaries.id,
        infoemail: foundAppointment.veterinaries.infoemail,
        veterinarypractice: foundAppointment.veterinarypractices.id
      },
      service: foundAppointment.services ? {
        id: foundAppointment.services.id,
        name: foundAppointment.services.name
      } : null,
      availableservices: foundAppointment.services ? [] : [],
      notiz: foundAppointment.notiz
    }));
  },

  async getFutureAppointmentsForPerson(personId: number): Promise<AppointmentsType[]> {
    const now = new Date();
    const animals = await animalService.getByPersonId(personId);

    if (animals.length == 0) {
      return [];
    }

    const animalIds = animals.map(a => a.id);
    const appointments = await prisma.appointments.findMany({
      include: {
        animals: true,
        services: true,
        veterinaries: true,
        veterinarypractices: {
          include: {
            addresses: true
          },
          omit: {
            password: true
          }
        }
      },
      where: {
        fk_animalid: {
          in: animalIds
        },
        starttime: {
          gt: now // greater than
        }
      },
    });

    return appointments.map(foundAppointment => ({
      id: foundAppointment.id,
      starttime: foundAppointment.starttime,
      endtime: foundAppointment.endtime,
      animal: foundAppointment.animals ? {
        id: foundAppointment.animals.id,
        name: foundAppointment.animals.name,
        dateofbirth: foundAppointment.animals.dateofbirth,
        dateofbirthisexact: foundAppointment.animals.dateofbirthisexact,
        heightincm: foundAppointment.animals.heightincm,
        weightingram: foundAppointment.animals.weightingram,
        iscastrated: foundAppointment.animals.iscastrated,
        lifestyleisindoors: foundAppointment.animals.lifestyleisindoors,
        sex: foundAppointment.animals.sex,
        timeofdeath: foundAppointment.animals.timeofdeath,
        animalgroupid: foundAppointment.animals.fk_animalgroupid,
        animaltypeid: foundAppointment.animals.fk_animaltypeid
      } : null,
      veterinarypractice: {
        id: foundAppointment.veterinarypractices.id,
        addresses: foundAppointment.veterinarypractices.addresses,
        email: foundAppointment.veterinarypractices.email,
        info: foundAppointment.veterinarypractices.info,
        infoemail: foundAppointment.veterinarypractices.infoemail,
        name: foundAppointment.veterinarypractices.name,
        phone: foundAppointment.veterinarypractices.phone,
        website: foundAppointment.veterinarypractices.website
      },
      veterinary: {
        id: foundAppointment.veterinaries.id,
        infoemail: foundAppointment.veterinaries.infoemail,
        veterinarypractice: foundAppointment.veterinarypractices.id
      },
      service: foundAppointment.services ? {
        id: foundAppointment.services.id,
        name: foundAppointment.services.name
      } : null,
      availableservices: foundAppointment.services ? [] : [],
      notiz: foundAppointment.notiz
    }));
  },

  async getAll(): Promise<AppointmentsType[]> {
    const found = await prisma.appointments.findMany({
      include: {
        animals: true,
        services: true,
        veterinaries: true,
        veterinarypractices: {
          include: {
            addresses: true
          },
          omit: {
            password: true
          }
        }
      }
    });

    return found.map(foundAppointment => ({
      id: foundAppointment.id,
      starttime: foundAppointment.starttime,
      endtime: foundAppointment.endtime,
      animal: foundAppointment.animals ? {
        id: foundAppointment.animals.id,
        name: foundAppointment.animals.name,
        dateofbirth: foundAppointment.animals.dateofbirth,
        dateofbirthisexact: foundAppointment.animals.dateofbirthisexact,
        heightincm: foundAppointment.animals.heightincm,
        weightingram: foundAppointment.animals.weightingram,
        iscastrated: foundAppointment.animals.iscastrated,
        lifestyleisindoors: foundAppointment.animals.lifestyleisindoors,
        sex: foundAppointment.animals.sex,
        timeofdeath: foundAppointment.animals.timeofdeath,
        animalgroupid: foundAppointment.animals.fk_animalgroupid,
        animaltypeid: foundAppointment.animals.fk_animaltypeid
      } : null,
      veterinarypractice: {
        id: foundAppointment.veterinarypractices.id,
        addresses: foundAppointment.veterinarypractices.addresses,
        email: foundAppointment.veterinarypractices.email,
        info: foundAppointment.veterinarypractices.info,
        infoemail: foundAppointment.veterinarypractices.infoemail,
        name: foundAppointment.veterinarypractices.name,
        phone: foundAppointment.veterinarypractices.phone,
        website: foundAppointment.veterinarypractices.website
      },
      veterinary: {
        id: foundAppointment.veterinaries.id,
        infoemail: foundAppointment.veterinaries.infoemail,
        veterinarypractice: foundAppointment.veterinarypractices.id
      },
      service: foundAppointment.services ? {
        id: foundAppointment.services.id,
        name: foundAppointment.services.name
      } : null,
      availableservices: foundAppointment.services ? [] : [],
      notiz: foundAppointment.notiz
    }));
  },

  async update(data: appointments): Promise<AppointmentsType> {
    if (!data.id) {
      throw new Error("ID is required for update");
    }

    const updated = await prisma.appointments.update({
      include: {
        animals: true,
        services: true,
        veterinaries: true,
        veterinarypractices: {
          include: {
            addresses: true
          },
          omit: {
            password: true
          }
        }
      },
      where: { id: data.id },
      data: data
    });

    return {
      id: updated.id,
      starttime: updated.starttime,
      endtime: updated.endtime,
      animal: updated.animals ? {
        id: updated.animals.id,
        name: updated.animals.name,
        dateofbirth: updated.animals.dateofbirth,
        dateofbirthisexact: updated.animals.dateofbirthisexact,
        heightincm: updated.animals.heightincm,
        weightingram: updated.animals.weightingram,
        iscastrated: updated.animals.iscastrated,
        lifestyleisindoors: updated.animals.lifestyleisindoors,
        sex: updated.animals.sex,
        timeofdeath: updated.animals.timeofdeath,
        animalgroupid: updated.animals.fk_animalgroupid,
        animaltypeid: updated.animals.fk_animaltypeid
      } : null,
      veterinarypractice: {
        id: updated.veterinarypractices.id,
        addresses: updated.veterinarypractices.addresses,
        email: updated.veterinarypractices.email,
        info: updated.veterinarypractices.info,
        infoemail: updated.veterinarypractices.infoemail,
        name: updated.veterinarypractices.name,
        phone: updated.veterinarypractices.phone,
        website: updated.veterinarypractices.website
      },
      veterinary: {
        id: updated.veterinaries.id,
        infoemail: updated.veterinaries.infoemail,
        veterinarypractice: updated.veterinarypractices.id
      },
      service: updated.services ? {
        id: updated.services.id,
        name: updated.services.name
      } : null,
      availableservices: updated.services ? [] : [],
      notiz: updated.notiz
    };
  },

  async updateAppointmentAsPerson(id: number, fk_animalid: number, fk_serviceid: number): Promise<AppointmentsType> {
    // check if dto is complete
    if (!id || !fk_animalid) throw new Error("ID and AnimalID is required for update");

    // check if appointment is available
    const appointment = await prisma.appointments.findUnique({
      where: {
        id: id
      }
    })

    if (appointment?.fk_animalid) throw new Error("Termin is already taken");

    const updated = await prisma.appointments.update({
      include: {
        animals: true,
        services: true,
        veterinaries: true,
        veterinarypractices: {
          include: {
            addresses: true
          },
          omit: {
            password: true
          }
        }
      },
      where: {
        id: id
      },
      data: {
        fk_animalid: fk_animalid,
        fk_serviceid: fk_serviceid
      }
    })

    return {
      id: updated.id,
      starttime: updated.starttime,
      endtime: updated.endtime,
      animal: updated.animals ? {
        id: updated.animals.id,
        name: updated.animals.name,
        dateofbirth: updated.animals.dateofbirth,
        dateofbirthisexact: updated.animals.dateofbirthisexact,
        heightincm: updated.animals.heightincm,
        weightingram: updated.animals.weightingram,
        iscastrated: updated.animals.iscastrated,
        lifestyleisindoors: updated.animals.lifestyleisindoors,
        sex: updated.animals.sex,
        timeofdeath: updated.animals.timeofdeath,
        animalgroupid: updated.animals.fk_animalgroupid,
        animaltypeid: updated.animals.fk_animaltypeid
      } : null,
      veterinarypractice: {
        id: updated.veterinarypractices.id,
        addresses: updated.veterinarypractices.addresses,
        email: updated.veterinarypractices.email,
        info: updated.veterinarypractices.info,
        infoemail: updated.veterinarypractices.infoemail,
        name: updated.veterinarypractices.name,
        phone: updated.veterinarypractices.phone,
        website: updated.veterinarypractices.website
      },
      veterinary: {
        id: updated.veterinaries.id,
        infoemail: updated.veterinaries.infoemail,
        veterinarypractice: updated.veterinarypractices.id
      },
      service: updated.services ? {
        id: updated.services.id,
        name: updated.services.name
      } : null,
      availableservices: updated.services ? [] : [],
      notiz: updated.notiz
    };
  },

  async delete(id: number): Promise<void> {
    await prisma.appointments.delete({ where: { id } });
  },

  async cancelAppointmentAsPerson(id: number): Promise<AppointmentsType> {
    const updated = await prisma.appointments.update({
      include: {
        animals: true,
        services: true,
        veterinaries: true,
        veterinarypractices: {
          include: {
            addresses: true
          },
          omit: {
            password: true
          }
        }
      },
      where: { id },
      data: {
        fk_animalid: null,
        fk_serviceid: null
      }
    });

    return {
      id: updated.id,
      starttime: updated.starttime,
      endtime: updated.endtime,
      animal: updated.animals ? {
        id: updated.animals.id,
        name: updated.animals.name,
        dateofbirth: updated.animals.dateofbirth,
        dateofbirthisexact: updated.animals.dateofbirthisexact,
        heightincm: updated.animals.heightincm,
        weightingram: updated.animals.weightingram,
        iscastrated: updated.animals.iscastrated,
        lifestyleisindoors: updated.animals.lifestyleisindoors,
        sex: updated.animals.sex,
        timeofdeath: updated.animals.timeofdeath,
        animalgroupid: updated.animals.fk_animalgroupid,
        animaltypeid: updated.animals.fk_animaltypeid
      } : null,
      veterinarypractice: {
        id: updated.veterinarypractices.id,
        addresses: updated.veterinarypractices.addresses,
        email: updated.veterinarypractices.email,
        info: updated.veterinarypractices.info,
        infoemail: updated.veterinarypractices.infoemail,
        name: updated.veterinarypractices.name,
        phone: updated.veterinarypractices.phone,
        website: updated.veterinarypractices.website
      },
      veterinary: {
        id: updated.veterinaries.id,
        infoemail: updated.veterinaries.infoemail,
        veterinarypractice: updated.veterinarypractices.id
      },
      service: updated.services ? {
        id: updated.services.id,
        name: updated.services.name
      } : null,
      availableservices: updated.services ? [] : [],
      notiz: updated.notiz
    };
  },

  async updateNotiz(id: number, notiz: string | null): Promise<AppointmentsType> {
    const updated = await prisma.appointments.update({
      include: {
        animals: true,
        services: true,
        veterinaries: true,
        veterinarypractices: {
          include: {
            addresses: true
          },
          omit: {
            password: true
          }
        }
      },
      where: { id },
      data: { notiz }
    });

    return {
      id: updated.id,
      starttime: updated.starttime,
      endtime: updated.endtime,
      animal: updated.animals ? {
        id: updated.animals.id,
        name: updated.animals.name,
        dateofbirth: updated.animals.dateofbirth,
        dateofbirthisexact: updated.animals.dateofbirthisexact,
        heightincm: updated.animals.heightincm,
        weightingram: updated.animals.weightingram,
        iscastrated: updated.animals.iscastrated,
        lifestyleisindoors: updated.animals.lifestyleisindoors,
        sex: updated.animals.sex,
        timeofdeath: updated.animals.timeofdeath,
        animalgroupid: updated.animals.fk_animalgroupid,
        animaltypeid: updated.animals.fk_animaltypeid
      } : null,
      veterinarypractice: {
        id: updated.veterinarypractices.id,
        addresses: updated.veterinarypractices.addresses,
        email: updated.veterinarypractices.email,
        info: updated.veterinarypractices.info,
        infoemail: updated.veterinarypractices.infoemail,
        name: updated.veterinarypractices.name,
        phone: updated.veterinarypractices.phone,
        website: updated.veterinarypractices.website
      },
      veterinary: {
        id: updated.veterinaries.id,
        infoemail: updated.veterinaries.infoemail,
        veterinarypractice: updated.veterinarypractices.id
      },
      service: updated.services ? {
        id: updated.services.id,
        name: updated.services.name
      } : null,
      availableservices: updated.services ? [] : [],
      notiz: updated.notiz
    };
  },
};
