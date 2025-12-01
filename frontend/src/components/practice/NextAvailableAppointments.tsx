import '../../styles/components/practice/NextAvailableAppointments.scss'
import { useEffect, useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { getAvailableAppointmentsByPracticeId } from '../../api/AppointmentsAPI'
import { compareDates, dateToDateString, dateToTimeString, getShortDate, getShortWeekday } from '../../utils/DateToStringFormat'
import type { AppointmentFilterType, AppointmentsType, } from '../../../../shared/schemas/ZodSchemas'

type NextAvailableAppointmentsProps = {
  praxisID: string
  filterOptions: AppointmentFilterType
  onSlotClick?: (termin: AppointmentsType) => void
}

export function NextAvailableAppointments({
  praxisID,
  filterOptions,
  onSlotClick,
}: NextAvailableAppointmentsProps) {
  const [dateAnsicht, setDateAnsicht] = useState(new Date())
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
      praxisID,
      filterOptions.animalTypeIds,
      filterOptions.serviceTypeIds,
    ],
    queryFn: () =>
      getAvailableAppointmentsByPracticeId(praxisID, filterOptions),
    retry: false,
  })

  // Finde nächsten verfügbaren Termin nach der aktuellen Ansicht
  const findNextAppointmentDate = (): Date | null => {
    if (isSuccess) {
      const endOfCurrentView = new Date(dateAnsicht)
      endOfCurrentView.setDate(endOfCurrentView.getDate() + 5)

      const futureAppointments = data.filter(
        (termin) => compareDates(termin.starttime, endOfCurrentView) >= 0,
      )

      return futureAppointments.length > 0
        ? futureAppointments[0].starttime
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

  const handleForwardTermin = (count: number) => {
    // number of how often the date to be clicked *5
    const newDate = new Date(dateAnsicht) // neues Objekt damit State sich aendert
    newDate.setDate(newDate.getDate() + 5 * count)
    setDateAnsicht(newDate)
    setExpandedDays(new Set()) // Reset expanded state beim Wechsel
  }

  const handleBackwardTermin = () => {
    const newDate = new Date(dateAnsicht) // neues Objekt damit State sich aendert
    newDate.setDate(newDate.getDate() - 5)
    setDateAnsicht(newDate)
    setExpandedDays(new Set()) // Reset expanded state beim Wechsel
  }

  const backwordPossibleTermin = () => {
    const newDate = new Date(dateAnsicht)
    newDate.setDate(newDate.getDate() - 1) // wenn Tag davor in Vergangenheit ist darf nicht geklickt werden
    const now = new Date()
    if (newDate < now) {
      return true
    }
  }

  const handleBookAppiontment = (termin: AppointmentsType) => {
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
      // navigiert zur Buchungsseite fuer den Termin
      navigate({
        to: '/praxen/$praxisId/booking/$terminId',
        params: {
          praxisId: termin.veterinarypractice.id.toString(),
          terminId: termin.id.toString(),
        },
        state: {
          appointment: termin,
          serviceType: appointmentTypeId,
          filterAnimalId: filterOptions.animal,
          filterAnimalTypeId: filterOptions.animalTypeIds !== undefined && filterOptions.animalTypeIds.length > 0 ? filterOptions.animalTypeIds[0] : undefined
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
    return zeitA.starttime.getTime() - zeitB.starttime.getTime()
  })

  // speichert alle benoetigten Termine in Array, fuer die naechsten fuenf Tage
  // an Pos 0 sind Termine von Tag dateAnsicht, an Pos 1 von nächsten Tag, ...
  const termineTage: Array<Array<AppointmentsType>> = Array.from(
    { length: 5 },
    () => [],
  ) // erzeugt zweidimensionales Array
  let i = 0
  const vergleichDate = new Date(dateAnsicht) // erster Tag der in dieser Ansicht zur Auswahl steht
  for (const termin of data) {
    if (compareDates(vergleichDate, new Date()) !== 0) {
      vergleichDate.setHours(0, 0, 0, 0)
    } else {
      const time = new Date()
      vergleichDate.setHours(
        time.getHours(),
        time.getMinutes(),
        time.getSeconds(),
        time.getMilliseconds(),
      )
    }

    if (termin.starttime > vergleichDate) {
      // Termine vor angegebenem Starttermin werden nicht angezeigt
      while (i < 5) {
        // wenn Date String gleich ist dann ist richtige Pos im Array gefunden, dadurch wird sichergestellt das Tag Monat und Jahr uebereinstimmen
        if (
          dateToDateString(termin.starttime) ===
          dateToDateString(vergleichDate)
        ) {
          termineTage[i].push(termin)
          break
        }
        i++
        vergleichDate.setDate(vergleichDate.getDate() + 1) // der verfuegbare Termin ist noch weiter in der Zukunft (also weiter suchen)
      }
    }
    if (i === 5) {
      // auch aussere Schleife verlassen
      break
    }
  }

  const dateKopie = new Date(dateAnsicht)
  const anzeigeDate1 = new Date(dateAnsicht)
  const anzeigeDate2 = new Date(dateKopie.setDate(dateKopie.getDate() + 1))
  const anzeigeDate3 = new Date(dateKopie.setDate(dateKopie.getDate() + 1))
  const anzeigeDate4 = new Date(dateKopie.setDate(dateKopie.getDate() + 1))
  const anzeigeDate5 = new Date(dateKopie.setDate(dateKopie.getDate() + 1))

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
  const hasAppointmentsInCurrentView = termineTage.some(
    (day) => day.length > 0,
  )

  const navigateToNextAppointment = () => {
    const nextDate = findNextAppointmentDate()
    const copyDateAnsicht = new Date(dateAnsicht)
    if (nextDate) {
      copyDateAnsicht.setDate(copyDateAnsicht.getDate() + 5)
      let j = 0
      while (compareDates(copyDateAnsicht, nextDate) <= 0) {
        // count how often the arrow to the right have to been clicked
        copyDateAnsicht.setDate(copyDateAnsicht.getDate() + 5)
        j++
      }
      handleForwardTermin(j)
      setExpandedDays(new Set())
    }
  }

  return (
    <div className="calendar-container">
      {/* Header mit Navigation */}
      <div className="calendar-header">
        <button
          className="nav-arrow"
          onClick={handleBackwardTermin}
          disabled={backwordPossibleTermin()}
        >
          <i className="bi bi-chevron-left"></i>
        </button>

        <div className="calendar-days-header">
          {[
            anzeigeDate1,
            anzeigeDate2,
            anzeigeDate3,
            anzeigeDate4,
            anzeigeDate5,
          ].map((date, index) => (
            <div key={index} className="day-header">
              <div className="day-name">{getShortWeekday(date)}</div>
              <div className="day-date">{getShortDate(date)}</div>
            </div>
          ))}
        </div>

        <button
          className="nav-arrow"
          onClick={() => handleForwardTermin(1)}
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
                ? Math.max(...termineTage.map((t) => t.length))
                : displayLimit

              // Erstelle Zeilen für die Slots
              const rows = []
              for (let rowIndex = 0; rowIndex < maxAppointments; rowIndex++) {
                const row = [0, 1, 2, 3, 4].map((dayIndex) => {
                  const dayAppointments = termineTage[dayIndex] || []
                  const isExpanded = expandedDays.has(dayIndex)
                  const appointmentsToShow = isExpanded
                    ? dayAppointments
                    : dayAppointments.slice(0, displayLimit)
                  const termin = appointmentsToShow[rowIndex]

                  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
                  if (termin) { // eslint not correct because of indexing in array, termin is not always truthy here
                    return (
                      <button
                        key={`${dayIndex}-${rowIndex}`}
                        className="time-slot-btn available"
                        onClick={() => handleBookAppiontment(termin)}
                      >
                        {dateToTimeString(termin.starttime)}
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
            const hasAnyMoreButton = termineTage.some(
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
                      termineTage.forEach((day, index) => {
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
