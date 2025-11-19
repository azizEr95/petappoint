

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