import { AppointmentsSchema } from 'vetilib-shared/schemas/ZodSchemas';
import type {
  AppointmentFilterType,
  AppointmentsCreateType,
  AppointmentsType,
} from 'vetilib-shared/schemas/ZodSchemas';

// get one appointment by id
export const getAppointmentsById = async (
  id: string,
): Promise<AppointmentsType> => {
  const res = await fetch(
    import.meta.env.VITE_API_URL + '/appointments/' + id,
    { credentials: 'include' },
  )
  if (!res.ok) {
    throw new Error('Failed to fetch getAppointmentsById')
  }

  const data = await res.json()
  return parseAppointment(data)
}

// get all available appointents from one practice
export const getAvailableAppointmentsByPracticeId = async (
  practiceId: string,
  filterOptions: AppointmentFilterType,
): Promise<Array<AppointmentsType>> => {
  const url =
    import.meta.env.VITE_API_URL +
    '/veterinary-practice/' +
    practiceId +
    '/appointments/available?'
  let query = ''
  if (filterOptions.animalTypeIds) {
    query += `${query.length > 0 ? '&' : ''}animalTypeIds=${filterOptions.animalTypeIds.join(',')}`
  }
  if (filterOptions.serviceTypeIds) {
    query += `${query.length > 0 ? '&' : ''}serviceTypeIds=${filterOptions.serviceTypeIds.join(',')}`
  }
  const res = await fetch(url + query, { credentials: 'include' })
  if (!res.ok) {
    throw new Error('Failed to fetch getAvailableAppointmentsByPracticeId')
  }

  const data = await res.json()
  return parseAppointmentArray(data)
}

export const addAvailableAppointments = async (appointment: AppointmentsCreateType): Promise<void> => {
  const url = import.meta.env.VITE_API_URL + '/appointments';
  const requestOptions = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(appointment),
    credentials: 'include' as RequestCredentials,
  }
  const res = await fetch(url, requestOptions);

  if (!res.ok) {
    throw new Error('Failed to fetch addAvailableAppointments');
  }
  return;
}

// Set animalID and serviceID from an existing appointment
export const bookAppointment = async (
  appointmentID: number,
  animalID: number | undefined,
  serviceID: number | null,
): Promise<AppointmentsType> => {
  if (animalID === undefined) {
    throw new Error('Failed to fetch bookAppointment: animalID null/undefined');
  }

  const requestBody = {
    id: appointmentID,
    animalId: animalID,
    serviceId: serviceID,
  }

  const requestOptions = {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(requestBody),
    credentials: 'include' as RequestCredentials,
  }
  const url = import.meta.env.VITE_API_URL + '/appointments/' + appointmentID;
  const res = await fetch(url, requestOptions);
  if (!res.ok) {
    throw new Error('Failed to fetch bookAppointment');
  }

  const data = await res.json();
  return parseAppointment(data);
}

export const getBookedAppointmentsByPractice = async (practiceID: string): Promise<Array<AppointmentsType>> => {
  const url = import.meta.env.VITE_API_URL + '/veterinary-practice/' + practiceID + '/appointments/booked';
  const res = await fetch(url, { credentials: 'include' });
  if (!res.ok) {
    throw new Error('Failed to fetch getBookedAppointmentsByPractice');
  }

  const data = await res.json();
  return parseAppointmentArray(data);
}

// get all appointments in the future from one user
export const getFutureAppointmentsByUserId = async (userID: string) => {
  const url = import.meta.env.VITE_API_URL + '/appointments/future/' + userID;
  const res = await fetch(url, { credentials: 'include' });
  if (!res.ok) {
    throw new Error('Failed to fetch getFutureAppointmentsByUserId');
  }

  const data = await res.json();
  return parseAppointmentArray(data);
}

// get all appointments in the past from one user
export const getPastAppointmentsByUserId = async (userID: string) => {
  const url = import.meta.env.VITE_API_URL + '/appointments/past/' + userID
  const res = await fetch(url, { credentials: 'include' })
  if (!res.ok) {
    throw new Error('Failed to fetch getPastAppointmentsByUserId')
  }

  const data = await res.json()
  return parseAppointmentArray(data)
}

// cancel/delete an appointment
export const cancelAppointment = async (id: number): Promise<void> => {
  const url = import.meta.env.VITE_API_URL + '/appointments/' + id
  const res = await fetch(url, {
    method: 'DELETE',
    credentials: 'include',
  })
  if (!res.ok) {
    throw new Error('Failed to cancel appointment')
  }
}

// update appointment notes
export const updateAppointmentNotes = async (
  id: number,
  notes: string | null,
): Promise<AppointmentsType> => {
  const url = import.meta.env.VITE_API_URL + '/appointments/' + id + '/notes'
  const res = await fetch(url, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ notes }),
    credentials: 'include',
  })
  if (!res.ok) {
    throw new Error('Failed to update appointment notes')
  }
  const data = await res.json()
  return parseAppointment(data)
}

/*
 * change the date from the Appointment to Date Object and safeParse the object
 */
const parseAppointment = (
  unsafeAppointment: AppointmentsType,
): AppointmentsType => {
  const parsed = AppointmentsSchema.safeParse(unsafeAppointment)
  if (parsed.error !== undefined) {
    // if Zod throws an Error print them
    console.log(parsed.error)
  }
  if (!parsed.success) {
    throw new Error(parsed.error.toString())
  }
  return parsed.data
}

/*
 * change the date from Appointments to Date Object and safeParse the whole array
 */
const parseAppointmentArray = (
  unsafeAppointments: Array<AppointmentsType>,
): Array<AppointmentsType> => {
  return unsafeAppointments
    .map((x) => {
      const parsed = AppointmentsSchema.safeParse(x)
      if (parsed.success) {
        return parsed.data
      }
      return null
    })
    .filter((x) => x !== null)
}
