import { AnimalsSchema } from 'petappoint-shared/schemas/ZodSchemas'
import { z } from 'zod'
import { apiRequest } from '@src/api/client'

export type AnimalsType = z.infer<typeof AnimalsSchema>

export async function getPersonAnimals(personId: number): Promise<AnimalsType[]> {
  const raw = await apiRequest<unknown>(`/api/persons/${personId}/animals`)
  return z.array(AnimalsSchema).parse(raw)
}
