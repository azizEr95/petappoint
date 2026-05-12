import { useQuery } from '@tanstack/react-query'
import { getPerson } from '@src/api/person'
import { useAuthStore } from '@src/stores/authStore'

export function usePerson() {
  const user = useAuthStore((s) => s.user)

  return useQuery({
    queryKey: ['person', user?.id],
    queryFn: () => getPerson(user!.id),
    enabled: !!user?.id,
    staleTime: 1000 * 60 * 5,
  })
}
