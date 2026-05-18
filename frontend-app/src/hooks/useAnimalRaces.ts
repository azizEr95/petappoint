import { useQuery } from '@tanstack/react-query'
import { getAnimalRacesByType } from '@src/api/animalRaces'

export function useAnimalRaces(animalTypeId: number | null) {
  return useQuery({
    queryKey: ['animalRaces', animalTypeId],
    queryFn: () => getAnimalRacesByType(animalTypeId!),
    enabled: animalTypeId !== null,
    staleTime: Infinity,
  })
}
