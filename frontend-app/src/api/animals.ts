import { AnimalsSchema, AppointmentsSchema } from 'petappoint-shared/schemas/ZodSchemas'
import { z } from 'zod'
import { apiRequest } from '@src/api/client'

export type AnimalCreatePayload = Omit<AnimalUpdatePayload, 'id'>

export type AppointmentsType = z.infer<typeof AppointmentsSchema>
export type AnimalsType = z.infer<typeof AnimalsSchema>

export type AnimalUpdatePayload = {
  id: number
  name: string
  sex: AnimalsType['sex']
  dateOfBirth: Date | null
  dateOfBirthIsExact: boolean | null
  weightInGram: number | null
  heightInCm: number | null
  isCastrated: boolean
  lifestyle: AnimalsType['lifestyle']
  animalTypeId: number
  timeOfDeath: Date | null
}

export async function getAnimalAppointments(animalId: number): Promise<AppointmentsType[]> {
  const raw = await apiRequest<unknown>(`/api/animals/${animalId}/appointments`)
  return z.array(AppointmentsSchema).parse(raw)
}

export async function createAnimal(data: AnimalCreatePayload): Promise<AnimalsType> {
  const raw = await apiRequest<unknown>('/api/animals', {
    method: 'POST',
    body: JSON.stringify(data),
  })
  return AnimalsSchema.parse(raw)
}

export async function updateAnimal(animalId: number, data: AnimalUpdatePayload): Promise<AnimalsType> {
  const raw = await apiRequest<unknown>(`/api/animals/${animalId}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  })
  return AnimalsSchema.parse(raw)
}
