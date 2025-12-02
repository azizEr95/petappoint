import {
  AddRacesToAnimalSchema,
  AnimalracesSchema,
} from '../../../shared/schemas/ZodSchemas'
import type {
  AddRacesToAnimalType,
  AnimalracesType,
} from '../../../shared/schemas/ZodSchemas'

export const getRacesByAnimalTypeID = async (
  animalTypeID: number | undefined,
): Promise<Array<AnimalracesType>> => {
  if (animalTypeID === undefined) {
    // should be also !== undefined, because of the enabled condition in useQuery
    throw new Error('Error getRacesByAnimalTypeID: animalTypeID is undefined')
  }
  const res = await fetch(
    import.meta.env.VITE_API_URL + '/animaltypes/races/' + animalTypeID,
    { credentials: 'include' },
  )
  if (!res.ok) {
    throw new Error('Failed to fetch getRacesByAnimalTypeID')
  }
  const data = await res.json()
  return parseAnimalRacesArray(data)
}

export const getRacesByAnimalID = async (
  animalID: number | undefined,
): Promise<Array<AnimalracesType>> => {
  if (animalID === undefined) {
    // should be also !== undefined, because of the enabled condition in useQuery
    throw new Error('Error getRacesByAnimalID: animalID is undefined')
  }
  const res = await fetch(
    import.meta.env.VITE_API_URL + '/animals/' + animalID + '/races',
    { credentials: 'include' },
  )
  if (!res.ok) {
    throw new Error('Failed to fetch getRacesByAnimalID')
  }
  const data = await res.json()
  return parseAnimalRacesArray(data)
}

export const addRacesToAnimal = async (
  race: AddRacesToAnimalType,
): Promise<AddRacesToAnimalType> => {
  if (race.animalraceids.length === 0) {
    return race
  }
  const requestOptions = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(race),
    credentials: 'include' as RequestCredentials,
  }

  const res = await fetch(
    import.meta.env.VITE_API_URL + '/animals/' + race.animalId + '/races',
    requestOptions,
  )
  if (!res.ok) {
    throw new Error('Failed to fetch addRacesToAnimal')
  }
  const data = await res.json()
  return parseAddRacesToAnimalTypeArray(data)
}

export const deleteRaceFromAnimal = async (
  animalID: number,
  racesId: number,
): Promise<void> => {
  const requestOptions = {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include' as RequestCredentials,
  }

  const res = await fetch(
    import.meta.env.VITE_API_URL + '/animals/' + animalID + '/races/' + racesId,
    requestOptions,
  )
  if (!res.ok) {
    throw new Error('Failed to fetch deleteRaceFromAnimal')
  }
  return
}

export const deleteAllRacesFromAnimal = async (
  animalID: number,
): Promise<void> => {
  const requestOptions = {
    method: 'DELETE',
    credentials: 'include' as RequestCredentials,
  }
  console.log('here')
  const res = await fetch(
    import.meta.env.VITE_API_URL + '/animals/' + animalID + '/races',
    requestOptions,
  )
  console.log('heree33')
  if (!res.ok) {
    throw new Error('Failed to fetch deleteAllRacesFromAnimal')
  }
  console.log('res deletealraces ok')
  return
}

/*
 * safeParse an array of animalraces
 */
const parseAnimalRacesArray = (
  unsafeRaces: Array<AnimalracesType>,
): Array<AnimalracesType> => {
  return unsafeRaces
    .map((unsafeRace) => {
      const parsed = AnimalracesSchema.safeParse(unsafeRace)
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

const parseAddRacesToAnimalTypeArray = (
  unsafeRacesToAnimalID: AddRacesToAnimalType,
): AddRacesToAnimalType => {
  const parsed = AddRacesToAnimalSchema.safeParse(unsafeRacesToAnimalID)
  if (!parsed.success) {
    console.log(parsed.error)
    throw new Error(parsed.error.toString())
  }
  return parsed.data
}
