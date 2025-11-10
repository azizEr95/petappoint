import { createFileRoute, useRouterState } from '@tanstack/react-router'
import { NextAvailableAppointments } from '../../components/NextAvailableAppointments'
import '../../styles/praxisPage.modules.css';
import { Button } from 'react-bootstrap';

export const Route = createFileRoute('/praxen/$praxisId')({
  component: VeterinaryPractice,
})

function VeterinaryPractice() {
  const routerState = useRouterState()
  //const { praxisId } = Route.useParams()

  const praxis = routerState.location.state.praxis;

  const handleClickBack = () => {
    //navigate({to: "/"})
    window.history.back();
  }

  if (praxis === undefined) { //falls keine Praxisdaten in State diese neu vom Backend laden, wenn es Praxis nicht gibt auch entsprechend anzeigen
    //... mit useQuery Praxis laden mit ID
    //in Varibale praxis speichern
    //wenn es Praxis nicht gibt 404 oder irgendein anderen Text anzeigen
  }

  if (praxis !== undefined) {
    return <div id="PraxisPage" className='flex-column'>
      <Button id="BackButtonPraxisPage" variant='success' onClick={handleClickBack}><i className="bi bi-arrow-left"></i></Button>
      <div id="PraxisInfosPraxisPage">
        <h5 className="praxisPageText">{praxis.name}</h5>
        <div className="praxisPageText">{praxis.info}</div>
        <div className="praxisPageText">{praxis.addresses.street}</div>
        <div className="praxisPageText">{praxis.addresses.citycode} {praxis.addresses.city}</div>
        <div className="praxisPageText">{praxis.addresses.country}</div>
        <div className="praxisPageText">Telefon: {praxis.phone}</div>
        <div className="praxisPageText">E-Mail: {praxis.infoemail}</div>
        <div className="praxisPageText">{praxis.website}</div>
      </div>
      <div id="TerminInfosPraxisPage" className='flex-row'>
        <NextAvailableAppointments praxisID={praxis.id}></NextAvailableAppointments>
      </div>
    </div>
  } else {
    return <div className='text-center'>direkter Zugriff auf Praxisseite, zusaetzlicher API Aufruf notig, Feature folgt noch</div>
  }

}
