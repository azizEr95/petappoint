import { AppointmentsSchema } from '../../../shared/schemas/ZodSchemas'
import type { AppointmentsType } from '../../../shared/schemas/ZodSchemas'

// get one appointment by id
export const getAppointmentsById = async (
    id: string,
): Promise<AppointmentsType> => {
  const res = await fetch(import.meta.env.VITE_API_URL + '/appointments/' + id)
  if (!res.ok) {
    throw new Error('Failed to fetch getAppointmentsById')
  }

    const data = await res.json();
    return parseAppointment(data);
}

// get all available appointents from one practice
export const getAvailableAppointmentsByPracticeId = async (
    practiceId: string,
): Promise<Array<AppointmentsType>> => {
  const url =
    import.meta.env.VITE_API_URL +
    '/veterinary-practice/' +
    practiceId +
    '/appointments/available'
  const res = await fetch(url)
  if (!res.ok) {
    throw new Error('Failed to fetch getAvailableAppointmentsByPracticeId')
  }

    const data = await res.json() as AppointmentsType[];
    return parseAppointmentArray(data);
}

//set animalID and serviceID from an existing appointment
export const bookAppointment = async (appointmentID: number, animalID: number | undefined, serviceID: number | null): Promise<AppointmentsType> => {
    if (animalID === null || animalID === undefined) {
        throw new Error('Failed to fetch bookAppointment: animalID null/undefined');
    }

  const requestBody = {
    id: appointmentID,
    fk_animalid: animalID,
    fk_serviceid: serviceID,
  }

  const requestOptions = {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(requestBody),
  }
  const url = import.meta.env.VITE_API_URL + '/appointments/' + appointmentID
  const res = await fetch(url, requestOptions)
  if (!res.ok) {
    throw new Error('Failed to fetch bookAppointment')
  }

    const data = await res.json();
    return parseAppointment(data);
}

// get all appointments in the future from one user
export const getFutureAppointmentsByUserId = async (userID: string) => {
    const url = import.meta.env.VITE_API_URL + '/appointments/future/' + userID;
    const res = await fetch(url);
    if (!res.ok) {
        throw new Error('Failed to fetch getFutureAppointmentsByUserId');
    }

    const data = await res.json() as AppointmentsType[];
    return parseAppointmentArray(data);
}

// get all appointments in the past from one user
export const getPastAppointmentsByUserId = async (userID: string) => {
    const url = import.meta.env.VITE_API_URL + '/appointments/past/' + userID;
    const res = await fetch(url);
    if (!res.ok) {
        throw new Error('Failed to fetch getPastAppointmentsByUserId');
    }

    const data = await res.json() as AppointmentsType[];
    return parseAppointmentArray(data);
}

/*
 * change the date from Appointments to Date Object and safeParse the whole array
 */
const parseAppointmentArray = (unsafeAppointments: AppointmentsType[]): AppointmentsType[] => {
    return unsafeAppointments.map(x => {
        const unsafeData = {
            id: x.id,
            starttime: new Date(x.starttime),
            endtime: new Date(x.endtime),
            fk_animalid: x.fk_animalid,
            fk_veterinaryid: x.fk_veterinaryid,
            fk_veterinarypracticeid: x.fk_veterinarypracticeid,
            fk_serviceid: x.fk_serviceid,
            animals: x.animals ? {
                ...x.animals,
                dateofbirth: x.animals.dateofbirth ? new Date(x.animals.dateofbirth) : x.animals.dateofbirth
            } : x.animals,
            veterinaries: x.veterinaries,
            veterinarypractices: x.veterinarypractices,
            services: x.services
            /**
             * animals: AnimalsSchema.nullable(),
                 veterinaries: VeterinariansSchema,
                 veterinarypractices: VeterinaryPracticeSchema,
                 services: ServiceSchema.nullable()
             */
        }
        const parsed = AppointmentsSchema.safeParse(unsafeData);
        if (parsed.error !== undefined) { // if Zod throws an Error print them
            console.log(parsed.error);
        }
        if (parsed.success) {
            return parsed.data;
        }
        return null;
    }).filter(x => x !== null);
}

// cancel/delete an appointment
export const cancelAppointment = async (id: number): Promise<void> => {
    const url = import.meta.env.VITE_API_URL + '/appointments/' + id;
    const res = await fetch(url, {
        method: 'DELETE',
    });
    if (!res.ok) {
        throw new Error('Failed to cancel appointment');
    }
}

// update appointment notiz
export const updateAppointmentNotiz = async (id: number, notiz: string | null): Promise<AppointmentsType> => {
    const url = import.meta.env.VITE_API_URL + '/appointments/' + id + '/notiz';
    const res = await fetch(url, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ notiz }),
    });
    if (!res.ok) {
        throw new Error('Failed to update appointment notiz');
    }
    const data = await res.json();
    return parseAppointment(data);
}

/*
 * change the date from the Appointment to Date Object and safeParse the object
 */
const parseAppointment = (unsafeAppointment: AppointmentsType): AppointmentsType => {
    unsafeAppointment.starttime = new Date(unsafeAppointment.starttime);
    unsafeAppointment.endtime = new Date(unsafeAppointment.endtime);
    if (unsafeAppointment.animals?.dateofbirth) {
        unsafeAppointment.animals.dateofbirth = new Date(unsafeAppointment.animals.dateofbirth);
    }
    const parsed = AppointmentsSchema.safeParse(unsafeAppointment);
    if (parsed.error !== undefined) { //if Zod throws an Error print them
        console.log(parsed.error);
    }
    if (!parsed.success) {
        throw new Error(parsed.error.toString());
    }
    return parsed.data;
}
