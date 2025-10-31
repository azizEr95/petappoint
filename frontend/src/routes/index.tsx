import { createFileRoute } from '@tanstack/react-router'
import 'bootstrap/dist/css/bootstrap.min.css'
import { Search } from '../components/Search'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { VeterinaryPraticeList } from '../components/VeterinaryPraticeList'

export const Route = createFileRoute('/')({
  component: App,
})


function App() {

  return (
    <div className='background-green'>
      <div className="text-center">vetlib</div>
      <Search />
      <div id="veterinarypraticeList">
        <VeterinaryPraticeList></VeterinaryPraticeList>
      </div>
    </div>
  )
}
