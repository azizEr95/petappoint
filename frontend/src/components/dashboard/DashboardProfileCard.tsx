import type { DashboardProfileCardProps } from '../../types/dashboard'
import '../../styles/components/dashboard/DashboardProfileCard.scss'

export function DashboardProfileCard({ user, avatarUrl, onEdit }: DashboardProfileCardProps) {
  // Generate initials from first and last name
  const getInitials = () => {
    const firstInitial = user.firstname?.charAt(0)?.toUpperCase() || ''
    const lastInitial = user.lastname?.charAt(0)?.toUpperCase() || ''
    return `${firstInitial}${lastInitial}`
  }

  return (
    <div className="profile-card">
      <div className="profile-avatar-section">
        {avatarUrl ? (
          <img src={avatarUrl} alt={`${user.firstname} ${user.lastname}`} className="profile-avatar" />
        ) : (
          <div className="profile-avatar profile-avatar-initials">
            {getInitials()}
          </div>
        )}
      </div>

      <div className="profile-info">
        <h3 className="profile-name">
          {user.firstname} {user.lastname}
        </h3>

        <div className="profile-details">
          <div className="profile-detail-item">
            <i className="bi bi-envelope"></i>
            <span>{user.email}</span>
          </div>

          {user.phone && (
            <div className="profile-detail-item">
              <i className="bi bi-telephone"></i>
              <span>{user.phone}</span>
            </div>
          )}

          {user.addresses && (
            <div className="profile-detail-item">
              <i className="bi bi-geo-alt"></i>
              <span>
                {user.addresses.street}, {user.addresses.citycode} {user.addresses.city}
              </span>
            </div>
          )}

          {user.dateofbirth && (
            <div className="profile-detail-item">
              <i className="bi bi-calendar"></i>
              <span>
                {new Date(user.dateofbirth).toLocaleDateString('de-DE', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </span>
            </div>
          )}
        </div>

        <button className="btn btn-primary profile-edit-btn" onClick={onEdit}>
          <i className="bi bi-pencil"></i> Profil bearbeiten
        </button>
      </div>
    </div>
  )
}
