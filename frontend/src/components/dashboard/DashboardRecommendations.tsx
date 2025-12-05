import { Link } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { getAnimalsFromUser } from '../../api/AnimalsAPI'
import {
  getFavoritesVeterinaryPractices,
  getVeterinaryPracticesByNameAddress,
} from '../../api/VeterinaryPracticeAPI'
import type {
  AnimalsType,
  VeterinaryPracticeSearchResultType,
} from '../../../../shared/schemas/ZodSchemas'
import '../../styles/components/dashboard/DashboardRecommendations.scss'

type DashboardRecommendationsProps = {
  userId: number
}

export function DashboardRecommendations({
  userId,
}: DashboardRecommendationsProps) {
  // Fetch user's animals to get their types
  const { data: animals = [] } = useQuery<Array<AnimalsType>>({
    queryKey: ['animals', userId],
    queryFn: () => getAnimalsFromUser(userId),
  })

  // Fetch favorite IDs to filter them out
  const { data: favoriteIds = [] } = useQuery<Array<number>>({
    queryKey: ['favoritesVeterinaryPractices', userId],
    queryFn: () => getFavoritesVeterinaryPractices(userId.toString()),
  })

  // Get animal type IDs
  const animalTypeIds = [...new Set(animals.map((a) => a.animalTypeId))].filter(
    (id) => id !== null && id !== undefined,
  ) as Array<number>

  // Fetch practices that treat these animal types
  const { data: recommendations, isLoading } =
    useQuery<VeterinaryPracticeSearchResultType>({
      queryKey: ['recommendedPractices', animalTypeIds],
      queryFn: () =>
        getVeterinaryPracticesByNameAddress({
          name: '',
          address: '',
          animalTypeIds,
          serviceTypeIds: [],
          page: 1,
          pageSize: 6,
        }),
      enabled: animalTypeIds.length > 0,
    })

  // Filter out favorites and take top 3
  const recommendedPractices =
    recommendations?.data
      ?.filter((p) => !favoriteIds.includes(p.id))
      ?.slice(0, 3) || []

  if (isLoading) {
    return <div className="recommendations-loading">Lade Empfehlungen...</div>
  }

  if (animals.length === 0) {
    return (
      <div className="recommendations-empty">
        <p>Fügen Sie Tiere hinzu, um Praxis-Empfehlungen zu erhalten.</p>
      </div>
    )
  }

  if (recommendedPractices.length === 0) {
    return (
      <div className="recommendations-empty">
        <p>Keine Empfehlungen verfügbar.</p>
        <Link
          to="/search"
          search={{ name: '', address: '', animalType: '', serviceType: '' }}
          className="btn btn-secondary btn-sm"
        >
          <i className="bi bi-search"></i> Praxen suchen
        </Link>
      </div>
    )
  }

  return (
    <div className="dashboard-recommendations">
      <div className="recommendations-grid">
        {recommendedPractices.map((practice) => (
          <Link
            key={practice.id}
            to="/practices/$practiceId"
            params={{ practiceId: practice.id.toString() }}
            className="recommendation-card"
          >
            <div className="recommendation-header">
              <div className="recommendation-icon">
                <i className="bi bi-hospital"></i>
              </div>
              <div className="recommendation-badge">
                <i className="bi bi-star-fill"></i> Empfohlen
              </div>
            </div>

            <div className="recommendation-body">
              <h4 className="recommendation-name">{practice.name}</h4>

              {practice.address && (
                <div className="recommendation-address">
                  <i className="bi bi-geo-alt"></i>
                  <span>{practice.address.city}</span>
                </div>
              )}

              <div className="recommendation-action">
                <span>
                  Praxis ansehen <i className="bi bi-arrow-right"></i>
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
