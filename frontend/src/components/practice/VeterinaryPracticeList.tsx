import { useQuery } from '@tanstack/react-query'
import { getVeterinaryPracticesByNameAddress } from '../../api/VeterinaryPracticeAPI'
import { VeterinaryPracticeCard } from './VeterinaryPracticeCard'
import type { AppointmentFilterType, VeterinaryPracticesType } from '../../../../shared/schemas/ZodSchemas'

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

  const { isSuccess, data } = useQuery<
    Array<VeterinaryPracticesType>
  >({
    queryKey: ['tierarztpraxen', searchName, searchOrt],
    queryFn: () => getVeterinaryPracticesByNameAddress({name: searchName, address: searchOrt, filter: {
      animalTypeIds: [],
      serviceTypeIds: []
    }}),
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

  if (isSuccess) {

    if (data.length !== 0) {
      return (
        <div id="VeterinaryPracticeList">
          {data.map((praxis) => {
            return <VeterinaryPracticeCard key={praxis.id} praxis={praxis} filterOptions={filterOptions} />
          })}
        </div>
      )
    } else {
      return <div>Keine Suchergebnisse gefunden</div>
    }
  } else {
    return <div>Keine Suchergebnisse gefunden</div>
  }
}
