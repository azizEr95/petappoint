import '../../styles/components/booking/SelectAppointmentType.scss'
import type {
  ServiceType,
  VeterinaryPracticesType,
} from '../../../../shared/schemas/ZodSchemas'

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
  }

  return (
    <div className="select-appointment-type">
      <h5 className="section-title">Terminart auswählen:</h5>
      <div className="service-list">
        {appointmentServices.map((appointmenType) => (
          <button
            key={appointmenType.id}
            className="service-item"
            onClick={() => handleSelectTerminArt(appointmenType)}
          >
            {appointmenType.name}
          </button>
        ))}
      </div>
    </div>
  )
}
