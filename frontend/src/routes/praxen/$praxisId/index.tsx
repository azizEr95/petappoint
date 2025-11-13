import { createFileRoute, useNavigate, useRouterState } from '@tanstack/react-router'
import { NextAvailableAppointments } from '../../../components/NextAvailableAppointments'
import '../../../styles/praxisPage.modules.css';
import { Button } from 'react-bootstrap';
import { useQuery } from '@tanstack/react-query';
import type { VeterinaryPracticesType } from '../../../../../shared/schemas/ZodSchemas';
import { getVeterinaryPracticesById } from '../../../api/VeterinaryPracticeAPI'

export const Route = createFileRoute('/praxen/$praxisId/')({
    component: VeterinaryPractice,
})

function VeterinaryPractice() {
    const routerState = useRouterState();
    const { praxisId } = Route.useParams();

    let praxis = routerState.location.state.praxis;

    //Tierarztpraxis laden:
    const { isError, isSuccess, data } = useQuery<VeterinaryPracticesType>({
        queryKey: ['tierarztpraxen', praxisId],
        queryFn: () => getVeterinaryPracticesById(praxisId)
    })

    if (isSuccess) {
        praxis = data;
    }

    if (isError) {
        praxis = undefined;
    }


    const handleClickBack = () => {
        window.history.back();
    }

    if (praxis !== undefined) {
        return <div id="PraxisPage" className='flex-column'>
            <Button className="backButton" variant='success' onClick={handleClickBack}><i className="bi bi-arrow-left"></i></Button>
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
        //hier Fehler passiert, was anzeigen!?
        return <div>Praxis auf PraxisPage undefined</div>
    }
}
