import { useQuery } from '@tanstack/react-query'
import { getServices } from '@src/api/services'

export function useServices() {
  return useQuery({
    queryKey: ['services'],
    queryFn: getServices,
    staleTime: Infinity,
  })
}
