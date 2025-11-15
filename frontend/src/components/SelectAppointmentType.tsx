import { Dropdown } from 'react-bootstrap'
import '../styles/selectAppointmentType.modules.css'
import type { ServiceType, VeterinaryPracticesType } from '../../../shared/schemas/ZodSchemas'

// Props praxis werden spaeter erst benoetigt
type SelectAppointmentTypeProps = {
  praxis: VeterinaryPracticesType
  handleSelectTerminArt: (art: string) => void
}

export function SelectAppointmentType({praxis, handleSelectTerminArt}: SelectAppointmentTypeProps) {

  let appointmentServices: ServiceType[] = [];
  let appointmentServicesName: string[] = [];
  if(praxis.services !== undefined){
    appointmentServices = praxis.services;
    appointmentServices.forEach((service) => {
      appointmentServicesName.push(service.name)
    })
  } else {
    //wenn es keine Services gibt, StandardService in Datenbank anlegen
    appointmentServicesName = ["Untersuchung"] //nur zum testen
  }
  
  // spaeter Terminarten von Backend abrufen, koennen pro Praxis unetrsschiedlich sein

  return (
    <Dropdown.Menu id="terminArtDropdown" show>
      <div className="text-center ueberschrift">Terminart auswählen:</div>
      {appointmentServicesName.map((art) => {
        return (
          <Dropdown.Item
            key={art}
            eventKey={art}
            onClick={() => handleSelectTerminArt(art)}
          >
            {art}
          </Dropdown.Item>
        )
      })}
    </Dropdown.Menu>
  )
}
