import type { Praxis } from "./VeterinaryPraticeList"
import '../styles/veterinaryPracticeCard.modules.css';

type VeterinaryPraticeCardProps = {
    praxis: Praxis
}


export function VeterinaryPraticeCard({ praxis }: VeterinaryPraticeCardProps) {


    return (
        <div id={"" + praxis.id} className="card card-body">
            <h5 className="card-title">{praxis.name}</h5>
            <div className="card-text">{praxis.info}</div>
            <div className="card-text">{praxis.website}</div>
            <div className="card-text">Telefon: {praxis.phone}</div>
            <div className="card-text">E-Mail: {praxis.infoemail}</div>
        </div>
    )
}