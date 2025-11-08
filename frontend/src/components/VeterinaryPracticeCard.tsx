import type { VeterinaryPracticesType } from '../../../shared/schemas/ZodSchemas';
import '../styles/veterinaryPracticeCard.modules.css';


type VeterinaryPracticeCardProps = {
    praxis: VeterinaryPracticesType
}

export function VeterinaryPracticeCard({ praxis }: VeterinaryPracticeCardProps) {

    return (
        <div id={"" + praxis.id} className="card card-body">
            <h5 className="card-title">{praxis.name}</h5>
            <div className="card-text">{praxis.info}</div>
            {/* <div className="card-text">{praxis.addresses.street}</div>
            <div className="card-text">{praxis.addresses.citycode} {praxis.addresses.city}</div>
            <div className="card-text">{praxis.addresses.country}</div> */}
            <div className="card-text">Telefon: {praxis.phone}</div>
            <div className="card-text">E-Mail: {praxis.infoemail}</div>
            <div className="card-text">{praxis.website}</div>
        </div>
    )
}