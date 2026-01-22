import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useEffect } from 'react'
import { useTitle } from '@/utils/useTitle'
import { VeterinarianDetails } from '@/components/veterinarian/VeterinarianDetails'
import { isLoggedInAndVerified } from '@/utils/Authentication'
import { useLoginContext } from '@/LoginContext'

export const Route = createFileRoute('/veterinarians/$veterinarianId')({
  component: VeterinarianIdComponent,
})

function VeterinarianIdComponent() {
  const { veterinarianId } = Route.useParams()
  const navigate = useNavigate()
  const { login } = useLoginContext()
  useTitle('Tierarzt')

  useEffect(() => {
    if (!isLoggedInAndVerified(login)) {
      navigate({
        to: '/veterinarians',
        search: {
          veterinarianName: '',
          sortBy: 'name-asc',
          specialization: '',
        },
      })
    }
  }, [login, navigate])

  return (
    <div className="container py-4">
      <VeterinarianDetails veterinarianId={parseInt(veterinarianId)} />
    </div>
  )
}
