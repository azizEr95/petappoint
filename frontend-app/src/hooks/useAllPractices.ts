import { useQuery } from '@tanstack/react-query'
import { getAllPractices } from '@src/api/veterinaryPractice'

export function useAllPractices() {
  return useQuery({
    queryKey: ['practices'],
    queryFn: getAllPractices,
  })
}
