import '../../styles/components/booking/SelectAppointmentType.scss'
import type {
  AppointmentsType,
  ServiceType,
  VeterinaryPracticesType,
} from '../../../../shared/schemas/ZodSchemas'

type SelectAppointmentTypeProps = {
  praxis: VeterinaryPracticesType
  appointment: AppointmentsType
  handleSelectTerminArt: (appointmenType: ServiceType) => void
}

export function SelectAppointmentType({
  praxis,
  appointment,
  handleSelectTerminArt,
}: SelectAppointmentTypeProps) {
  let appointmentServices: Array<ServiceType> = []
  if (appointment.availableservices !== undefined && appointment.availableservices.length !== 0) {
    appointmentServices = appointment.availableservices
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
