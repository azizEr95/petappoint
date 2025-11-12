import { Dropdown } from "react-bootstrap"
import '../styles/selectAppointmentType.modules.css';

//Props praxis werden spaeter erst benoetigt
type SelectAppointmentTypeProps = { 
    //praxis: VeterinaryPracticesType
    handleSelectTerminArt: (art: string) => void
}


export function SelectAppointmentType({handleSelectTerminArt}: SelectAppointmentTypeProps) {

    //erstmal zum testen
    let terminArten = ["Untersuchung", "Impfung", "Notfall"];
    //spaeter Terminarten von Backend abrufen, koennen pro Praxis unetrsschiedlich sein

    return <Dropdown.Menu id="terminArtDropdown" show>
        <div className='text-center ueberschrift'>Terminart auswählen:</div>
        {terminArten.map((art) => {
            return <Dropdown.Item key={art} eventKey={art} onClick={() => handleSelectTerminArt(art)}>{art}</Dropdown.Item>
        })}
    </Dropdown.Menu>;
}