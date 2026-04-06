import { AnimalTypeSchema } from 'petappoint-shared/schemas/ZodSchemas'
import { z } from 'zod'
import { apiRequest } from '@src/api/client'

export type AnimalTypeType = z.infer<typeof AnimalTypeSchema>

export async function getAnimalTypes(): Promise<AnimalTypeType[]> {
  const raw = await apiRequest<unknown>('/api/animaltypes/all')
  return z.array(AnimalTypeSchema).parse(raw)
}
