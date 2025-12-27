import {
  AnimalTypeSchema
  
} from 'vetilib-shared/schemas/ZodSchemas'
import type {AnimalTypeType} from 'vetilib-shared/schemas/ZodSchemas';

export const getAllAnimalTypes = async (
  id: string | undefined,
): Promise<Array<AnimalTypeType>> => {
  if (id !== undefined) {
    return getAnimaltypesFromPractice(id)
  }

  const res = await fetch(import.meta.env.VITE_API_URL + '/animaltypes/all', {
    credentials: 'include',
  })
  if (!res.ok) {
    throw new Error('Failed to fetch getAllAnimalTypes')
  }

  const data = await res.json()
  return parseAnimalTypeArray(data)
}

export const getAnimaltypesFromPractice = async (
  practiceId: string,
): Promise<Array<AnimalTypeType>> => {
  const res = await fetch(
    import.meta.env.VITE_API_URL +
      '/veterinary-practice/' +
      practiceId +
      '/animaltypes',
    { credentials: 'include' },
  )

  if (!res.ok) {
    throw new Error('Failed to fetch getAnimaltypesFromPractice')
  }

  const data = await res.json()
  return parseAnimalTypeArray(data)
}

export const getAnimaltypesFromVeterinary = async (
  id: string,
): Promise<Array<AnimalTypeType>> => {
  const res = await fetch(
    import.meta.env.VITE_API_URL +
      '/veterinarians/' +
      id +
      '/animaltypes',
    { credentials: 'include' },
  )

  if (!res.ok) {
    throw new Error('Failed to fetch getAnimaltypesFromVeterinary')
  }

  const data = await res.json()
  return parseAnimalTypeArray(data)
}

/*
 * safeParse an array of animaltypes
 */
const parseAnimalTypeArray = (
  unsafeAnimalType: Array<AnimalTypeType>,
): Array<AnimalTypeType> => {
  return unsafeAnimalType
    .map((unsafeType) => {
      const parsed = AnimalTypeSchema.safeParse(unsafeType)
      if (parsed.error !== undefined) {
        // if Zod throws an Error print them
        console.log(parsed.error)
      }
      if (parsed.success) {
        return parsed.data
      }
      return null
    })
    .filter((x) => x !== null)
}
