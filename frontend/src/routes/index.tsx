import { createFileRoute } from '@tanstack/react-router'
import 'bootstrap/dist/css/bootstrap.min.css'
import { SearchField } from '../components/SearchField'

export const Route = createFileRoute('/')({
  component: App,
})


function App() {
  
  return (
    <div className='background-green'>
      <div className="text-center">vetlib</div>
      <SearchField searchNameBeginn='' searchOrtBeginn=''/>
      {/* hier sind weitere Inhalte auf der LandingPage */}
    </div>

  )
}
