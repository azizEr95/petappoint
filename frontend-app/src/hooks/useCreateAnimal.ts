import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createAnimal, AnimalCreatePayload } from '@src/api/animals'
import { useAuthStore } from '@src/stores/authStore'

export function useCreateAnimal() {
  const queryClient = useQueryClient()
  const user = useAuthStore((s) => s.user)

  return useMutation({
    mutationFn: (data: AnimalCreatePayload) => createAnimal(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myAnimals', user?.id] })
    },
  })
}
