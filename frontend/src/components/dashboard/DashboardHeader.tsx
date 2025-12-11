import type { PersonsType } from '../../../shared/schemas/ZodSchemas'
import '../../styles/components/dashboard/DashboardHeader.scss'

type DashboardHeaderProps = {
  user: PersonsType
  avatarUrl: string
  onEditProfile: () => void
}

export function DashboardHeader({
  user,
  avatarUrl,
  onEditProfile,
}: DashboardHeaderProps) {
  return (
    <div className="dashboard-header">
      <div className="header-greeting">
        <h1 className="greeting-title">Hallo {user.firstName}!</h1>
      </div>

      <div className="header-profile">
        <div className="profile-image-wrapper">
          <img
            src={avatarUrl}
            alt={`${user.firstName} ${user.lastName}`}
            className="profile-image"
          />
          <button
            className="profile-edit-btn"
            onClick={onEditProfile}
            title="Profil bearbeiten"
          >
            <i className="bi bi-pencil"></i>
          </button>
        </div>
      </div>
    </div>
  )
}
