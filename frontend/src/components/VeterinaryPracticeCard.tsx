import type { VeterinaryPracticesType } from '../../../shared/schemas/ZodSchemas';
import '../styles/veterinaryPracticeCard.modules.css';
import { NextAvailableAppointments } from './NextAvailableAppointments';
import { type MouseEvent } from 'react';
import { useNavigate } from '@tanstack/react-router';


type VeterinaryPracticeCardProps = {
    praxis: VeterinaryPracticesType
}

export function VeterinaryPracticeCard({ praxis }: VeterinaryPracticeCardProps) {
    const navigate = useNavigate();

    const openPraxisPage = (e: MouseEvent<HTMLDivElement>) => {
        e.preventDefault();
        navigate({
            to: "/praxen/$praxisId",
            params: {
                praxisId: praxis.id.toString()
            },
            state: {
                praxis: praxis
            }
        })
    }

    return <div id={"" + praxis.id} className="card card-body" >
        <div id='PraxisInfos' onClick={openPraxisPage}>
            <h5 className="card-title">{praxis.name}</h5>
            <div className="card-text">{praxis.info}</div>
            <div className="card-text">{praxis.addresses.street}</div>
            <div className="card-text">{praxis.addresses.citycode} {praxis.addresses.city}</div>
            <div className="card-text">{praxis.addresses.country}</div>
            <div className="card-text">Telefon: {praxis.phone}</div>
            <div className="card-text">E-Mail: {praxis.infoemail}</div>
            <div className="card-text">{praxis.website}</div>
        </div>
        <div id='TerminInfos' className='flex-row'>
            <NextAvailableAppointments praxisID={praxis.id}></NextAvailableAppointments>
        </div>
    </div>
}