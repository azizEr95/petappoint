import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { Button } from 'react-bootstrap';
import '../../../../styles/bookingPage.modules.css';
import { useEffect, useState } from 'react';
import { SelectAppointmentType } from '../../../../components/SelectAppointmentType';
import { SelectAnimal } from '../../../../components/SelectAnimal';
import type { AnimalsType, AppointmentsType, VeterinaryPracticesType } from '../../../../../../shared/schemas/ZodSchemas';
import { useQuery } from '@tanstack/react-query';
import { getVeterinaryPracticesById } from '../../../../api/VeterinaryPracticeAPI';
import { getAppointmentsById } from '../../../../api/AppointmentsAPI';

export const Route = createFileRoute('/praxen/$praxisId/booking/$terminId')({
    component: BookingComponent,
});

enum StatusBooking {
    selectTerminArt = "SELECT_TERMIN",
    selectAnimal = "SELECT_ANIMAL",
    booked = "BOOKED"
}

function BookingComponent() {
    const navigate = useNavigate();
    const { praxisId, terminId } = Route.useParams()
    const [selectedTerminArt, setSelectedTerminArt] = useState(""); // ausgewaehlte Terminart, bei leerem String wurde noch ncihts ausgewaehlt
    const [selectedAnimal, setSelectedAnimal] = useState<AnimalsType | null>(null); //aktuell ausgewaehltes Tier, bei null ist keins ausgewaehlt
    const [status, setStatus] = useState<StatusBooking>(StatusBooking.selectTerminArt); //Status im Terminbuchungsprozess, damit wird gesteuert was gerade angezeigt wird

    //Tierarztpraxen laden:
    let praxis: VeterinaryPracticesType | undefined;
    const { isError: isErrorPractice, isSuccess: isSuccessPractice, isPending: isPendingPractice, data: dataPractice } = useQuery<VeterinaryPracticesType>({
        queryKey: ['tierarztpraxen', praxisId],
        queryFn: () => getVeterinaryPracticesById(praxisId),
        retry: false
    })

    //Termine laden:
    let termin: AppointmentsType | undefined;
    const { isError: isErrorAppointment, isSuccess: isSuccessAppointment, isPending: isPendingAppointment, data: dataAppointment } = useQuery<AppointmentsType>({
        queryKey: ['appointment', terminId],
        queryFn: () => getAppointmentsById(terminId),
        retry: false
    })

    useEffect(() => {
        if (isPendingPractice || isPendingAppointment) {
            return;
        }

        if (isErrorPractice || !isSuccessPractice || isErrorAppointment || !isSuccessAppointment) {
            navigate({ "to": "/" });
        }
    }, [isErrorPractice, isSuccessPractice, isPendingPractice, isErrorAppointment, isSuccessAppointment, isPendingAppointment]);

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
        if (selectedAnimal !== null) {
            navigate({ "to": "/appointments" });
        }
    }

    const handleChangeAnimal = (animal: AnimalsType | null) => {
        setSelectedAnimal(animal);
    }

    if (!isSuccessAppointment || !isSuccessPractice) {
        return <></>;
    }

    termin = dataAppointment;
    praxis = dataPractice;
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
                <h5 className="praxisPageText">{praxis.name}</h5>
                <div className="praxisPageText">Ihre Termindetails:</div>
                <div className="praxisPageText">- {praxis.addresses.street}, {praxis.addresses.citycode} {praxis.addresses.city}</div>
                <div className="praxisPageText">- {dateToInfosString(termin.starttime)}</div>
                {selectedTerminArt !== "" && <div className="praxisPageText">- {selectedTerminArt}</div>}
            </div>
        </div>
        {submitButton}
    </div>;
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