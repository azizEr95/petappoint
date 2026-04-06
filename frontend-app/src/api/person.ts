import { AnimalsSchema, PersonsSchema } from 'petappoint-shared/schemas/ZodSchemas'
import { z } from 'zod'
import { apiRequest } from '@src/api/client'

export type AnimalsType = z.infer<typeof AnimalsSchema>
export type PersonsType = z.infer<typeof PersonsSchema>

export async function getPerson(personId: number): Promise<PersonsType> {
  const raw = await apiRequest<unknown>(`/api/persons/${personId}`)
  return PersonsSchema.parse(raw)
}

export async function getPersonAnimals(personId: number): Promise<AnimalsType[]> {
  const raw = await apiRequest<unknown>(`/api/persons/${personId}/animals`)
  return z.array(AnimalsSchema).parse(raw)
}
