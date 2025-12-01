import { useQuery } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import '../../styles/components/booking/SelectAppointmentType.scss'
import { getServicesFromPractice } from '../../api/ServicesAPI'
import type {AppointmentsType, ServiceType, VeterinaryPracticesType,} from '../../../../shared/schemas/ZodSchemas'


type SelectAppointmentTypeProps = {
  practice: VeterinaryPracticesType
  appointment: AppointmentsType
  handleSelectTerminArt: (appointmenType: ServiceType) => void
  foundFilterServices: Array<ServiceType> | null
  notFoundFilterServices: Array<ServiceType> | null
}

export function SelectAppointmentType({
  practice,
  appointment,
  handleSelectTerminArt,
  foundFilterServices, // not all services are shwon if an filter was selected before
  notFoundFilterServices
}: SelectAppointmentTypeProps) {
  const [appointmentServices, setAppointmentServices] = useState<Array<ServiceType>>([]);
  const [notAppointmentServices, setNotAppointmentServices] = useState<Array<ServiceType>>([]);

  const { isError: isErrorServices, isSuccess: isSuccessServices, data: dataServices} = useQuery<Array<ServiceType>>({
    queryKey: ['service', practice.id],
    queryFn: () => getServicesFromPractice(practice.id.toString()), // TODO: to be changed, is now frm the practice should be from the veterinary
    retry: false,
  })

  useEffect(() => {
    if(foundFilterServices === null || foundFilterServices.length === 0){
      if (appointment.availableservices.length !== 0) {
        setAppointmentServices(appointment.availableservices);
      } else if (appointmentServices.length === 0){ // if availableServices is empty, this appointment have every servicetype from the practice
        if(isSuccessServices){
          setAppointmentServices(dataServices);
        }
        if(isErrorServices){
          console.log("Keine Behandlungen zur Auswahl: Fehler beim Abfragen der Behandlungen")
        }
      }
    } else {
      setAppointmentServices(foundFilterServices);
    }
  },[isSuccessServices, dataServices, isErrorServices]);

  useEffect(() => {
    if(notFoundFilterServices === null || notFoundFilterServices.length === 0){
      setNotAppointmentServices([]);
    } else {
      setNotAppointmentServices(notFoundFilterServices);
    }
  },[]);
  
  return (
    <div className="select-appointment-type">
      <h5 className="section-title">Behandlung auswählen:</h5>
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
        {notAppointmentServices.map((appointmenType) => (
          <button
            key={appointmenType.id}
            className="service-item"
            disabled
          >
            {appointmenType.name}
          </button>
        ))}
      </div>
    </div>
  )
}
