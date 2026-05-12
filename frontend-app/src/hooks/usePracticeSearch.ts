import { useQuery } from '@tanstack/react-query'
import { searchPractices, type PracticeSearchParams } from '@src/api/veterinaryPractice'

export function usePracticeSearch(params: PracticeSearchParams) {
  return useQuery({
    queryKey: ['practiceSearch', params],
    queryFn: () => searchPractices(params),
  })
}
