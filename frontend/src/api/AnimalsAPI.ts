import { AnimalsSchema } from '../../../shared/schemas/ZodSchemas'
import type { AnimalsCreateType, AnimalsType } from '../../../shared/schemas/ZodSchemas'

export const getAnimalsFromUser = async (
  userId: number,
): Promise<Array<AnimalsType>> => {
  const res = await fetch(
    import.meta.env.VITE_API_URL + '/persons/' + userId + '/animals', {credentials: 'include'}
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
      method: 'POST',
      body: formData,
      credentials: 'include'
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
    credentials: 'include'  as RequestCredentials
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
    credentials: 'include'  as RequestCredentials
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
    },
    credentials: 'include'  as RequestCredentials
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
  const parsed = AnimalsSchema.safeParse(unsafeAnimal);
  if (parsed.error !== undefined) { // if Zod throws an Error print them
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
const parseAnimalArray = (unsafeAnimal: Array<AnimalsType>): Array<AnimalsType> => {
  return unsafeAnimal.map((unsafeData) => {
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

