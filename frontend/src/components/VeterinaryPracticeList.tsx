import { useQuery } from '@tanstack/react-query'
import { getVeterinaryPracticesByNameAddress } from '../api/VeterinaryPracticeAPI'
import { VeterinaryPracticeCard } from './VeterinaryPracticeCard'
import type { VeterinaryPracticesType } from '../../../shared/schemas/ZodSchemas'

type VeterinaryPracticeListProps = {
  searchName: string,
  searchOrt: string
}

export function VeterinaryPracticeList({ searchName, searchOrt }: VeterinaryPracticeListProps) {

  //const queryClient = useQueryClient() //wird fuer useMutation benoetigt

  const { isPending, isError, isSuccess, data, error } = useQuery<VeterinaryPracticesType[]>({
    queryKey: ['tierarztpraxen', searchName, searchOrt],
    queryFn: () => getVeterinaryPracticesByNameAddress(searchName, searchOrt)
  })

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
            return <VeterinaryPracticeCard key={praxis.id} praxis={praxis}/>
          })}
        </div>
      )
    } else {
      //return <Link to="/praxen/$praxisId" params={{praxisId: "123"}}>click</Link>
      return <div>Keine Suchergebnisse gefunden</div>
    }
  }
}
