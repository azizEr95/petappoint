import type { DashboardStatsProps } from '../../types/dashboard'
import '../../styles/components/dashboard/DashboardStats.scss'

export function DashboardStats({ stats }: DashboardStatsProps) {
  return (
    <div className="dashboard-stats-grid">
      <div className="stat-card">
        <div className="stat-icon stat-icon-pets">
          <i className="bi bi-heart-fill"></i>
        </div>
        <div className="stat-content">
          <div className="stat-value">{stats.totalPets}</div>
          <div className="stat-label">Meine Tiere</div>
        </div>
      </div>

      <div className="stat-card">
        <div className="stat-icon stat-icon-upcoming">
          <i className="bi bi-calendar-check"></i>
        </div>
        <div className="stat-content">
          <div className="stat-value">{stats.upcomingAppointments}</div>
          <div className="stat-label">Anstehende Termine</div>
        </div>
      </div>

      <div className="stat-card">
        <div className="stat-icon stat-icon-year">
          <i className="bi bi-check-circle-fill"></i>
        </div>
        <div className="stat-content">
          <div className="stat-value">{stats.totalAppointmentsThisYear}</div>
          <div className="stat-label">Termine dieses Jahr</div>
        </div>
      </div>
    </div>
  )
}
