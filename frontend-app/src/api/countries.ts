import { CountrySchema } from 'petappoint-shared/schemas/ZodSchemas'
import { z } from 'zod'
import { apiRequest } from '@src/api/client'

export type CountryType = z.infer<typeof CountrySchema>

export async function getCountries(): Promise<CountryType[]> {
  const raw = await apiRequest<unknown>('/api/countries/all')
  return z.array(CountrySchema).parse(raw)
}
