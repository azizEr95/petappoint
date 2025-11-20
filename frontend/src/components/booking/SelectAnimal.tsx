import { Button, Form } from 'react-bootstrap'
import '../../styles/components/booking/SelectAnimal.scss'
import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { getAnimalsFromUser } from '../../api/AnimalsAPI'
import type { AnimalsType } from '../../../../shared/schemas/ZodSchemas'
import { AnimalDialog } from '../AnimalDialog'

type SelectAnimalProps = {
    handleChangeAnimal: (animal: AnimalsType | null) => void
}

export function SelectAnimal({ handleChangeAnimal }: SelectAnimalProps) {
    const [selectedAnimal, setSelectedAnimal] = useState(-1); // -1 means that no animal has been selected yet
    const [showDialogNewAnimal, setShowDialogNewAnimal] = useState(false);
    const [showDialogEditAnimal, setShowDialogEditAnimal] = useState<AnimalsType | null>(null);

    const userId = 6; // for user with ID 6, to be changed...
    const { isSuccess, data } = useQuery<Array<AnimalsType>>({ // for this query is no error handling implemented, if the query fails
        queryKey: ['animals', userId],
        queryFn: () => getAnimalsFromUser(userId),
        retry: false
    });

    const handleSelectAnimal = (animal: AnimalsType) => {
        if (selectedAnimal === animal.id) {
            setSelectedAnimal(-1)
            handleChangeAnimal(null)
        } else {
            setSelectedAnimal(animal.id)
            handleChangeAnimal(animal) // BookingComponent also need to know the selected animal
        }
    }

    const hideDialogNewAnimal = () => {
        setShowDialogNewAnimal(false);
    }

    const hideDialogEditAnimal = () => {
        setShowDialogEditAnimal(null);
    }

    const handleAnimalEdit = (editAnimal: AnimalsType, e: React.MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation(); // stops that if the edit button is clicked this animal is not selected
        setShowDialogEditAnimal(editAnimal);
    }

    if (!isSuccess) {
        return
    }

    const animal = data

    return (<>
        <Form id="tierList">
            <div className="text-center ueberschrift">Tier auswählen:</div>
            {animal.map((animalSelect) => {
                return (
                    <div
                        key={'' + animalSelect.id}
                        className="flex-row"
                        onClick={() => handleSelectAnimal(animalSelect)}
                    >
                        <Form.Check
                            key={'Form' + animalSelect.id}
                            className="tierCheckbox"
                            type="checkbox"
                            label={animalSelect.name}
                            checked={animalSelect.id === selectedAnimal}
                            onChange={() => handleSelectAnimal(animalSelect)}
                        />
                        <Button onClick={(e)=> handleAnimalEdit(animalSelect, e)}><i className="bi bi-pencil-fill"></i></Button>
                    </div>
                )
            })}
            <Button id="NewAnimalButtonBookingPage" variant="outline-success" onClick={() => setShowDialogNewAnimal(true)} className="mb-3">
                <i className="bi bi-plus-circle"></i>
                Neues Tier anlegen
            </Button>
        </Form>
        {showDialogNewAnimal && <AnimalDialog hideDialogNewAnimal={hideDialogNewAnimal} animalEdit={undefined}/>}
        {showDialogEditAnimal !== null && <AnimalDialog hideDialogNewAnimal={hideDialogEditAnimal} animalEdit={showDialogEditAnimal}/>}
    </>
    )
}
