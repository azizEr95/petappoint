import { useMutation, useQueryClient } from '@tanstack/react-query'
import { bookAppointment } from '@src/api/appointments'
import { useAuthStore } from '@src/stores/authStore'

export function useBookAppointment() {
  const queryClient = useQueryClient()
  const user = useAuthStore((s) => s.user)

  return useMutation({
    mutationFn: ({
      appointmentId,
      animalId,
      serviceId,
    }: {
      appointmentId: number
      animalId: number
      serviceId: number
      practiceId: number
    }) => bookAppointment(appointmentId, animalId, serviceId),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['appointments', 'future', user?.id] })
      queryClient.invalidateQueries({ queryKey: ['appointments', 'past', user?.id] })
      queryClient.invalidateQueries({ queryKey: ['practice', variables.practiceId, 'appointments', 'available'] })
    },
  })
}
