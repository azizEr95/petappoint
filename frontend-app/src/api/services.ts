import { ServiceSchema } from 'petappoint-shared/schemas/ZodSchemas'
import { z } from 'zod'
import { apiRequest } from '@src/api/client'

export type ServiceType = z.infer<typeof ServiceSchema>

export async function getServices(): Promise<ServiceType[]> {
  const raw = await apiRequest<unknown>('/api/services/all')
  return z.array(ServiceSchema).parse(raw)
}
