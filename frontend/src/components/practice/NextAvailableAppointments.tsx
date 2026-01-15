import '../../styles/components/practice/NextAvailableAppointments.scss'
import { useEffect, useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { getAvailableAppointmentsByPracticeId } from '../../api/AppointmentsAPI'
import {
  compareDates,
  dateToDateString,
  dateToTimeString,
  getShortDate,
  getShortWeekday,
} from '../../utils/DateToStringFormat'
import type {
  AppointmentFilterType,
  AppointmentsType,
} from 'vetilib-shared/schemas/ZodSchemas'

type NextAvailableAppointmentsProps = {
  practiceId: string
  filterOptions: AppointmentFilterType
  onSlotClick?: (termin: AppointmentsType) => void
}

export function NextAvailableAppointments({
  practiceId,
  filterOptions,
  onSlotClick,
}: NextAvailableAppointmentsProps) {
  const [dateView, setDateView] = useState(new Date())
  const [expandedDays, setExpandedDays] = useState<Set<number>>(new Set())
  const [noFutureAppointments, setNoFutureAppointments] =
    useState<boolean>(false)
  const navigate = useNavigate()

  // call here useQuery with filterOptions servicetype
  const { isPending, isError, isSuccess, data } = useQuery<
    Array<AppointmentsType>
  >({
    queryKey: [
      'nextAvailableAppointments',
      practiceId,
      filterOptions.animalTypeIds,
      filterOptions.serviceTypeIds,
    ],
    queryFn: () =>
      getAvailableAppointmentsByPracticeId(practiceId, filterOptions),
    retry: false,
  })

  // Finde nächsten verfügbaren Termin nach der aktuellen Ansicht
  const findNextAppointmentDate = (): Date | null => {
    if (isSuccess) {
      const endOfCurrentView = new Date(dateView)
      endOfCurrentView.setDate(endOfCurrentView.getDate() + 5)

      const futureAppointments = data.filter(
        (termin) => compareDates(termin.startTime, endOfCurrentView) >= 0,
      )

      return futureAppointments.length > 0
        ? futureAppointments[0].startTime
        : null
    } else {
      return null
    }
  }

  useEffect(() => {
    if (findNextAppointmentDate() === null) {
      setNoFutureAppointments(true)
    } else {
      setNoFutureAppointments(false)
    }
  }, [findNextAppointmentDate()])

  const handleForwardAppointment = (count: number) => {
    // number of how often the date to be clicked *5
    const newDate = new Date(dateView) // neues Objekt damit State sich aendert
    newDate.setDate(newDate.getDate() + 5 * count)
    setDateView(newDate)
    setExpandedDays(new Set()) // Reset expanded state beim Wechsel
  }

  const handleBackwardAppointment = () => {
    const newDate = new Date(dateView) // neues Objekt damit State sich aendert
    newDate.setDate(newDate.getDate() - 5)
    setDateView(newDate)
    setExpandedDays(new Set()) // Reset expanded state beim Wechsel
  }

  const backwardPossibleAppointment = () => {
    const newDate = new Date(dateView)
    newDate.setDate(newDate.getDate() - 1) // wenn Tag davor in Vergangenheit ist darf nicht geklickt werden
    const now = new Date()
    if (newDate < now) {
      return true
    }
  }

  const handleBookAppointment = (termin: AppointmentsType) => {
    // Use custom onSlotClick if provided, otherwise default navigation
    if (onSlotClick) {
      onSlotClick(termin)
    } else {
      let appointmentTypeId: Array<number> | null = null
      if (filterOptions.serviceTypeIds?.length !== undefined) {
        appointmentTypeId = filterOptions.serviceTypeIds
      } else {
        appointmentTypeId = null
      }
      // navigate to booking page for appointment
      navigate({
        to: '/booking/$appointmentId',
        params: {
          appointmentId: termin.id.toString(),
        },
        state: {
          appointment: termin,
          serviceType: appointmentTypeId,
          filterAnimalId: filterOptions.animal,
          filterAnimalTypeId:
            filterOptions.animalTypeIds !== undefined &&
            filterOptions.animalTypeIds.length > 0
              ? filterOptions.animalTypeIds[0]
              : undefined,
        },
      })
    }
  }

  if (isPending) {
    return (
      <div className="no-appointments-message">
        <i className="bi bi-hourglass-split"></i>
        <p>Lade Termine...</p>
      </div>
    )
  }

  if (isError) {
    return (
      <div className="no-appointments-message">
        <i className="bi bi-exclamation-circle"></i>
        <p>Fehler beim Laden der Termine</p>
      </div>
    )
  }

  data.sort((zeitA, zeitB) => {
    // sortiert die Termine nach Anfangszeit
    return zeitA.startTime.getTime() - zeitB.startTime.getTime()
  })

  // speichert alle benoetigten Termine in Array, fuer die naechsten fuenf Tage
  // an Pos 0 sind Termine von Tag dateView, an Pos 1 von nächsten Tag, ...
  const appointmentDays: Array<Array<AppointmentsType>> = Array.from(
    { length: 5 },
    () => [],
  ) // erzeugt zweidimensionales Array
  let i = 0
  const comparisonDate = new Date(dateView) // erster Tag der in dieser Ansicht zur Auswahl steht
  for (const termin of data) {
    if (compareDates(comparisonDate, new Date()) !== 0) {
      comparisonDate.setHours(0, 0, 0, 0)
    } else {
      const time = new Date()
      comparisonDate.setHours(
        time.getHours(),
        time.getMinutes(),
        time.getSeconds(),
        time.getMilliseconds(),
      )
    }

    if (termin.startTime > comparisonDate) {
      // Termine vor angegebenem Starttermin werden nicht angezeigt
      while (i < 5) {
        // wenn Date String gleich ist dann ist richtige Pos im Array gefunden, dadurch wird sichergestellt das Tag Monat und Jahr uebereinstimmen
        if (
          dateToDateString(termin.startTime) ===
          dateToDateString(comparisonDate)
        ) {
          appointmentDays[i].push(termin)
          break
        }
        i++
        comparisonDate.setDate(comparisonDate.getDate() + 1) // der verfuegbare Termin ist noch weiter in der Zukunft (also weiter suchen)
      }
    }
    if (i === 5) {
      // auch aussere Schleife verlassen
      break
    }
  }

  const dateCopy = new Date(dateView)
  const displayDate1 = new Date(dateView)
  const displayDate2 = new Date(dateCopy.setDate(dateCopy.getDate() + 1))
  const displayDate3 = new Date(dateCopy.setDate(dateCopy.getDate() + 1))
  const displayDate4 = new Date(dateCopy.setDate(dateCopy.getDate() + 1))
  const displayDate5 = new Date(dateCopy.setDate(dateCopy.getDate() + 1))

  // Prüfe ob Praxis überhaupt irgendwelche Termine anbietet
  const practiceHasNoAppointments = data.length === 0

  if (practiceHasNoAppointments) {
    return (
      <div className="no-appointments-message">
        <i className="bi bi-calendar-x"></i>
        <p>Keine Termine verfügbar</p>
      </div>
    )
  }

  // Prüfe ob es Termine in der aktuellen Ansicht gibt
  const hasAppointmentsInCurrentView = appointmentDays.some(
    (day) => day.length > 0,
  )

  const navigateToNextAppointment = () => {
    const nextDate = findNextAppointmentDate()
    const copyDateView = new Date(dateView)
    if (nextDate) {
      copyDateView.setDate(copyDateView.getDate() + 5)
      let j = 0
      while (compareDates(copyDateView, nextDate) <= 0) {
        // count how often the arrow to the right have to been clicked
        copyDateView.setDate(copyDateView.getDate() + 5)
        j++
      }
      handleForwardAppointment(j)
      setExpandedDays(new Set())
    }
  }

  return (
    <div className="calendar-container">
      {/* Header mit Navigation */}
      <div className="calendar-header">
        <button
          className="nav-arrow"
          onClick={handleBackwardAppointment}
          disabled={backwardPossibleAppointment()}
        >
          <i className="bi bi-chevron-left"></i>
        </button>

        <div className="calendar-days-header">
          {[
            displayDate1,
            displayDate2,
            displayDate3,
            displayDate4,
            displayDate5,
          ].map((date, index) => (
            <div key={index} className="day-header">
              <div className="day-name">{getShortWeekday(date)}</div>
              <div className="day-date">{getShortDate(date)}</div>
            </div>
          ))}
        </div>

        <button
          className="nav-arrow"
          onClick={() => handleForwardAppointment(1)}
          disabled={noFutureAppointments}
        >
          <i className="bi bi-chevron-right"></i>
        </button>
      </div>

      {!noFutureAppointments && (
        <div>
          {/* Spalten mit Terminen */}
          <div className="calendar-grid">
            {(() => {
              const displayLimit = 5
              const anyExpanded = expandedDays.size > 0

              // Berechne maximale Anzahl Slots (bei expansion)
              const maxAppointments = anyExpanded
                ? Math.max(...appointmentDays.map((t) => t.length))
                : displayLimit

              // Erstelle Zeilen für die Slots
              const rows = []
              for (let rowIndex = 0; rowIndex < maxAppointments; rowIndex++) {
                const row = [0, 1, 2, 3, 4].map((dayIndex) => {
                  const dayAppointments = appointmentDays[dayIndex] || []
                  const isExpanded = expandedDays.has(dayIndex)
                  const appointmentsToShow = isExpanded
                    ? dayAppointments
                    : dayAppointments.slice(0, displayLimit)
                  const termin = appointmentsToShow[rowIndex]

                  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
                  if (termin) {
                    // eslint not correct because of indexing in array, termin is not always truthy here
                    return (
                      <button
                        key={`${dayIndex}-${rowIndex}`}
                        className="time-slot-btn available"
                        onClick={() => handleBookAppointment(termin)}
                      >
                        {dateToTimeString(termin.startTime)}
                      </button>
                    )
                  } else {
                    return (
                      <div
                        key={`${dayIndex}-${rowIndex}`}
                        className="time-slot-btn unavailable"
                      >
                        –
                      </div>
                    )
                  }
                })
                rows.push(
                  <div key={`row-${rowIndex}`} className="calendar-row">
                    {row}
                  </div>,
                )
              }

              return rows
            })()}
          </div>

          {/* Mehr-Button als separate Zeile über alle Spalten */}
          {(() => {
            const displayLimit = 5
            const hasAnyMoreButton = appointmentDays.some(
              (day) => day.length > displayLimit,
            )
            const anyExpanded = expandedDays.size > 0

            // Nur anzeigen wenn es Termine mit >5 gibt
            if (!hasAnyMoreButton) return null

            return (
              <div className="mehr-button-container">
                <button
                  className="mehr-btn-full"
                  onClick={() => {
                    if (anyExpanded) {
                      // Alle schließen
                      setExpandedDays(new Set())
                    } else {
                      // Alle Tage mit >5 Terminen öffnen
                      const toExpand = new Set<number>()
                      appointmentDays.forEach((day, index) => {
                        if (day.length > displayLimit) {
                          toExpand.add(index)
                        }
                      })
                      setExpandedDays(toExpand)
                    }
                  }}
                >
                  {anyExpanded
                    ? 'Weniger Termine anzeigen'
                    : 'Mehr Termine anzeigen'}
                </button>
              </div>
            )
          })()}
        </div>
      )}

      {noFutureAppointments && (
        <div className="no-appointments-message">
          <i className="bi bi-calendar-x"></i>
          <p>Keine weiteren Termine in der Zukunft verfügbar</p>
        </div>
      )}

      {/* "Nächster Termin" Overlay Button wenn keine Termine in aktueller Ansicht */}
      {!hasAppointmentsInCurrentView && findNextAppointmentDate() && (
        <div className="next-appointment-overlay">
          <button
            className="next-appointment-btn"
            onClick={navigateToNextAppointment}
          >
            <i className="bi bi-calendar-event"></i>
            Nächster Termin am {getShortDate(findNextAppointmentDate()!)}
          </button>
        </div>
      )}
    </div>
  )
}
