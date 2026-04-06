import { useQueries } from '@tanstack/react-query'
import { getAnimalAppointments } from '@src/api/animals'
import { useMyAnimals } from '@src/hooks/useMyAnimals'

export function useMyAppointments() {
  const { data: animals } = useMyAnimals()

  return useQueries({
    queries: (animals ?? []).map((animal) => ({
      queryKey: ['animalAppointments', animal.id],
      queryFn: () => getAnimalAppointments(animal.id),
    })),
    combine: (results) => ({
      data: results.flatMap((r) => r.data ?? []),
      isLoading: results.some((r) => r.isLoading),
      isError: results.some((r) => r.isError),
    }),
  })
}
