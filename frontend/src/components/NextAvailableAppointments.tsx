import { Button } from "react-bootstrap";
import type { AppointmentsType } from "../../../shared/schemas/ZodSchemas"
import '../styles/nextAvailableAppointments.modules.css';
import { useState } from "react";


type NextAvailableAppointmentsProps = {
    praxisID: number
}

export function NextAvailableAppointments({ praxisID}: NextAvailableAppointmentsProps) { //praxisID zum irgendwie bei Abfrage uebergeben werden
    let [dateAnsicht, setDateAnsicht] = useState(new Date());
    
    //erstmal zum Testen:
    const isSuccess = true;
    const data: AppointmentsType[] = [{
        id: 1,
        starttime: new Date("2025-11-10T10:00:00"),
        endtime: new Date("2025-11-10T11:00:00"),
        fk_veterinaryid: 1,
        fk_veterinarypracticeid: 2,
        fk_animalid: undefined
    },
    {
        id: 2,
        starttime: new Date("2025-11-11T10:00:00"),
        endtime: new Date("2025-11-11T11:00:00"),
        fk_veterinaryid: 1,
        fk_veterinarypracticeid: 2,
        fk_animalid: undefined
    },
    {
        id: 3,
        starttime: new Date("2025-11-09T10:00:00"),
        endtime: new Date("2025-11-09T11:00:00"),
        fk_veterinaryid: 1,
        fk_veterinarypracticeid: 2,
        fk_animalid: undefined
    },
    {
        id: 4,
        starttime: new Date("2025-11-02T10:00:00"),
        endtime: new Date("2025-11-02T11:00:00"),
        fk_veterinaryid: 1,
        fk_veterinarypracticeid: 2,
        fk_animalid: undefined
    },
    {
        id: 5,
        starttime: new Date("2025-11-09T10:30:00"),
        endtime: new Date("2025-11-09T11:00:00"),
        fk_veterinaryid: 1,
        fk_veterinarypracticeid: 2,
        fk_animalid: undefined
    },
    {
        id: 5,
        starttime: new Date("2025-11-11T20:30:00"),
        endtime: new Date("2025-11-11T21:00:00"),
        fk_veterinaryid: 1,
        fk_veterinarypracticeid: 2,
        fk_animalid: undefined
    }]
    // const { isPending, isError, isSuccess, data, error } = useQuery<AppointmentsType[]>({
    //     queryKey: ['nextAvaulableAppointments'],
    //     queryFn: //Methode die Backend Abfrage macht
    //   })

    const handleForwardTermin = () => {
        let newDate = new Date(dateAnsicht); //neues Objekt damit State sich aendert
        newDate.setDate(newDate.getDate() + 5);
        setDateAnsicht(newDate);
    }

    const handleBackwardTermin = () => {
        let newDate = new Date(dateAnsicht); //neues Objekt damit State sich aendert
        newDate.setDate(newDate.getDate() - 5);
        setDateAnsicht(newDate);
    }

    const backwordPossibleTermin = () => {
        let newDate = new Date(dateAnsicht);
        newDate.setDate(newDate.getDate() - 1); //wenn Tag davor in Vergangenheit ist darf nicht geklickt werden
        let now = new Date();
        if (newDate < now) {
            return true;
        }
    }

    if (isSuccess) {
        data.sort((zeitA, zeitB) => { //sortiert die Termine nach Anfangszeit
            return zeitA.starttime.getTime() - zeitB.starttime.getTime()
        });

        //speichert alle benoetigten Termine in Array, fuer die naechsten fuenf Tage
        //an Pos 0 sind Termine von Tag dateAnsicht, an Pos 1 von nächsten Tag, ...
        let termineTage: AppointmentsType[][] = Array.from({ length: 5 }, () => []); //erzeugt zweidimensionales Array
        let i = 0;
        let vergleichDate = new Date(dateAnsicht); //erster Tag der in dieser Ansicht zur Auswahl steht
        for (const termin of data) {
            if (termin.starttime >= dateAnsicht) { //Termine vor angegebenem Starttermin werden nicht angezeigt
                while (termin.starttime.getDate() >= vergleichDate.getDate()) {
                    //wenn Date String gleich ist dann ist richtige Pos im Array gefunden, dadurch wird sichergestellt das Tag Monat und Jahr uebereinstimmen
                    if (dateToDateString(termin.starttime) === dateToDateString(vergleichDate)) {
                        termineTage[i].push(termin);
                        break;
                    }
                    i++;
                    if (i === 5) { //aufhoeren mit Terminsuche, alle Termine der naechsten 5 Tage gefunden
                        break;
                    }
                    vergleichDate.setDate(vergleichDate.getDate() + 1); //der verfuegbare Termin ist noch weiter in der Zukunft (also weiter suchen)
                }
            }
            if (i === 5) { //auch aussere Schleife verlassen
                break;
            }
        }

        let dateKopie = new Date(dateAnsicht);
        let anzeigeDate1 = new Date(dateAnsicht);
        let anzeigeDate2 = new Date(dateKopie.setDate(dateKopie.getDate() + 1));
        let anzeigeDate3 = new Date(dateKopie.setDate(dateKopie.getDate() + 1));
        let anzeigeDate4 = new Date(dateKopie.setDate(dateKopie.getDate() + 1));
        let anzeigeDate5 = new Date(dateKopie.setDate(dateKopie.getDate() + 1));
        return (<div id ="TerminAuswahl" className="flex-row">
            <Button id="BackwardButton" variant="outline-secondary" onClick={handleBackwardTermin} disabled={backwordPossibleTermin()}><i className="bi bi-arrow-left-short"></i></Button>
            <div className="TerminDate">
                {dateToDateString(anzeigeDate1)}
                {termineTage[0].map((termin) => {
                    return <Button key={praxisID + termin.id} className="ButtonTermin">{dateToTimeString(termin.starttime)}</Button>
                })}
            </div>
            <div className="TerminDate">
                {dateToDateString(anzeigeDate2)}
                {termineTage[1].map((termin) => {
                    return <Button key={praxisID + termin.id} className="ButtonTermin">{dateToTimeString(termin.starttime)}</Button>
                })}
            </div>
            <div className="TerminDate">
                {dateToDateString(anzeigeDate3)}
                {termineTage[2].map((termin) => {
                    return <Button key={praxisID + termin.id} className="ButtonTermin">{dateToTimeString(termin.starttime)}</Button>
                })}
            </div>
            <div className="TerminDate">
                {dateToDateString(anzeigeDate4)}
                {termineTage[3].map((termin) => {
                    return <Button key={praxisID + termin.id} className="ButtonTermin">{dateToTimeString(termin.starttime)}</Button>
                })}
            </div>
            <div className="TerminDate">
                {dateToDateString(anzeigeDate5)}
                {termineTage[4].map((termin) => {
                    return <Button key={praxisID + termin.id} className="ButtonTermin">{dateToTimeString(termin.starttime)}</Button>
                })}
            </div>
            <Button id="ForwardButton" variant="outline-secondary" onClick={handleForwardTermin}><i className="bi bi-arrow-right-short"></i></Button>
        </div>
        )
    }

}


/**
 * gibt das Datum des Datum Objekts als schoen formatierten String zurueck 
 */
function dateToDateString(date: Date): string {
    const options: Intl.DateTimeFormatOptions = { //Typ ist noetig damit kein Fehler kommt
        weekday: "short",
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
    };

    const datum = date.toLocaleDateString("de-DE", options);
    return datum;
}

/**
 * gibt die Uhrzeit des Datum Objekts als schoen formatierten String zurueck 
 */
function dateToTimeString(date: Date): string {
    const zeit = date.toLocaleTimeString("de-DE", { hour: "2-digit", minute: "2-digit" });
    return zeit;
}