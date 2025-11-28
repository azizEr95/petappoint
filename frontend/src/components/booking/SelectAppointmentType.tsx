import '../../styles/components/booking/SelectAppointmentType.scss'
import type {
  AppointmentsType,
  ServiceType,
  VeterinaryPracticesType,
} from '../../../../shared/schemas/ZodSchemas'
import { useQuery } from '@tanstack/react-query'
import { getServicesFromPractice } from '../../api/ServicesAPI'
import { useEffect, useState } from 'react'

type SelectAppointmentTypeProps = {
  practice: VeterinaryPracticesType
  appointment: AppointmentsType
  handleSelectTerminArt: (appointmenType: ServiceType) => void
  filterServices: ServiceType[] | null
}

export function SelectAppointmentType({
  practice,
  appointment,
  handleSelectTerminArt,
  filterServices // not all services are shwon if an filter was selected before
}: SelectAppointmentTypeProps) {
  const [appointmentServices, setAppointmentServices] = useState<Array<ServiceType>>([]);

  const {isSuccess: isSuccessServices, data: dataServices} = useQuery<ServiceType[]>({
    queryKey: ['service', practice.id],
    queryFn: () => getServicesFromPractice(practice.id.toString()), // TODO: to be changed, is now frm the practice should be from the veterinary
    retry: false,
  })

  useEffect(() => {
    if(filterServices === null || filterServices.length === 0){
      if (appointment.availableservices !== undefined && appointment.availableservices.length !== 0) {
        setAppointmentServices(appointment.availableservices);
      } else if (appointmentServices.length === 0){ // if availableServices is empty, this appointment have every servicetype from the practice
        if(isSuccessServices){
          setAppointmentServices(dataServices);
        }
      }
    } else {
      setAppointmentServices(filterServices);
    }
  },[isSuccessServices, dataServices])
  
  
  console.log(appointmentServices)
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
