import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useEffect } from 'react'
import { useTitle } from '@/utils/useTitle'
import { isLoggedInAndVerified } from '@/utils/Authentication'
import { useLoginContext } from '@/LoginContext'
import { VeterinarianEditForm } from '@/components/veterinarian/VeterinarianEditForm'

export const Route = createFileRoute('/veterinarians/$veterinarianId/edit')({
  component: VeterinarianEditComponent,
})

function VeterinarianEditComponent() {
  const { veterinarianId } = Route.useParams()
  const navigate = useNavigate()
  const { login } = useLoginContext()
  useTitle('Tierarzt bearbeiten')

  useEffect(() => {
    if (!isLoggedInAndVerified(login) || (login && login.role === 'person')) {
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
      <VeterinarianEditForm veterinarianId={parseInt(veterinarianId)} />
    </div>
  )
}
