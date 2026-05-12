// src/helper/appointmentIncludes.ts

export const APPOINTMENT_INCLUDE_BASE = {
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
          lastName: true,
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
} as const;

// Für Funktionen, die veterinaryHasServices benötigen (getById, getAvailableAppointmentsForPractice, getBookedAppointmentsForPractice)
export const APPOINTMENT_INCLUDE_WITH_VET_SERVICES = {
  ...APPOINTMENT_INCLUDE_BASE,
  veterinarian: {
    include: {
      person: {
        select: {
          firstName: true,
          lastName: true,
        },
      },
      veterinaryHasServices: {
        include: {
          service: true,
        },
      },
      veterinaryCanTreatAnimalTypes: true, // nur für Available & Booked
    },
  },
} as const;
