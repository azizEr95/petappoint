import {
  VeterinaryPracticeSchema,
  VeterinaryPracticeSearchResultSchema,
  ServiceSchema,
  AppointmentsSchema,
} from 'petappoint-shared/schemas/ZodSchemas'
import { z } from 'zod'
import { apiRequest } from '@src/api/client'

export type VeterinaryPracticesType = z.infer<typeof VeterinaryPracticeSchema>
export type VeterinaryPracticeSearchResultType = z.infer<typeof VeterinaryPracticeSearchResultSchema>

export interface PracticeSearchParams {
  animalTypeId?: string
  serviceId?: string
  name?: string
  address?: string
}

export async function searchPractices(
  params: PracticeSearchParams,
): Promise<VeterinaryPracticeSearchResultType> {
  const query = new URLSearchParams()
  if (params.name) query.set('name', params.name)
  if (params.address) query.set('address', params.address)
  if (params.animalTypeId) query.set('animalTypeIds', params.animalTypeId)
  if (params.serviceId) query.set('serviceTypeIds', params.serviceId)

  const raw = await apiRequest<unknown>(`/api/veterinary-practice/search?${query.toString()}`)
  return VeterinaryPracticeSearchResultSchema.parse(raw)
}

export async function getAllPractices(): Promise<VeterinaryPracticesType[]> {
  const raw = await apiRequest<unknown>('/api/veterinary-practice/all')
  return z.array(VeterinaryPracticeSchema).parse(raw)
}

export async function getPractice(id: number): Promise<VeterinaryPracticesType> {
  const raw = await apiRequest<unknown>(`/api/veterinary-practice/${id}`)
  return VeterinaryPracticeSchema.parse(raw)
}

export async function getPracticeServices(id: number): Promise<z.infer<typeof ServiceSchema>[]> {
  const raw = await apiRequest<unknown>(`/api/veterinary-practice/${id}/services`)
  return z.array(ServiceSchema).parse(raw)
}

export async function getPracticeAvailableAppointments(
  id: number,
): Promise<z.infer<typeof AppointmentsSchema>[]> {
  const raw = await apiRequest<unknown>(`/api/veterinary-practice/${id}/appointments/available`)
  return z.array(AppointmentsSchema).parse(raw)
}
