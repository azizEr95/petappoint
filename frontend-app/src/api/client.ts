import { useAuthStore } from '@src/stores/authStore'

const BASE_URL = process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:3000'

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

export async function apiRequest<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = useAuthStore.getState().token

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers ?? {}),
  }

  const res = await fetch(`${BASE_URL}${path}`, { ...options, headers })

  if (res.status === 401) {
    await useAuthStore.getState().clearAuth()
    throw new ApiError(401, 'Unauthorized')
  }

  if (!res.ok) {
    const body = await res.text()
    throw new ApiError(res.status, body)
  }

  if (res.status === 204) return undefined as T

  const contentType = res.headers.get('content-type')
  if (!contentType?.includes('application/json')) return undefined as T

  return res.json() as Promise<T>
}
