import { createFileRoute, useNavigate, useRouterState } from '@tanstack/react-router';
import { Button } from 'react-bootstrap';
import '../../../../styles/bookingPage.modules.css';
import { useState } from 'react';
import { SelectAppointmentType } from '../../../../components/SelectAppointmentType';
import { SelectAnimal } from '../../../../components/SelectAnimal';
import type { AnimalsType, AppointmentsType } from '../../../../../../shared/schemas/ZodSchemas';

export const Route = createFileRoute('/praxen/$praxisId/booking/$terminId')({
    component: BookingComponent,
});

enum StatusBooking {
    selectTerminArt = "SELECT_TERMIN",
    selectAnimal = "SELECT_ANIMAL",
    booked = "BOOKED"
}

function BookingComponent() {
    const routerState = useRouterState();
    const navigate = useNavigate();
    //const { terminId } = Route.useParams()
    const [selectedTerminArt, setSelectedTerminArt] = useState(""); // ausgewaehlte Terminart, bei leerem String wurde noch ncihts ausgewaehlt
    const [selectedAnimal, setSelectedAnimal] = useState<AnimalsType | null>(null); //aktuell ausgewaehltes Tier, bei null ist keins ausgewaehlt
    const [status, setStatus] = useState<StatusBooking>(StatusBooking.selectTerminArt); //Status im Terminbuchungsprozess, damit wird gesteuert was gerade angezeigt wird

    const termin = routerState.location.state.termin;

    if (termin === undefined) {
        //Termin mit Backendabfrage laden (weil direkter Zugriff auf URL)
    }

    //Daten der Praxis abfragen, damit diese angezeigt werden koennen, endpoint wird dazu benoetigt (folgt spaeter)
    //const praxis = undefined;

    const handleClickBack = () => {
        //einmal auf der seite zurueck
        switch (status) {
            case StatusBooking.selectTerminArt:
                setSelectedTerminArt("");
                window.history.back();
                break;
            case StatusBooking.selectAnimal:
                setSelectedTerminArt("");
                setStatus(StatusBooking.selectTerminArt);
                break;
            default:
                setSelectedTerminArt("");
                setStatus(StatusBooking.selectTerminArt);
        }
    }

    const handleSelectTerminArt = (art: string) => { //wird an Select
        setSelectedTerminArt(art);
        setStatus(StatusBooking.selectAnimal);
    }

    const handleBookAppoinment = (termin: AppointmentsType) => {
        //hier Termin erstellen, Anfrage an Backend senden
        //TierID zu Termin hinzufuegen + weitere Infos mitschicken(Terminart??)
        console.log(termin);
        if (selectedAnimal !== null) {
            navigate({ "to": "/appointments" }); //eigentlich zur Page navigieren wo alle Termine angezeigt werden
        }
    }

    const handleChangeAnimal = (animal: AnimalsType | null) => {
        setSelectedAnimal(animal);
    }

    if (termin !== undefined) {
        let aktuelleAnzeige;
        let submitButton;
        switch (status) {
            case StatusBooking.selectTerminArt:
                aktuelleAnzeige = <SelectAppointmentType handleSelectTerminArt={handleSelectTerminArt} />; /* spater praxis hier uebergeben */
                submitButton = null;
                break;
            case StatusBooking.selectAnimal:
                aktuelleAnzeige = <SelectAnimal handleChangeAnimal={handleChangeAnimal} />;
                submitButton = <Button id="bookAppointment" onClick={() => handleBookAppoinment(termin)}>Terminbuchung bestätigen</Button>
                break;
            default:
                aktuelleAnzeige = <SelectAppointmentType handleSelectTerminArt={handleSelectTerminArt} />; /* spater praxis hier uebergeben */
                submitButton = null;
        }

        return <div id="BookingPage" className=''>

            <Button id="BackButtonBookingPage" className="backButton" variant='success' onClick={handleClickBack}><i className="bi bi-arrow-left"></i></Button>
            <div className='text-center'>Termin buchen</div>
            <div id="BookingAuswahlInfos">
                {aktuelleAnzeige}

                <div id='TerminInfosUebersicht' className="card card-body">
                    <h5 className="praxisPageText">Praxisname und Arztname</h5>
                    <div className="praxisPageText">Ihre Termindetails:</div>
                    <div className="praxisPageText">- Straße Hausnr,PLZ Stadt</div>
                    <div className="praxisPageText">- {dateToInfosString(termin.starttime)}</div>
                    {selectedTerminArt !== "" && <div className="praxisPageText">- {selectedTerminArt}</div>}
                </div>
            </div>
            {submitButton}
        </div>;
    } else {
        return <div className='text-center'>direkter Zugriff auf Terminbuchung, zusaetzlicher API Aufruf notig, Feature folgt noch</div>;
    }
}


/**
 * gibt die Uhrzeit des Datum Objekts als schoen formatierten String zurueck 
 */
function dateToInfosString(date: Date): string {
    const options: Intl.DateTimeFormatOptions = { //Typ ist noetig damit kein Fehler kommt
        weekday: "long",
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
    };

    const datum = date.toLocaleDateString("de-DE", options);
    const zeit = date.toLocaleTimeString("de-DE", { hour: "2-digit", minute: "2-digit" });
    return datum + " " + zeit;
}