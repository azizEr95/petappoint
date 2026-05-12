import { useMutation, useQueryClient } from '@tanstack/react-query'
import { updatePerson, PersonUpdatePayload } from '@src/api/person'
import { useAuthStore } from '@src/stores/authStore'

export function useUpdatePerson() {
  const queryClient = useQueryClient()
  const user = useAuthStore((s) => s.user)

  return useMutation({
    mutationFn: (data: PersonUpdatePayload) => updatePerson(user!.id, { ...data, id: user!.id }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['person', user?.id] })
    },
  })
}
