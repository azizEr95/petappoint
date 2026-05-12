import { useQuery } from '@tanstack/react-query'
import { getPersonAnimals } from '@src/api/person'
import { useAuthStore } from '@src/stores/authStore'

export function useMyAnimals() {
  const user = useAuthStore((s) => s.user)

  return useQuery({
    queryKey: ['myAnimals', user?.id],
    queryFn: () => getPersonAnimals(user!.id),
    enabled: !!user?.id,
  })
}
