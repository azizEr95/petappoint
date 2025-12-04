/**
 * return the weekday, date and time of an date as an formated string
 */
export function dateToInfosString(date: Date): string {
  const options: Intl.DateTimeFormatOptions = {
    // Typ ist noetig damit kein Fehler kommt
    weekday: 'long',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }

  const datum = date.toLocaleDateString('de-DE', options)
  const zeit = date.toLocaleTimeString('de-DE', {
    hour: '2-digit',
    minute: '2-digit',
  })
  return datum + ' ' + zeit
}

/**
 * gibt das Datum des Datum Objekts als schoen formatierten String zurueck
 */
export function dateToDateString(date: Date): string {
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
export function dateToTimeString(date: Date): string {
  const zeit = date.toLocaleTimeString('de-DE', {
    hour: '2-digit',
    minute: '2-digit',
  })
  return zeit
}

/**
 * gibt den kurzen Wochentag zurueck (z.B. "Mo")
 */
export function getShortWeekday(date: Date): string {
  return date.toLocaleDateString('de-DE', { weekday: 'short' })
}

/**
 * gibt das kurze Datum zurueck (z.B. "13.11")
 */
export function getShortDate(date: Date): string {
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
export function compareDates(date1: Date, date2: Date): number {
  const dateToDayString = (date: Date): string => {
    return date.toISOString().split('T')[0]
  }

  const date1String = dateToDayString(date1)
  const date2String = dateToDayString(date2)

  // einfach mit Strings vergleichen
  if (date1String > date2String) {
    return 1 // date1 ist spaeter
  } else if (date1String < date2String) {
    return -1 // date2 ist spaeter
  } else {
    return 0 // gleicher Tag
  }
}

/**
 * makes a string with all Date Infos (except time) from an Date Object
 *
 * @param date date to be converted
 * @returns string from this date
 */
export function getDateStringFromDate(date: Date): string {
  const monthAsNumber = date.getMonth() + 1
  let monthAsString
  if (monthAsNumber <= 9) {
    monthAsString = '0' + monthAsNumber
  } else {
    monthAsString = monthAsNumber
  }
  const dateAsString =
    date.getFullYear() + '-' + monthAsString + '-' + date.getDate()
  return dateAsString
}
