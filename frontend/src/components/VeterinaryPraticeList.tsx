import { useQuery } from '@tanstack/react-query'
import { getAllVeterinaryPratice } from '../api/VeterinaryPractice' 
import { VeterinaryPraticeCard } from './VeterinaryPraticeCard'
import type { veterinarypracticesType } from '../types/schemas/models/veterinarypractices.schema'



//noch aendern, soll typn automatisch importieren!!
export type Praxis = {
  id: number
  name: string
  phone: string
  infoemail: string
  email: string
  password: string
  website: string
  info: string
  fkAdresse: number
}

export function VeterinaryPraticeList() {
  //const queryClient = useQueryClient() //wird fuer useMutation benoetigt

  const { isPending, isError, isSuccess, data, error } = useQuery<veterinarypracticesType[]>({
    queryKey: ['tierarztpraxen'],
    queryFn: getAllVeterinaryPratice,
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
    return (
      <div id="VeterinaryPracticeList">
        {data.map((praxis) => {
          return <VeterinaryPraticeCard key={praxis.id} praxis={praxis} />
        })}
      </div>
    )
  }
}
