import { AppointmentsSchema } from '../../../shared/schemas/ZodSchemas'
import type { AppointmentsType } from '../../../shared/schemas/ZodSchemas'

export const getAppointmentsById = async (
    id: string,
): Promise<AppointmentsType> => {
    const res = await fetch(import.meta.env.VITE_API_URL + '/appointments/' + id);
    if (!res.ok) {
        throw new Error('Failed to fetch getAppointmentsById');
    }

    const data = await res.json();
    data.starttime = new Date(data.starttime);
    data.endtime = new Date(data.endtime);
    const parsed = AppointmentsSchema.safeParse(data);
    if (parsed.error !== undefined) { //if Zod throws an Error print them
        console.log(parsed.error);
    }
    if (!parsed.success) {
        throw new Error(parsed.error.toString());
    }

    return parsed.data;
}

export const getAvailableAppointmentsByPracticeId = async (
    practiceId: string,
): Promise<Array<AppointmentsType>> => {
    const url = import.meta.env.VITE_API_URL + '/veterinary-practice/' + practiceId + '/appointments/available'
    const res = await fetch(url);
    if (!res.ok) {
        throw new Error('Failed to fetch getAvailableAppointmentsByPracticeId');
    }

    const data = await res.json() as AppointmentsType[];
    console.log(data)
    return data.map(x => {
        const unsafeData = {
            id: x.id,
            starttime: new Date(x.starttime),
            endtime: new Date(x.endtime),
            fk_animalid: x.fk_animalid,
            fk_veterinaryid: x.fk_veterinaryid,
            fk_veterinarypracticeid: x.fk_veterinarypracticeid,
            fk_serviceid: x.fk_animalid
        }
        const parsed = AppointmentsSchema.safeParse(unsafeData);
        if (parsed.error !== undefined) { //if Zod throws an Error print them
            console.log(parsed.error);
        }
        if (parsed.success) {
            return parsed.data;
        }
        return null;
    }).filter(x => x !== null);
}

//set animalID from an existing appointment
export const bookAppointment = async (appointmentID: number, animalID: number | undefined, serviceID: number | null): Promise<AppointmentsType> => {
    if (animalID === null || animalID === undefined) {
        throw new Error('Failed to fetch bookAppointment: animalID null/undefined');
    }

    const requestBody = {
        id: appointmentID,
        fk_animalid: animalID,
        fk_serviceid: serviceID
    };

    const requestOptions = {
        method: "PUT",
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
    }
    const url = import.meta.env.VITE_API_URL + '/appointments/' + appointmentID;
    const res = await fetch(url, requestOptions);
    if (!res.ok) {
        throw new Error('Failed to fetch bookAppointment');
    }

    const data = await res.json();
    data.starttime = new Date(data.starttime);
    data.endtime = new Date(data.endtime);
    const parsed = AppointmentsSchema.safeParse(data);
    if (parsed.error !== undefined) { //if Zod throws an Error print them
        console.log(parsed.error);
    }
    if (!parsed.success) {
        throw new Error(parsed.error.toString());
    }
    console.log(parsed.data);
    return parsed.data;
}
