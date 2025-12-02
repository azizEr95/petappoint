import { useQuery } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import '../../styles/components/booking/SelectAppointmentType.scss'
import { getServicesFromPractice } from '../../api/ServicesAPI'
import type {
  AppointmentsType,
  ServiceType,
  VeterinaryPracticesType,
} from '../../../../shared/schemas/ZodSchemas'

type SelectAppointmentTypeProps = {
  practice: VeterinaryPracticesType
  appointment: AppointmentsType
  handleSelectAppointmentType: (appointmentType: ServiceType) => void
  foundFilterServices: Array<ServiceType> | null
  notFoundFilterServices: Array<ServiceType> | null
}

export function SelectAppointmentType({
  practice,
  appointment,
  handleSelectAppointmentType,
  foundFilterServices, // not all services are shown if an filter was selected before
  notFoundFilterServices,
}: SelectAppointmentTypeProps) {
  const [appointmentServices, setAppointmentServices] = useState<
    Array<ServiceType>
  >([])
  const [notAppointmentServices, setNotAppointmentServices] = useState<
    Array<ServiceType>
  >([])

  const {
    isError: isErrorServices,
    isSuccess: isSuccessServices,
    data: dataServices,
  } = useQuery<Array<ServiceType>>({
    queryKey: ['service', practice.id],
    queryFn: () => getServicesFromPractice(practice.id.toString()), // TODO: to be changed, is now from the practice should be from the veterinary
    retry: false,
  })

  useEffect(() => {
    if (foundFilterServices === null || foundFilterServices.length === 0) {
      if (appointment.availableServices.length !== 0) {
        setAppointmentServices(appointment.availableServices)
      } else if (appointmentServices.length === 0) {
        // if availableServices is empty, this appointment have every servicetype from the practice
        if (isSuccessServices) {
          setAppointmentServices(dataServices)
        }
        if (isErrorServices) {
          console.log(
            'Keine Behandlungen zur Auswahl: Fehler beim Abfragen der Behandlungen',
          )
        }
      }
    } else {
      setAppointmentServices(foundFilterServices)
    }
  }, [isSuccessServices, dataServices, isErrorServices])

  useEffect(() => {
    if (
      notFoundFilterServices === null ||
      notFoundFilterServices.length === 0
    ) {
      setNotAppointmentServices([])
    } else {
      setNotAppointmentServices(notFoundFilterServices)
    }
  }, [])

  return (
    <div className="select-appointment-type">
      <h5 className="section-title">Behandlung auswählen:</h5>
      <div className="service-list">
        {appointmentServices.map((appointmentType) => (
          <button
            key={appointmentType.id}
            className="service-item"
            onClick={() => handleSelectAppointmentType(appointmentType)}
          >
            {appointmentType.name}
          </button>
        ))}
        {notAppointmentServices.map((appointmentType) => (
          <button key={appointmentType.id} className="service-item" disabled>
            {appointmentType.name}
          </button>
        ))}
      </div>
    </div>
  )
}
