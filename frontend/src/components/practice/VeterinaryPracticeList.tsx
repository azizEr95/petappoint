import { useQuery } from '@tanstack/react-query'
import { getVeterinaryPracticesByNameAddress } from '../../api/VeterinaryPracticeAPI'
import { VeterinaryPracticeCard } from './VeterinaryPracticeCard'
import type { AppointmentFilterType, ServiceType, VeterinaryPracticesType } from '../../../../shared/schemas/ZodSchemas'
import { getServicesFromPractice } from '../../api/ServicesAPI'

type VeterinaryPracticeListProps = {
  searchName: string
  searchOrt: string
  filterOptions: AppointmentFilterType
}

export function VeterinaryPracticeList({
  searchName,
  searchOrt,
  filterOptions
}: VeterinaryPracticeListProps) {
  // const queryClient = useQueryClient() //wird fuer useMutation benoetigt

  const { isPending, isError, isSuccess, data, error } = useQuery<
    Array<VeterinaryPracticesType>
  >({
    queryKey: ['tierarztpraxen', searchName, searchOrt],
    queryFn: () => getVeterinaryPracticesByNameAddress(searchName, searchOrt),
  })

  // const {
  //   isError: isErrorServices,
  //   isSuccess: isSuccessServices,
  //   data: dataServices,
  // } = useQuery<ServiceType[]>({
  //   queryKey: ['service'],
  //   queryFn: ({practiceID}:string) => getServicesFromPractice(practiceID),
  //   retry: false,
  // })

  if (isPending) {
    console.log('pending')
    return <div>Tierarztpraxen laden</div>
  }

  if (isError) {
    console.log('error')
    return <div>Error beim Laden der Tierarztpraxen: {error.message}</div>
  }

  if (isSuccess) {
    console.log('success')
    console.log(data)
    if (data.length !== 0) {
      return (
        <div id="VeterinaryPracticeList">
          {data.map((praxis) => {
            return <VeterinaryPracticeCard key={praxis.id} praxis={praxis} filterOptions={filterOptions}/>
          })}
        </div>
      )
    } else {
      return <div>Keine Suchergebnisse gefunden</div>
    }
  }
}
