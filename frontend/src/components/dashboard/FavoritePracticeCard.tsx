import { Link } from '@tanstack/react-router'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { getVeterinaryPracticesById } from '../../api/VeterinaryPracticeAPI'
import type { VeterinaryPracticesType } from '../../../../shared/schemas/ZodSchemas'
import type { FavoritePracticeCardProps } from '../../types/dashboard'
import '../../styles/components/dashboard/FavoritePracticeCard.scss'

export function FavoritePracticeCard({
  practiceId,
  onRemove,
}: FavoritePracticeCardProps) {
  const queryClient = useQueryClient()

  const {
    data: practice,
    isLoading,
    isError,
  } = useQuery<VeterinaryPracticesType>({
    queryKey: ['veterinaryPractice', practiceId],
    queryFn: () => getVeterinaryPracticesById(practiceId.toString()),
  })

  const handleRemove = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    e.stopPropagation()
    onRemove(practiceId)
  }

  if (isLoading) {
    return (
      <div className="favorite-practice-card loading">
        <div className="practice-loading">Lädt...</div>
      </div>
    )
  }

  if (isError || !practice) {
    return null
  }

  return (
    <Link
      to="/practices/$practiceId"
      params={{ practiceId: practiceId.toString() }}
      className="favorite-practice-card"
    >
      <div className="practice-header">
        <div className="practice-logo">
          <i className="bi bi-hospital"></i>
        </div>
        <button
          className="remove-favorite-btn"
          onClick={handleRemove}
          title="Aus Favoriten entfernen"
        >
          <i className="bi bi-heart-fill"></i>
        </button>
      </div>

      <div className="practice-body">
        <h4 className="practice-name">{practice.name}</h4>

        {practice.address && (
          <div className="practice-address">
            <i className="bi bi-geo-alt"></i>
            <span>
              {practice.address.street}, {practice.address.cityCode}{' '}
              {practice.address.city}
            </span>
          </div>
        )}

        {practice.phone && (
          <div className="practice-contact">
            <i className="bi bi-telephone"></i>
            <span>{practice.phone}</span>
          </div>
        )}

        <div className="practice-actions">
          <span className="view-details-text">
            Praxis ansehen <i className="bi bi-arrow-right"></i>
          </span>
        </div>
      </div>
    </Link>
  )
}
