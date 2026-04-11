import { AppointmentsSchema } from 'petappoint-shared/schemas/ZodSchemas'
import { z } from 'zod'
import { apiRequest } from '@src/api/client'

export type AppointmentsType = z.infer<typeof AppointmentsSchema>

export async function getAppointment(id: number): Promise<AppointmentsType> {
  const raw = await apiRequest<unknown>(`/api/appointments/${id}`)
  return AppointmentsSchema.parse(raw)
}

export async function getFutureAppointments(personId: number): Promise<AppointmentsType[]> {
  const raw = await apiRequest<unknown>(`/api/appointments/future/${personId}`)
  return z.array(AppointmentsSchema).parse(raw)
}

export async function getPastAppointments(personId: number): Promise<AppointmentsType[]> {
  const raw = await apiRequest<unknown>(`/api/appointments/past/${personId}`)
  return z.array(AppointmentsSchema).parse(raw)
}

export async function cancelAppointment(appointmentId: number): Promise<void> {
  await apiRequest<unknown>(`/api/appointments/${appointmentId}`, { method: 'DELETE' })
}

export async function bookAppointment(
  appointmentId: number,
  animalId: number,
  serviceId: number,
): Promise<AppointmentsType> {
  const raw = await apiRequest<unknown>(`/api/appointments/${appointmentId}`, {
    method: 'PUT',
    body: JSON.stringify({ id: appointmentId, animalId, serviceId }),
  })
  return AppointmentsSchema.parse(raw)
}
