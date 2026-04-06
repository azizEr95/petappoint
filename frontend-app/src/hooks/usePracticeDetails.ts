import { useQuery } from '@tanstack/react-query'
import {
  getPractice,
  getPracticeServices,
  getPracticeAvailableAppointments,
} from '@src/api/veterinaryPractice'

export function usePracticeDetails(id: number) {
  const practice = useQuery({
    queryKey: ['practice', id],
    queryFn: () => getPractice(id),
    enabled: !!id,
  })

  const services = useQuery({
    queryKey: ['practice', id, 'services'],
    queryFn: () => getPracticeServices(id),
    enabled: !!id,
  })

  const appointments = useQuery({
    queryKey: ['practice', id, 'appointments', 'available'],
    queryFn: () => getPracticeAvailableAppointments(id),
    enabled: !!id,
  })

  return { practice, services, appointments }
}
