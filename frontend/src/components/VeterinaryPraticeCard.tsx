import '../styles/veterinaryPracticeCard.modules.css';
import type { veterinarypracticesType } from "../types/schemas/models/veterinarypractices.schema";

type VeterinaryPraticeCardProps = {
    praxis: veterinarypracticesType
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