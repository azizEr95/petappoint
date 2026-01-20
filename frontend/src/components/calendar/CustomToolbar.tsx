import moment from 'moment'
import type { ToolbarProps, View } from 'react-big-calendar'
import type { AppointmentsType } from "vetilib-shared/schemas/ZodSchemas";

interface CustomToolbarProps extends ToolbarProps<AppointmentsType> {
  currentDate: Date
}

export function CustomToolbar({
  label,
  onNavigate,
  onView,
  view,
  currentDate,
}: CustomToolbarProps) {
  const weekNumber = moment(currentDate).isoWeek()

  return (
    <div className="rbc-toolbar">
      {/* Navigation: Zurück, Heute, Vor */}
      <span className="rbc-btn-group">
        <button type="button" onClick={() => onNavigate('PREV')}>
          Zurück
        </button>
        <button type="button" onClick={() => onNavigate('TODAY')}>
          Heute
        </button>
        <button type="button" onClick={() => onNavigate('NEXT')}>
          Vor
        </button>
      </span>

      {/* Label + KW wrapper */}
      <div className="rbc-label-wrapper">
        {view === 'agenda' ? (
          <span className="rbc-date-label">
            {label.split(' - ')[0].split(' ')[0]} - {label.split(' - ')[1]?.split(' ')[0]}
          </span>
        ) : (
          <span className="rbc-date-label">{label}</span>
        )}
        <span className="rbc-week-number">KW {weekNumber}</span>
      </div>

      {/* View-Buttons: Monat, Woche, Tag, Übersicht */}
      <span className="rbc-btn-group">
        <button
          type="button"
          onClick={() => onView('month' as View)}
          className={view === 'month' ? 'rbc-active' : ''}
        >
          Monat
        </button>
        <button
          type="button"
          onClick={() => onView('week' as View)}
          className={view === 'week' ? 'rbc-active' : ''}
        >
          Woche
        </button>
        <button
          type="button"
          onClick={() => onView('day' as View)}
          className={view === 'day' ? 'rbc-active' : ''}
        >
          Tag
        </button>
        <button
          type="button"
          onClick={() => onView('agenda' as View)}
          className={view === 'agenda' ? 'rbc-active' : ''}
        >
          Übersicht
        </button>
      </span>
    </div>
  )
}
