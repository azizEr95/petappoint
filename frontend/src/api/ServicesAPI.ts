import { ServiceSchemaArray } from "vetilib-shared/schemas/ZodSchemas";
import type {ServiceType} from "vetilib-shared/schemas/ZodSchemas";


export const getServicesFromPractice = async (
  practiceId: string,
): Promise<Array<ServiceType>> => {
  const res = await fetch(
    import.meta.env.VITE_API_URL +
      '/veterinary-practice/' +
      practiceId +
      '/services',
    { credentials: 'include' },
  )
  if (!res.ok) {
    throw new Error('Failed to fetch getServicesFromPractice')
  }

  const data = await res.json()
  return parseServiceArray(data)
}

export const getServicesFromVeterinary = async (
  id: string,
): Promise<Array<ServiceType>> => {
  const res = await fetch(
    import.meta.env.VITE_API_URL +
      '/services/veterinary/' +
      id,
    { credentials: 'include' },
  )
  if (!res.ok) {
    throw new Error('Failed to fetch getServicesFromVeterinary')
  }

  const data = await res.json()
  return parseServiceArray(data)
}

export const getAllAvailableServices = async (
  id: string | undefined,
): Promise<Array<ServiceType>> => {
  if (id !== undefined) {
    return getServicesFromPractice(id)
  }
  const res = await fetch(
    import.meta.env.VITE_API_URL + '/services/all/available/',
    { credentials: 'include' },
  )
  if (!res.ok) {
    throw new Error('Failed to fetch getAllServices')
  }

  const data = await res.json()
  return parseServiceArray(data)
}

function parseServiceArray(serviceArray: any): Array<ServiceType> {
    const parsed = ServiceSchemaArray.safeParse(serviceArray);
    if (parsed.error !== undefined) { // if Zod throws an Error print them
        console.log(parsed.error);
    }
    if (!parsed.success) {
        throw new Error(parsed.error.toString())
    }

    return parsed.data
}
