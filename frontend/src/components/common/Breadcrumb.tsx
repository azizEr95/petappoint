import { Link, useLocation } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { getVeterinaryPracticesById } from '../../api/VeterinaryPracticeAPI'
import '../../styles/components/common/Breadcrumb.scss'

interface BreadcrumbItem {
  label: string
  path: string
}

type BreadcrumbConfig = (params: {
  practiceId?: string
  practiceName?: string
  practiceUrl?: string
}) => Array<BreadcrumbItem>

// Define breadcrumbs for each route pattern
const breadcrumbConfigs: Array<{ pattern: RegExp; config: BreadcrumbConfig }> = [
  // Practice detail: Start > Suche > [Praxisname]
  {
    pattern: /^\/practices\/(\d+)\/?$/,
    config: ({ practiceName, practiceUrl }) => [
      { label: 'Start', path: '/' },
      { label: 'Suche', path: '/search' },
      { label: practiceName || 'Praxis', path: practiceUrl || '#' },
    ],
  },
  // Booking: Start > Suche > [Praxisname] > Termin buchen
  {
    pattern: /^\/practices\/(\d+)\/booking\/\d+\/?$/,
    config: ({ practiceName, practiceUrl }) => [
      { label: 'Start', path: '/' },
      { label: 'Suche', path: '/search' },
      { label: practiceName || 'Praxis', path: practiceUrl || '#' },
      { label: 'Termin buchen', path: '#' },
    ],
  },
  // Confirmation: Start > Suche > [Praxisname] > Bestätigung
  {
    pattern: /^\/booking\/confirmation\/?$/,
    config: ({ practiceName, practiceUrl }) => [
      { label: 'Start', path: '/' },
      { label: 'Suche', path: '/search' },
      { label: practiceName || 'Praxis', path: practiceUrl || '/search' },
      { label: 'Bestätigung', path: '#' },
    ],
  },
  // Favorites: Start > Meine Favoriten
  {
    pattern: /^\/practices\/favorites\/?$/,
    config: () => [
      { label: 'Start', path: '/' },
      { label: 'Meine Favoriten', path: '#' },
    ],
  },
  // Reschedule: Start > Termine > Termin verschieben
  {
    pattern: /^\/appointments_\.(\d+)\.reschedule\/?$/,
    config: () => [
      { label: 'Start', path: '/' },
      { label: 'Termine', path: '/appointments' },
      { label: 'Termin verschieben', path: '#' },
    ],
  },
  // Registration person: Start > Registrierung
  {
    pattern: /^\/registration\/person\/?$/,
    config: () => [
      { label: 'Start', path: '/' },
      { label: 'Registrierung', path: '#' },
    ],
  },
  // Registration veterinary: Start > Registrierung
  {
    pattern: /^\/registration\/veterinary\/?$/,
    config: () => [
      { label: 'Start', path: '/' },
      { label: 'Registrierung', path: '#' },
    ],
  },
  // Verify email: Start > Registrierung > E-Mail verifizieren
  {
    pattern: /^\/registration\/verify-email\/?$/,
    config: () => [
      { label: 'Start', path: '/' },
      { label: 'Registrierung', path: '/registration/person' },
      { label: 'E-Mail verifizieren', path: '#' },
    ],
  },
  // Email confirmation: Start > Registrierung > E-Mail bestätigen
  {
    pattern: /^\/registration\/email-confirmation\/.+\/?$/,
    config: () => [
      { label: 'Start', path: '/' },
      { label: 'Registrierung', path: '/registration/person' },
      { label: 'E-Mail bestätigen', path: '#' },
    ],
  },
]

export default function Breadcrumb() {
  const location = useLocation()
  const currentPath = location.pathname

  // Extract practiceId from URL if present
  const practiceIdMatch = currentPath.match(/\/practices\/(\d+)/)
  const practiceId = practiceIdMatch ? practiceIdMatch[1] : null

  // Get practice from state (passed during navigation) or from confirmation state
  const practiceFromState = location.state.practice

  // Fetch practice via API if not in state but practiceId exists
  const { data: practiceFromApi } = useQuery({
    queryKey: ['veterinaryPractices', practiceId],
    queryFn: () => getVeterinaryPracticesById(practiceId!),
    enabled: !!practiceId && !practiceFromState,
  })

  const practice = practiceFromState || practiceFromApi
  const practiceName = practice?.name
  const practiceUrl = practiceId ? `/practices/${practiceId}` : undefined

  // Find matching breadcrumb config
  const matchingConfig = breadcrumbConfigs.find(({ pattern }) =>
    pattern.test(currentPath),
  )

  // No config = no breadcrumb (top-level pages)
  if (!matchingConfig) {
    return null
  }

  const breadcrumbs = matchingConfig.config({
    practiceId: practiceId || undefined,
    practiceName,
    practiceUrl,
  })

  return (
    <nav className="breadcrumb-nav" aria-label="Breadcrumb">
      <div className="container">
        <ol className="breadcrumb">
          {breadcrumbs.map((crumb, index) => {
            const isLast = index === breadcrumbs.length - 1
            const isClickable = crumb.path !== '#'

            return (
              <li
                key={`${crumb.path}-${index}`}
                className={`breadcrumb-item ${isLast ? 'active' : ''}`}
              >
                {isLast || !isClickable ? (
                  <span className="breadcrumb-current">{crumb.label}</span>
                ) : (
                  <Link to={crumb.path} className="breadcrumb-link">
                    {crumb.label}
                  </Link>
                )}
              </li>
            )
          })}
        </ol>
      </div>
    </nav>
  )
}
