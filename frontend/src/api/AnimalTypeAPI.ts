import {
  AnimalTypeSchema,
  VeterinariansWithAnimalTypesSchema
  
} from 'vetilib-shared/schemas/ZodSchemas'
import type {AnimalTypeType, VeterinariansWithAnimalTypesType} from 'vetilib-shared/schemas/ZodSchemas';

export const getAllAnimalTypes = async (
  practiceId: string | undefined,
): Promise<Array<AnimalTypeType>> => {
  if (practiceId !== undefined) {
    return getAnimaltypesFromPractice(practiceId)
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

export const getAnimaltypeById = async (
  animaltypeId: string,
): Promise<AnimalTypeType> => {
  const res = await fetch(import.meta.env.VITE_API_URL + '/animaltypes/' + animaltypeId, {
    credentials: 'include',
  })
  if (!res.ok) {
    throw new Error('Failed to fetch getAnimaltypeById')
  }

  const data = await res.json()
  return parseAnimalType(data)
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

export const getAnimaltypesFromAllVeterinarysFromPractice = async (
  id: string,
): Promise<Array<VeterinariansWithAnimalTypesType>> => {
  const res = await fetch(
    import.meta.env.VITE_API_URL +
      '/veterinary-practice/' +
      id +
      '/veterinarians/treatableanimals',
    { credentials: 'include' },
  );

  if (!res.ok) {
    throw new Error('Failed to fetch getAnimaltypesFromVeterinary');
  }

  const data = await res.json();
  return parseVeterinariansWithAnimalTypesTypeArray(data);
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

const parseAnimalType = (unsafeAnimalType: AnimalTypeType): AnimalTypeType => {
  const parsed = AnimalTypeSchema.safeParse(unsafeAnimalType)
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

const parseVeterinariansWithAnimalTypesTypeArray = (
  unsafeAnimalType: Array<VeterinariansWithAnimalTypesType>,
): Array<VeterinariansWithAnimalTypesType> => {
  return unsafeAnimalType
    .map((unsafeType) => {
      const parsed = VeterinariansWithAnimalTypesSchema.safeParse(unsafeType)
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
