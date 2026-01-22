import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { useEffect } from 'react'
import type { VeterinariansType } from 'vetilib-shared/schemas/ZodSchemas'
import { useLoginContext } from '@/LoginContext'
import { getVeterinariansByPracticeId } from '@/api/VeterinarianAPI'
import { isLoggedInAndVerified } from '@/utils/Authentication'
import { VeterinarianList } from '@/components/veterinarian/VeterinarianList'
import { useTitle } from '@/utils/useTitle'

export type VeterinarianSearch = {
  veterinarianName: string
  sortBy: string
  specialization: string
}

export const Route = createFileRoute('/veterinarians/')({
  validateSearch: (search: VeterinarianSearch): VeterinarianSearch => {
    return search
  },
  component: VeterinarianComponent,
})

function VeterinarianComponent() {
  useTitle('Tierärzte')
  const { login } = useLoginContext()
  const navigate = useNavigate()
  const { veterinarianName, sortBy, specialization } = Route.useSearch()

  const practiceID = login ? login.id : -1

  const { isSuccess: isSuccessVeterinarians, data: dataVeterinarians } =
    useQuery<Array<VeterinariansType>>({
      queryKey: ['veterinarians', practiceID],
      queryFn: () => getVeterinariansByPracticeId(practiceID.toString()),
      retry: false,
    })

  useEffect(() => {
    if (!isLoggedInAndVerified(login)) {
      navigate({
        to: '/login',
        search: {
          redirect: '/veterinarians',
        },
      })
    } else if (
      isLoggedInAndVerified(login) &&
      login &&
      login.role === 'person'
    ) {
      navigate({ to: '/' })
    }
  }, [login])

  if (!isSuccessVeterinarians) {
    return
  }

  return (
    <VeterinarianList
      veterinarians={dataVeterinarians}
      searchName={veterinarianName || ''}
      sortBy={sortBy || 'name-asc'}
      specialization={specialization || ''}
    />
  )
}
