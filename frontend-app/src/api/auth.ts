import {
  MobileLoginSchema,
  MobileLoginType,
  PersonsCreateType,
  loginValidator,
} from 'petappoint-shared/schemas/ZodSchemas'
import { apiRequest } from '@src/api/client'

export async function loginApi(credentials: {
  email: string
  password: string
}): Promise<MobileLoginType> {
  loginValidator.parse(credentials)
  const raw = await apiRequest<unknown>('/api/login', {
    method: 'POST',
    body: JSON.stringify(credentials),
  })
  return MobileLoginSchema.parse(raw)
}

export async function registerApi(data: PersonsCreateType): Promise<MobileLoginType> {
  const raw = await apiRequest<unknown>('/api/persons', {
    method: 'POST',
    body: JSON.stringify(data),
  })
  return MobileLoginSchema.parse(raw)
}

export async function logoutApi(): Promise<void> {
  await apiRequest<void>('/api/login', { method: 'DELETE' })
}

export async function getSessionApi(): Promise<MobileLoginType> {
  const raw = await apiRequest<unknown>('/api/login', { method: 'GET' })
  return MobileLoginSchema.parse(raw)
}
