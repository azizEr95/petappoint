import { useState } from "react"
import moment from 'moment'
import { Calendar, Views, momentLocalizer } from 'react-big-calendar'
import type { View } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css'

// Deutsches Locale manuell definieren
moment.defineLocale('de', {
    months: 'Januar_Februar_März_April_Mai_Juni_Juli_August_September_Oktober_November_Dezember'.split('_'),
    monthsShort: 'Jan_Feb_Mär_Apr_Mai_Jun_Jul_Aug_Sep_Okt_Nov_Dez'.split('_'),
    weekdays: 'Sonntag_Montag_Dienstag_Mittwoch_Donnerstag_Freitag_Samstag'.split('_'),
    weekdaysShort: 'So_Mo_Di_Mi_Do_Fr_Sa'.split('_'),
    weekdaysMin: 'So_Mo_Di_Mi_Do_Fr_Sa'.split('_'),
    longDateFormat: {
        LT: 'HH:mm',
        LTS: 'HH:mm:ss',
        L: 'DD.MM.YYYY',
        LL: 'D. MMMM YYYY',
        LLL: 'D. MMMM YYYY HH:mm',
        LLLL: 'dddd, D. MMMM YYYY HH:mm'
    },
    week: {
        dow: 1,
        doy: 4
    }
})

moment.locale('de')
const localizer = momentLocalizer(moment)

const myEventsList = [
    {
        id: 1,
        title: 'Beispiel Termin 1',
        start: new Date(2026, 0, 15, 10, 0),
        end: new Date(2026, 0, 15, 11, 0),
    },
    {
        id: 2,
        title: 'Beispiel Termin 2',
        start: new Date(2026, 0, 20, 14, 30),
        end: new Date(2026, 0, 20, 15, 30),
    },
]

// alle Termine die hier angezeigt werden sollen muessen hier uebergeben werden als Props
export function CalendarPractice() {
    const [view, setView] = useState<View>(Views.DAY)
    const [date, setDate] = useState(new Date())

    return <>
        <Calendar
            localizer={localizer}
            culture="de"
            events={myEventsList}
            startAccessor="start"
            endAccessor="end"
            style={{ height: 500 }}
            selectable
            view={view}
            onView={(newView) => setView(newView)}
            date={date}
            onNavigate={(newDate) => setDate(newDate)}
            views={[Views.MONTH, Views.WEEK, Views.DAY, Views.AGENDA]}
            defaultView={Views.DAY}
            min={new Date(2026, 0, 1, 6, 0)}
            max={new Date(2026, 0, 1, 20, 0)}
            formats={{
                timeGutterFormat: 'HH:mm',
                eventTimeRangeFormat: ({ start, end }) => `${moment(start).format('HH:mm')} - ${moment(end).format('HH:mm')}`,
                agendaHeaderFormat: ({ start, end }) => `${moment(start).format('DD.MM.YYYY HH:mm')} - ${moment(end).format('DD.MM.YYYY HH:mm')}`,
                dayHeaderFormat: 'dddd, DD.MM.YYYY',
                dayRangeHeaderFormat: ({ start, end }) => `${moment(start).format('DD.MM')} - ${moment(end).format('DD.MM.YYYY')}`,
                monthHeaderFormat: 'MMMM YYYY',
                weekdayFormat: 'ddd',
                agendaDateFormat: 'DD.MM.YYYY',
                agendaTimeFormat: 'HH:mm',
                agendaTimeRangeFormat: ({ start, end }) => `${moment(start).format('HH:mm')} - ${moment(end).format('HH:mm')}`,
            }}
            messages={{
                today: 'Heute',
                previous: 'Zurück',
                next: 'Weiter',
                month: 'Monat',
                week: 'Woche',
                day: 'Tag',
                agenda: 'Agenda',
                date: 'Datum',
                time: 'Zeit',
                event: 'Termin',
                noEventsInRange: 'Keine Termine in diesem Bereich.',
            }}
            onSelectEvent={(event) => {
                console.log("Termin angeklickt:", event);
                alert(`Patient: ${event.title}`);
            }}
            onSelectSlot={(slotInfo) => {
                console.log("Leeres Feld angeklickt bei:", slotInfo.start);
                const title = window.prompt("Neuer Termin für:");
                if (title) {
                    alert(`Termin am ${slotInfo.start.toLocaleString()} wird angelegt.`);
                }
            }}
        />
    </>
}