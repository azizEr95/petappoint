import { useMutation, useQueryClient } from '@tanstack/react-query'
import { updateAnimal, AnimalUpdatePayload } from '@src/api/animals'
import { useAuthStore } from '@src/stores/authStore'

export function useUpdateAnimal() {
  const queryClient = useQueryClient()
  const user = useAuthStore((s) => s.user)

  return useMutation({
    mutationFn: (data: AnimalUpdatePayload) => updateAnimal(data.id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myAnimals', user?.id] })
    },
  })
}
