import { Form } from "react-bootstrap"
import '../styles/selectAnimal.modules.css';
import type { AnimalsType } from "../../../shared/schemas/ZodSchemas";
import { useState } from "react";

//Props werden spaetr erst benoetigt
type SelectAnimalProps = {
    handleChangeAnimal: (animal: AnimalsType | null) => void
}


export function SelectAnimal({handleChangeAnimal}: SelectAnimalProps) {
    const [selectedAnimal, setSelectedAnimal] = useState(-1); // -1 bedeutet, das noch kein Tier ausgewaehlt wurde

    //erstmal zum testen
    let animal: AnimalsType[] = [{
        id: 1,
        name: "Katze1"
    },
    {
        id: 2,
        name: "Hund2"
    }];
    //spaeter Tiere von Backend von diesem Besitzer abrufen

    const handleSelectAnimal = (animal: AnimalsType) => {
        if(selectedAnimal === animal.id){
            setSelectedAnimal(-1);
            handleChangeAnimal(null);
        } else {
            setSelectedAnimal(animal.id);
            handleChangeAnimal(animal); // damit BookingComponent auch das ausgewaehlte Tier kennt 
        }
    };

    return <Form id="tierList">
        <div className='text-center ueberschrift'>Tier auswählen:</div>
        {animal.map((animal) => {
            return <div key={"" + animal.id} className="flex-row" onClick={() => handleSelectAnimal(animal)}>
                <Form.Check key={"Form" + animal.id}  className="tierCheckbox" type="checkbox" label={animal.name} checked={animal.id === selectedAnimal} onChange={() => handleSelectAnimal(animal)}/>
                </div>
        })}
    </Form>;
}