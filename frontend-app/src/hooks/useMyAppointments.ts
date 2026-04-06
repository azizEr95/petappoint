import { useQuery } from '@tanstack/react-query'
import { getFutureAppointments, getPastAppointments } from '@src/api/appointments'
import { useAuthStore } from '@src/stores/authStore'

export function useMyAppointments() {
  const user = useAuthStore((s) => s.user)

  const future = useQuery({
    queryKey: ['appointments', 'future', user?.id],
    queryFn: () => getFutureAppointments(user!.id),
    enabled: !!user?.id,
  })

  const past = useQuery({
    queryKey: ['appointments', 'past', user?.id],
    queryFn: () => getPastAppointments(user!.id),
    enabled: !!user?.id,
  })

  return {
    future: future.data ?? [],
    past: past.data ?? [],
    isLoading: future.isLoading || past.isLoading,
    isError: future.isError || past.isError,
  }
}
