import { useState } from "react"
import moment from 'moment'
import { Calendar,  Views, momentLocalizer } from 'react-big-calendar'
import { CustomToolbar } from './CustomToolbar';
import type {ToolbarProps, View} from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css'
import '@/styles/components/calendar/CalendarPractice.scss'
import type { AppointmentsType } from "vetilib-shared/schemas/ZodSchemas";
import { getVeterinarianColor } from '@/utils/veterinarianColors';

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

type CalendarPracticeProps = {
    data: Array<AppointmentsType> | undefined
    onSelectEvent: (event: AppointmentsType) => void
    onSelectSlot: (slotInfo: { start: Date; end: Date}) => void
}

// alle Termine die hier angezeigt werden sollen muessen hier uebergeben werden als Props
export function CalendarPractice({ data, onSelectEvent, onSelectSlot }: CalendarPracticeProps) {
    const [view, setView] = useState<View>(Views.WEEK)
    const [date, setDate] = useState(new Date())

    const eventStyleGetter = (event: AppointmentsType) => {
        const bgColor = getVeterinarianColor(event.veterinary.id)
        return {
            style: {
                backgroundColor: bgColor,
                borderColor: bgColor,
                color: '#ffffff',
            }
        }
    }

    return (
        <div className="calendar-container">
            <Calendar<AppointmentsType>
                localizer={localizer}
                culture="de"
                events={data || []}
                startAccessor="startTime"
                endAccessor="endTime"
                selectable
                view={view}
                onView={(newView) => setView(newView)}
                date={date}
                onNavigate={(newDate) => setDate(newDate)}
                views={[Views.MONTH, Views.WEEK, Views.DAY, Views.AGENDA]}
                defaultView={Views.DAY}
                min={new Date(2026, 0, 1, 6, 0)}
                max={new Date(2026, 0, 1, 20, 0)}
                step={30}
                timeslots={2}
                dayLayoutAlgorithm="no-overlap"
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
                    previous: 'Zurück',
                    today: 'Heute',
                    next: 'Weiter',
                    month: 'Monat',
                    week: 'Woche',
                    day: 'Tag',
                    agenda: 'Übersicht',
                    date: 'Datum',
                    time: 'Zeit',
                    event: 'Termin',
                    noEventsInRange: 'Keine Termine in diesem Bereich.',
                }}
                components={{
                    toolbar: (props: ToolbarProps<AppointmentsType>) => <CustomToolbar {...props} currentDate={date} />
                }}
                eventPropGetter={eventStyleGetter}
                onSelectEvent={onSelectEvent}
                onSelectSlot={onSelectSlot}
            />
        </div>
    )
}