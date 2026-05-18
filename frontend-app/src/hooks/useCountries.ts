import { useQuery } from '@tanstack/react-query'
import { getCountries } from '@src/api/countries'

export function useCountries() {
  return useQuery({
    queryKey: ['countries'],
    queryFn: getCountries,
    staleTime: Infinity,
  })
}
