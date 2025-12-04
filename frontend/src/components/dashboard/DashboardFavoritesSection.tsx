import { Link } from '@tanstack/react-router'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  deleteFavoritesVeterinaryPractices,
  getFavoritesVeterinaryPractices,
} from '../../api/VeterinaryPracticeAPI'
import { FavoritePracticeCard } from './FavoritePracticeCard'
import '../../styles/components/dashboard/DashboardFavoritesSection.scss'

type DashboardFavoritesSectionProps = {
  userId: number
}

export function DashboardFavoritesSection({
  userId,
}: DashboardFavoritesSectionProps) {
  const queryClient = useQueryClient()

  const { data: favoriteIds = [], isLoading } = useQuery<Array<number>>({
    queryKey: ['favoritesVeterinaryPractices', userId],
    queryFn: () => getFavoritesVeterinaryPractices(userId.toString()),
  })

  const { mutate: removeFavorite } = useMutation({
    mutationFn: (practiceId: number) =>
      deleteFavoritesVeterinaryPractices(
        userId.toString(),
        practiceId.toString(),
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['favoritesVeterinaryPractices'],
      })
    },
  })

  const handleRemoveFavorite = (practiceId: number) => {
    removeFavorite(practiceId)
  }

  if (isLoading) {
    return <div className="favorites-loading">Lade Favoriten...</div>
  }

  if (favoriteIds.length === 0) {
    return (
      <div className="favorites-empty">
        <div className="empty-icon">
          <i className="bi bi-star"></i>
        </div>
        <h3>Keine Favoriten</h3>
        <p>
          Markieren Sie Praxen als Favoriten, um sie hier schnell
          wiederzufinden.
        </p>
        <Link
          to="/search"
          search={{ name: '', address: '', animalType: '', serviceType: '' }}
          className="btn btn-primary"
        >
          <i className="bi bi-search"></i> Praxen suchen
        </Link>
      </div>
    )
  }

  return (
    <div className="dashboard-favorites-section">
      <div className="favorites-grid">
        {favoriteIds.map((practiceId) => (
          <FavoritePracticeCard
            key={practiceId}
            practiceId={practiceId}
            onRemove={handleRemoveFavorite}
          />
        ))}
      </div>
    </div>
  )
}
