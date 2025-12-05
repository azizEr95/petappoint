import type { AppointmentsType } from '../../../shared/schemas/ZodSchemas'

export const exportToCalendar = (
  appointment: AppointmentsType,
  practiceName: string,
  practiceAddress: string,
  serviceName?: string,
) => {
  const formatICSDate = (date: Date): string => {
    return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z'
  }

  const escapeICSString = (str: string): string => {
    return str.replace(/[,;\\]/g, '\\$&').replace(/\n/g, '\\n')
  }

  const icsContent = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//vetilib//Appointment//DE',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `DTSTART:${formatICSDate(appointment.starttime)}`,
    `DTEND:${formatICSDate(appointment.endtime)}`,
    `SUMMARY:${escapeICSString(`Tierarzttermin bei ${practiceName}`)}`,
    `DESCRIPTION:${escapeICSString(serviceName ? `Service: ${serviceName}` : 'Tierarzttermin')}`,
    `LOCATION:${escapeICSString(practiceAddress)}`,
    `UID:${appointment.id}@vetilib.app`,
    `DTSTAMP:${formatICSDate(new Date())}`,
    'STATUS:CONFIRMED',
    'SEQUENCE:0',
    'BEGIN:VALARM',
    'TRIGGER:-PT1H',
    'ACTION:DISPLAY',
    'DESCRIPTION:Erinnerung: Tierarzttermin in 1 Stunde',
    'END:VALARM',
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n')

  const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `termin-${appointment.id}.ics`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}
