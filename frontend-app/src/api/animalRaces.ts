import { AnimalracesSchema } from 'petappoint-shared/schemas/ZodSchemas'
import { z } from 'zod'
import { apiRequest } from '@src/api/client'

export type AnimalracesType = z.infer<typeof AnimalracesSchema>

export async function getAnimalRacesByType(animalTypeId: number): Promise<AnimalracesType[]> {
  const raw = await apiRequest<unknown>(`/api/animaltypes/races/${animalTypeId}`)
  return z.array(AnimalracesSchema).parse(raw)
}

export async function getAnimalRaces(animalId: number): Promise<AnimalracesType[]> {
  const raw = await apiRequest<unknown>(`/api/animals/${animalId}/races`)
  return z.array(AnimalracesSchema).parse(raw)
}

export async function addRacesToAnimal(animalId: number, raceIds: number[]): Promise<void> {
  await apiRequest<unknown>(`/api/animals/${animalId}/races`, {
    method: 'POST',
    body: JSON.stringify({ animalId, animalraceids: raceIds }),
  })
}

export async function deleteAllRacesFromAnimal(animalId: number): Promise<void> {
  await apiRequest<unknown>(`/api/animals/${animalId}/races`, {
    method: 'DELETE',
  })
}
