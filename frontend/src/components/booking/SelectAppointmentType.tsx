import { Dropdown } from 'react-bootstrap'
import '../../styles/components/booking/SelectAppointmentType.scss'
import type {
  ServiceType,
  VeterinaryPracticesType,
} from '../../../../shared/schemas/ZodSchemas'

// Props praxis werden spaeter erst benoetigt
type SelectAppointmentTypeProps = {
  praxis: VeterinaryPracticesType
  handleSelectTerminArt: (appointmenType: ServiceType) => void
}

export function SelectAppointmentType({
  praxis,
  handleSelectTerminArt,
}: SelectAppointmentTypeProps) {
  let appointmentServices: Array<ServiceType> = []
  if (praxis.services !== undefined && praxis.services.length !== 0) {
    appointmentServices = praxis.services
  } else {
    // for this practice is no AppointmentType defined, Standardtyp in Backend anlegen
  }

  return (
    <Dropdown.Menu id="terminArtDropdown" show>
      <div className="text-center ueberschrift">Terminart auswählen:</div>
      {appointmentServices.map((appointmenType) => {
        return (
          <Dropdown.Item
            key={appointmenType.id}
            eventKey={appointmenType.id}
            onClick={() => handleSelectTerminArt(appointmenType)}
          >
            {appointmenType.name}
          </Dropdown.Item>
        )
      })}
    </Dropdown.Menu>
  )
}
