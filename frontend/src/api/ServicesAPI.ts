import z from "zod";
import { ServiceSchema, type ServiceType } from "../../../shared/schemas/ZodSchemas";


export const getServicesFromPractice = async (practiceId: string): Promise<Array<ServiceType>> => {
    const res = await fetch(
        import.meta.env.VITE_API_URL +
        '/veterinary-practice/' + practiceId + '/services'
    )
    if (!res.ok) {
        throw new Error('Failed to fetch getServicesFromPractice')
    }

    const data = await res.json();
    return parseServiceArray(data);
}

export const getAllAvailableServices = async (): Promise<Array<ServiceType>> => {
    const res = await fetch(
        import.meta.env.VITE_API_URL +
        '/services/all/available/'
    )
    if (!res.ok) {
        throw new Error('Failed to fetch getAllServices')
    }

    const data = await res.json();
    return parseServiceArray(data)
}

function parseServiceArray(serviceArray: ServiceType[]) {
    const parsed = z.array(ServiceSchema).safeParse(serviceArray);
    if (parsed.error !== undefined) { // if Zod throws an Error print them
        console.log(parsed.error);
    }
    if (!parsed.success) {
        throw new Error(parsed.error.toString())
    }
    return parsed.data
}
