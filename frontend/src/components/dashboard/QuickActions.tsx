import { Link } from '@tanstack/react-router'
import type { QuickActionsProps } from '../../types/dashboard'
import '../../styles/components/dashboard/QuickActions.scss'

export function QuickActions({ onAddPet }: QuickActionsProps) {
  return (
    <div className="quick-actions-grid">
      <Link to="/search" search={{ name: '', address: '', animalType: '', serviceType: '' }} className="action-button">
        <div className="action-icon">
          <i className="bi bi-calendar-plus"></i>
        </div>
        <div className="action-label">Termin buchen</div>
      </Link>

      <button className="action-button" onClick={onAddPet}>
        <div className="action-icon">
          <i className="bi bi-plus-circle"></i>
        </div>
        <div className="action-label">Tier hinzufügen</div>
      </button>

      <Link to="/practices/favorites"  className="action-button">
        <div className="action-icon">
          <i className="bi bi-star"></i>
        </div>
        <div className="action-label">Favoriten</div>
      </Link>

      <Link to="/appointments" className="action-button">
        <div className="action-icon">
          <i className="bi bi-list-check"></i>
        </div>
        <div className="action-label">Alle Termine</div>
      </Link>
    </div>
  )
}
