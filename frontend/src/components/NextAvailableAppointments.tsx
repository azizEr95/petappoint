import type { AppointmentsType } from '../../../shared/schemas/ZodSchemas'
import '../styles/nextAvailableAppointments.modules.css'
import { useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { getAvailableAppointmentsByPracticeId } from '../api/AppointmentsAPI'

type NextAvailableAppointmentsProps = {
  praxisID: string
}

export function NextAvailableAppointments({ praxisID }: NextAvailableAppointmentsProps) { //praxisID zum irgendwie bei Abfrage uebergeben werden
    let [dateAnsicht, setDateAnsicht] = useState(new Date());
    const [expandedDays, setExpandedDays] = useState<Set<number>>(new Set());
    const navigate = useNavigate();

    const { isPending, isError, isSuccess, data } = useQuery<AppointmentsType[]>({
        queryKey: [`nextAvailableAppointments/${praxisID}`],
        queryFn: () => getAvailableAppointmentsByPracticeId(praxisID),
        retry: false
    });

  const handleForwardTermin = () => {
    const newDate = new Date(dateAnsicht) // neues Objekt damit State sich aendert
    newDate.setDate(newDate.getDate() + 5)
    setDateAnsicht(newDate)
    setExpandedDays(new Set()) // Reset expanded state beim Wechsel
  }

  const handleBackwardTermin = () => {
    const newDate = new Date(dateAnsicht) // neues Objekt damit State sich aendert
    newDate.setDate(newDate.getDate() - 5)
    setDateAnsicht(newDate)
    setExpandedDays(new Set()) // Reset expanded state beim Wechsel
  }

  const toggleExpandDay = (dayIndex: number) => {
    const newExpanded = new Set(expandedDays)
    if (newExpanded.has(dayIndex)) {
      newExpanded.delete(dayIndex)
    } else {
      newExpanded.add(dayIndex)
    }
    setExpandedDays(newExpanded)
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
        //navigiert zur Buchungsseite fuer den Termin
        navigate({
            "to": "/praxen/$praxisId/booking/$terminId",
            params: {
                praxisId: termin.fk_veterinarypracticeid.toString(),
                terminId: termin.id.toString()
            },
            state: {
                termin: termin
            }
        });
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

  if (isSuccess) {
    data.sort((zeitA, zeitB) => {
      // sortiert die Termine nach Anfangszeit
      return zeitA.starttime.getTime() - zeitB.starttime.getTime()
    })
    console.log(data)

        //speichert alle benoetigten Termine in Array, fuer die naechsten fuenf Tage
        //an Pos 0 sind Termine von Tag dateAnsicht, an Pos 1 von nächsten Tag, ...
        let termineTage: AppointmentsType[][] = Array.from({ length: 5 }, () => []); //erzeugt zweidimensionales Array
        let i = 0;
        let vergleichDate = new Date(dateAnsicht); //erster Tag der in dieser Ansicht zur Auswahl steht
        for (const termin of data) {
            if (compareDates(termin.starttime, dateAnsicht) >= 0) { //Termine vor angegebenem Starttermin werden nicht angezeigt
                while (i < 5) {
                    //wenn Date String gleich ist dann ist richtige Pos im Array gefunden, dadurch wird sichergestellt das Tag Monat und Jahr uebereinstimmen
                    if (dateToDateString(termin.starttime) === dateToDateString(vergleichDate)) {
                        termineTage[i].push(termin);
                        break;
                    }
                    i++;
                    vergleichDate.setDate(vergleichDate.getDate() + 1); //der verfuegbare Termin ist noch weiter in der Zukunft (also weiter suchen)
                }
            }
            if (i === 5) { //auch aussere Schleife verlassen
                break;
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
          <style>{`
            .no-appointments-message {
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: center;
              height: 100%;
              width: 100%;
              padding: 2rem;
              text-align: center;
              color: var(--color-text-light);
            }

            .no-appointments-message i {
              font-size: 2.5rem;
              color: var(--color-text-muted);
              margin-bottom: 1rem;
            }

            .no-appointments-message p {
              margin: 0;
              font-size: 1rem;
            }
          `}</style>
        </div>
      )
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
            {[anzeigeDate1, anzeigeDate2, anzeigeDate3, anzeigeDate4, anzeigeDate5].map(
              (date, index) => (
                <div key={index} className="day-header">
                  <div className="day-name">{getShortWeekday(date)}</div>
                  <div className="day-date">{getShortDate(date)}</div>
                </div>
              ),
            )}
          </div>

          <button className="nav-arrow" onClick={handleForwardTermin}>
            <i className="bi bi-chevron-right"></i>
          </button>
        </div>

        {/* Spalten mit Terminen */}
        <div className="calendar-grid">
          {(() => {
            const displayLimit = 5
            const anyExpanded = expandedDays.size > 0

            // Berechne maximale Anzahl Slots (bei expansion)
            const maxAppointments = anyExpanded
              ? Math.max(...termineTage.map(t => t.length))
              : displayLimit

            // Erstelle Zeilen für die Slots
            const rows = []
            for (let rowIndex = 0; rowIndex < maxAppointments; rowIndex++) {
              const row = [0, 1, 2, 3, 4].map((dayIndex) => {
                const dayAppointments = termineTage[dayIndex] || []
                const isExpanded = expandedDays.has(dayIndex)
                const appointmentsToShow = isExpanded ? dayAppointments : dayAppointments.slice(0, displayLimit)
                const termin = appointmentsToShow[rowIndex]

                if (termin) {
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
                    <div key={`${dayIndex}-${rowIndex}`} className="time-slot-btn unavailable">
                      –
                    </div>
                  )
                }
              })
              rows.push(
                <div key={`row-${rowIndex}`} className="calendar-row">
                  {row}
                </div>
              )
            }

            return rows
          })()}
        </div>

        {/* Mehr-Button als separate Zeile über alle Spalten */}
        {(() => {
          const displayLimit = 5
          const hasAnyMoreButton = termineTage.some(day => day.length > displayLimit)

          if (!hasAnyMoreButton) return null

          const anyExpanded = expandedDays.size > 0

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
                {anyExpanded ? 'Weniger Termine anzeigen' : 'Mehr Termine anzeigen'}
              </button>
            </div>
          )
        })()}

        <style>{`
          .calendar-container {
            width: 100%;
            overflow: hidden;
          }

          .calendar-header {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            margin-bottom: 1rem;
            padding-bottom: 0.75rem;
            border-bottom: 2px solid var(--color-border);
          }

          .nav-arrow {
            background: none;
            border: none;
            color: var(--color-primary);
            font-size: 1.5rem;
            cursor: pointer;
            padding: 0.25rem;
            transition: opacity 0.2s;
            flex-shrink: 0;
          }

          .nav-arrow:hover:not(:disabled) {
            opacity: 0.7;
          }

          .nav-arrow:disabled {
            opacity: 0.3;
            cursor: not-allowed;
          }

          .calendar-days-header {
            display: grid;
            grid-template-columns: repeat(5, 1fr);
            gap: 0.5rem;
            flex: 1;
          }

          .day-header {
            text-align: center;
            font-size: 0.9rem;
          }

          .day-name {
            font-weight: 600;
            color: var(--color-primary);
            margin-bottom: 0.25rem;
          }

          .day-date {
            color: var(--color-text-light);
            font-size: 0.85rem;
          }

          .calendar-grid {
            display: flex;
            flex-direction: column;
            gap: 0.5rem;
          }

          .calendar-row {
            display: grid;
            grid-template-columns: repeat(5, 1fr);
            gap: 0.5rem;
          }

          .time-slot-btn {
            padding: 0.6rem 0.5rem;
            border-radius: var(--radius-sm);
            font-size: 0.9rem;
            font-weight: 500;
            text-align: center;
            transition: all 0.2s;
            min-height: 2.5rem;
            display: flex;
            align-items: center;
            justify-content: center;
          }

          .time-slot-btn.available {
            background: var(--color-primary);
            color: white;
            border: none;
            cursor: pointer;
          }

          .time-slot-btn.available:hover {
            background: var(--color-primary-dark);
            transform: translateY(-2px);
            box-shadow: var(--shadow-sm);
          }

          .time-slot-btn.unavailable {
            background: var(--color-bg-light);
            color: var(--color-text-muted);
            border: 1px solid var(--color-border);
          }

          .mehr-button-container {
            margin-top: 1rem;
          }

          .mehr-btn-full {
            width: 100%;
            padding: 0.6rem 1.5rem;
            border-radius: var(--radius-sm);
            font-size: 0.85rem;
            font-weight: 500;
            text-align: center;
            background: transparent;
            color: var(--color-primary);
            border: 1px solid var(--color-primary);
            cursor: pointer;
            transition: all 0.2s;
          }

          .mehr-btn-full:hover {
            background: var(--color-primary);
            color: white;
          }

          @media (max-width: 768px) {
            .calendar-days-header {
              grid-template-columns: repeat(5, 1fr);
            }

            .calendar-row {
              grid-template-columns: repeat(5, 1fr);
            }

            .day-header {
              font-size: 0.75rem;
            }

            .day-date {
              font-size: 0.7rem;
            }

            .time-slot-btn {
              padding: 0.4rem 0.3rem;
              font-size: 0.75rem;
              min-height: 2rem;
            }
          }
        `}</style>
      </div>
    )
  }
}

/**
 * gibt das Datum des Datum Objekts als schoen formatierten String zurueck
 */
function dateToDateString(date: Date): string {
  const options: Intl.DateTimeFormatOptions = {
    // Typ ist noetig damit kein Fehler kommt
    weekday: 'short',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }

  const datum = date.toLocaleDateString('de-DE', options)
  return datum
}

/**
 * gibt die Uhrzeit des Datum Objekts als schoen formatierten String zurueck
 */
function dateToTimeString(date: Date): string {
  const zeit = date.toLocaleTimeString('de-DE', {
    hour: '2-digit',
    minute: '2-digit',
  })
  return zeit
}

/**
 * gibt den kurzen Wochentag zurueck (z.B. "Mo")
 */
function getShortWeekday(date: Date): string {
  return date.toLocaleDateString('de-DE', { weekday: 'short' })
}

/**
 * gibt das kurze Datum zurueck (z.B. "13.11")
 */
function getShortDate(date: Date): string {
  return date.toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit' })
}

/**
 * gibt positive Zahl zurueck wenn date1 mehr in der zukunft ist als date2
 * wenn anders herum dann wird negative zahl zurueckgegeben
 * bei gleichen Datum wird 0 zurueckgegeben
 * 
 * @param date1 erstes Datum zum vergleichen
 * @param date2 zweites Datum zum vergleichen
 */
function compareDates(date1: Date, date2: Date): number {
  const dateToDayString = (date: Date): string => {
      return date.toISOString().split('T')[0];
  };

  const date1String = dateToDayString(date1);
  const date2String = dateToDayString(date2);

  //einfach mit Strings vergleichen
  if (date1String > date2String) {
      return 1; // date1 ist spaeter
  } else if (date1String < date2String) {
      return -1; // date2 ist spaeter
  } else {
      return 0; // gleicher Tag
  }
}
