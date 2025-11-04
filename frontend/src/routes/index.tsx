import { createFileRoute } from '@tanstack/react-router'
import 'bootstrap/dist/css/bootstrap.min.css'
import { Search } from '../components/Search'
import { VeterinaryPraticeList } from '../components/VeterinaryPraticeList'
import {useState, type JSX } from 'react'

export const Route = createFileRoute('/')({
  component: App,
})


function App() {
  let [praxisList, setPraxisList] = useState<JSX.Element | null>(null);

  const handleSearch = () => {
    setPraxisList(<VeterinaryPraticeList />);
  }


  return (
    <div className='background-green'>
      <div className="text-center">vetlib</div>
      <Search search={handleSearch}/>
      {praxisList}
    </div>

  )
}
