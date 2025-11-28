import { AnimalsSchema } from '../../../shared/schemas/ZodSchemas'
import type { AnimalsType, AnimalsCreateType } from '../../../shared/schemas/ZodSchemas'

export const getAnimalsFromUser = async (
  userId: number,
): Promise<Array<AnimalsType>> => {
  const res = await fetch(
    import.meta.env.VITE_API_URL + '/persons/' + userId + '/animals',
  )
  if (!res.ok) {
    throw new Error('Failed to fetch getAnimalsFromUser')
  }

  const data = await res.json();
  return parseAnimalArray(data);
}

export const getPictureURLForAnimalId = (animalId: number): string => {
  return import.meta.env.VITE_API_URL + '/animals/' + animalId + '/picture';
}

export const uploadPictureForAnimalId = async (animalId: number, file: File): Promise<void> => {
  const formData = new FormData();
  formData.append('picture', file);
  const targetURL = import.meta.env.VITE_API_URL + '/animals/' + animalId + '/picture';
  const response = await fetch(targetURL,
    {
      method: 'post',
      body: formData
    }
  )

  if (response.ok) {
    throw Error("Could not upload image");
  }
}

export const createAnimal = async (animal: AnimalsCreateType): Promise<AnimalsType> => {

  const requestOptions = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(animal),
  }

  const res = await fetch(
    import.meta.env.VITE_API_URL + '/animals', requestOptions
  )
  if (!res.ok) {
    throw new Error('Failed to fetch createAnimal')
  }

  const data = await res.json();
  return parseAnimal(data);
}

export const editAnimal = async (animalID: number, animal: AnimalsCreateType): Promise<AnimalsType> => {

  const requestOptions = {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(animal),
  }

  const res = await fetch(
    import.meta.env.VITE_API_URL + '/animals/' + animalID, requestOptions
  )
  if (!res.ok) {
    throw new Error('Failed to fetch editAnimal')
  }

  const data = await res.json();
  return parseAnimal(data);
}

export const deleteAnimal = async (animalID: number): Promise<void> => {
  const requestOptions = {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    }
  }

  const res = await fetch(
    import.meta.env.VITE_API_URL + '/animals/' + animalID, requestOptions
  )
  if (!res.ok) {
    throw new Error('Failed to fetch deleteAnimal')
  }
  return;
}

/*
 * safeParse animals
 */
const parseAnimal = (unsafeAnimal: AnimalsType): AnimalsType => {
  if (unsafeAnimal.dateofbirth !== null) {
    unsafeAnimal.dateofbirth = new Date(unsafeAnimal.dateofbirth) // change Date to Date Object
  }
  if (unsafeAnimal.timeofdeath !== null) {
    unsafeAnimal.timeofdeath = new Date(unsafeAnimal.timeofdeath) // change Date to Date Object
  }
  console.log(unsafeAnimal)
  const parsed = AnimalsSchema.safeParse(unsafeAnimal);
  if (parsed.error !== undefined) { //if Zod throws an Error print them
    console.log(parsed.error);
  }
  if (!parsed.success) {
    throw new Error(parsed.error.toString());
  }
  return parsed.data;
}

/*
* safeParse an array of animals
*/
const parseAnimalArray = (unsafeAnimal: AnimalsType[]): AnimalsType[] => {
  return unsafeAnimal.map((unsafeData) => {
    if (unsafeData.dateofbirth !== null) {
      unsafeData.dateofbirth = new Date(unsafeData.dateofbirth) // change Date to Date Object
    }
    if (unsafeData.timeofdeath !== null) {
      unsafeData.timeofdeath = new Date(unsafeData.timeofdeath) // change Date to Date Object
    }

    const parsed = AnimalsSchema.safeParse(unsafeData)
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

