import { AnimalsSchema, PersonsSchema } from 'petappoint-shared/schemas/ZodSchemas'
import { z } from 'zod'
import { apiRequest } from '@src/api/client'

export type AnimalsType = z.infer<typeof AnimalsSchema>
export type PersonsType = z.infer<typeof PersonsSchema>

export type PersonUpdatePayload = {
  id: number
  firstName: string
  lastName: string
  phone: string
  email: string
  address: PersonsType['address']
  sex: PersonsType['sex']
  dateOfBirth: Date
}

export async function getPerson(personId: number): Promise<PersonsType> {
  const raw = await apiRequest<unknown>(`/api/persons/${personId}`)
  return PersonsSchema.parse(raw)
}

export async function updatePerson(personId: number, data: PersonUpdatePayload): Promise<PersonsType> {
  const raw = await apiRequest<unknown>(`/api/persons/${personId}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  })
  return PersonsSchema.parse(raw)
}

export async function getPersonAnimals(personId: number): Promise<AnimalsType[]> {
  const raw = await apiRequest<unknown>(`/api/persons/${personId}/animals`)
  return z.array(AnimalsSchema).parse(raw)
}
