import { useQuery } from '@tanstack/react-query'
import { getFavoriteIds } from '@src/api/favorites'
import { useAuthStore } from '@src/stores/authStore'

export function useFavorites() {
  const user = useAuthStore((s) => s.user)

  const query = useQuery({
    queryKey: ['favorites', user?.id],
    queryFn: () => getFavoriteIds(user!.id),
    enabled: !!user?.id,
  })

  return {
    ...query,
    favoriteIds: new Set(query.data ?? []),
  }
}
