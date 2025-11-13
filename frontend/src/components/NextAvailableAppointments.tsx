import { Button } from "react-bootstrap";
import type { AppointmentsType } from "../../../shared/schemas/ZodSchemas"
import '../styles/nextAvailableAppointments.modules.css';
import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { getAvailableAppointmentsByPracticeId } from "../api/AppointmentsAPI";


type NextAvailableAppointmentsProps = {
    praxisID: string
}

export function NextAvailableAppointments({ praxisID }: NextAvailableAppointmentsProps) { //praxisID zum irgendwie bei Abfrage uebergeben werden
    let [dateAnsicht, setDateAnsicht] = useState(new Date());
    const navigate = useNavigate();

    const { isPending, isError, isSuccess, data, error } = useQuery<AppointmentsType[]>({
        queryKey: [`nextAvailableAppointments/${praxisID}`],
        queryFn: () => getAvailableAppointmentsByPracticeId(praxisID),
        retry: false
    });

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

    const handleBookAppiontment = (termin: AppointmentsType) => {
        console.log("Termin:" + termin.id)
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
        return <p>Pending...</p>;
    }
    
    if (isError) {
        console.log(error.message)
        return <p>error...</p>;
    }

    if (isSuccess) {
        data.sort((zeitA, zeitB) => { //sortiert die Termine nach Anfangszeit
            return zeitA.starttime.getTime() - zeitB.starttime.getTime()
        });
        console.log(data)

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
        return (<div className="TerminAuswahl flex-row">
            <Button className="BackwardButton" variant="outline-secondary" onClick={handleBackwardTermin} disabled={backwordPossibleTermin()}><i className="bi bi-arrow-left-short"></i></Button>
            <div className="TerminDate">
                {dateToDateString(anzeigeDate1)}
                {termineTage[0].map((termin) => {
                    return <Button key={praxisID + termin.id} className="ButtonTermin" onClick={() => handleBookAppiontment(termin)}>{dateToTimeString(termin.starttime)}</Button>
                })}
            </div>
            <div className="TerminDate">
                {dateToDateString(anzeigeDate2)}
                {termineTage[1].map((termin) => {
                    return <Button key={praxisID + termin.id} className="ButtonTermin" onClick={() => handleBookAppiontment(termin)}>{dateToTimeString(termin.starttime)}</Button>
                })}
            </div>
            <div className="TerminDate">
                {dateToDateString(anzeigeDate3)}
                {termineTage[2].map((termin) => {
                    return <Button key={praxisID + termin.id} className="ButtonTermin" onClick={() => handleBookAppiontment(termin)}>{dateToTimeString(termin.starttime)}</Button>
                })}
            </div>
            <div className="TerminDate">
                {dateToDateString(anzeigeDate4)}
                {termineTage[3].map((termin) => {
                    return <Button key={praxisID + termin.id} className="ButtonTermin" onClick={() => handleBookAppiontment(termin)}>{dateToTimeString(termin.starttime)}</Button>
                })}
            </div>
            <div className="TerminDate">
                {dateToDateString(anzeigeDate5)}
                {termineTage[4].map((termin) => {
                    return <Button key={praxisID + termin.id} className="ButtonTermin" onClick={() => handleBookAppiontment(termin)}>{dateToTimeString(termin.starttime)}</Button>
                })}
            </div>
            <Button className="ForwardButton" variant="outline-secondary" onClick={handleForwardTermin}><i className="bi bi-arrow-right-short"></i></Button>
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