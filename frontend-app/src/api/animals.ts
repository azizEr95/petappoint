import { AppointmentsSchema } from 'petappoint-shared/schemas/ZodSchemas'
import { z } from 'zod'
import { apiRequest } from '@src/api/client'

export type AppointmentsType = z.infer<typeof AppointmentsSchema>

export async function getAnimalAppointments(animalId: number): Promise<AppointmentsType[]> {
  const raw = await apiRequest<unknown>(`/api/animals/${animalId}/appointments`)
  return z.array(AppointmentsSchema).parse(raw)
}
