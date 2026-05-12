import { useQuery } from '@tanstack/react-query'
import { getAnimalTypes } from '@src/api/animalTypes'

export function useAnimalTypes() {
  return useQuery({
    queryKey: ['animalTypes'],
    queryFn: getAnimalTypes,
    staleTime: Infinity,
  })
}
