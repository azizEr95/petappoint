import { useQuery } from '@tanstack/react-query'
import { getSessionApi } from '@src/api/auth'
import { useAuthStore } from '@src/stores/authStore'

export function useSession() {
  const token = useAuthStore((s) => s.token)

  return useQuery({
    queryKey: ['session'],
    queryFn: getSessionApi,
    enabled: !!token,
    retry: false,
    staleTime: 1000 * 60 * 5,
  })
}
