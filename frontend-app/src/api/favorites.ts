import { apiRequest } from '@src/api/client'

export async function getFavoriteIds(personId: number): Promise<number[]> {
  const data = await apiRequest<unknown[]>(`/api/persons/${personId}/favorites`)
  return (data ?? []).map(Number)
}

export async function addFavorite(personId: number, practiceId: number): Promise<void> {
  await apiRequest<unknown>(`/api/persons/${personId}/favorites/${practiceId}`, { method: 'POST' })
}

export async function removeFavorite(personId: number, practiceId: number): Promise<void> {
  await apiRequest<unknown>(`/api/persons/${personId}/favorites/${practiceId}`, { method: 'DELETE' })
}
