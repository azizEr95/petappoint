import { useMutation, useQueryClient } from '@tanstack/react-query'
import { cancelAppointment } from '@src/api/appointments'
import { useAuthStore } from '@src/stores/authStore'

export function useCancelAppointment() {
  const queryClient = useQueryClient()
  const user = useAuthStore((s) => s.user)

  return useMutation({
    mutationFn: (appointmentId: number) => cancelAppointment(appointmentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointments', 'future', user?.id] })
    },
  })
}
