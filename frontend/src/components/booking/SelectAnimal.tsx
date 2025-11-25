import { Button } from 'react-bootstrap'
import '../../styles/components/booking/SelectAnimal.scss'
import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { getAnimalsFromUser } from '../../api/AnimalsAPI'
import type { AnimalsType } from '../../../../shared/schemas/ZodSchemas'
import { AnimalEditNewDialog } from '../animal/AnimalEditNewDialog'
import { AnimalDeleteDialog } from '../animal/AnimalDeleteDialog'

type SelectAnimalProps = {
    handleChangeAnimal: (animal: AnimalsType | null) => void
}

export function SelectAnimal({ handleChangeAnimal }: SelectAnimalProps) {
    const [selectedAnimal, setSelectedAnimal] = useState(-1);
    const [showDialogNewAnimal, setShowDialogNewAnimal] = useState(false);
    const [showDialogEditAnimal, setShowDialogEditAnimal] = useState<AnimalsType | null>(null);
    const [showDialogDeleteAnimal, setShowDialogDeleteAnimal] = useState<AnimalsType | null>(null);

    const userId = 6; // for user with ID 6, to be changed...
    const { isSuccess, isPending, data } = useQuery<Array<AnimalsType>>({ // for this query is no error handling implemented, if the query fails
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
            handleChangeAnimal(animal)
        }
    }

    const hideDialogNewAnimal = () => {
        setShowDialogNewAnimal(false);
    }

    const hideDialogEditAnimal = () => {
        setShowDialogEditAnimal(null);
    }

    const hideDialogDeleteAnimal = () => {
        setShowDialogDeleteAnimal(null);
    }

    const handleAnimalEdit = (editAnimal: AnimalsType, e: React.MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation();
        setShowDialogEditAnimal(editAnimal);
    }

    const handleAnimalDelete = (deleteAnimal: AnimalsType, e: React.MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation();
        setShowDialogDeleteAnimal(deleteAnimal);
    }

    if (!isSuccess) {
        return null
    }

    let animals = data;

    // if selected animal was deleted, change the current selected animal
    let selAnimal = animals.find((animal)=> {
        return animal.id === selectedAnimal
    })
    if(selAnimal === undefined && selectedAnimal !== -1){
        handleChangeAnimal(null);
    }

    return (
        <>
            <div className="select-animal">
                <h5 className="section-title">Tier auswählen:</h5>
                <div className="animal-list">
                    {animals.map((animal) => (
                        <div
                            key={animal.id}
                            className={`animal-item ${selectedAnimal === animal.id ? 'selected' : ''}`}
                            onClick={() => handleSelectAnimal(animal)}
                        >
                            <div className="animal-name">{animal.name}</div>
                            <button
                                className="edit-button"
                                onClick={(e) => handleAnimalEdit(animal, e)}
                            >
                                <i className="bi bi-pencil-fill"></i>
                            </button>
                            <button
                                className="delete-button"
                                onClick={(e) => handleAnimalDelete(animal, e)}
                            >
                                <i className="bi bi-trash3"></i>
                            </button>
                        </div>
                    ))}
                </div>
                <Button
                    id="NewAnimalButtonBookingPage"
                    variant="outline-success"
                    onClick={() => setShowDialogNewAnimal(true)}
                    className="new-animal-button"
                >
                    <i className="bi bi-plus-circle me-2"></i>
                    Neues Tier anlegen
                </Button>
            </div>
            {showDialogNewAnimal && <AnimalEditNewDialog hideDialogNewAnimal={hideDialogNewAnimal} animalEdit={undefined}/>}
            {showDialogEditAnimal !== null && <AnimalEditNewDialog hideDialogNewAnimal={hideDialogEditAnimal} animalEdit={showDialogEditAnimal}/>}
            {showDialogDeleteAnimal !== null && <AnimalDeleteDialog hideDialogDeleteAnimal={hideDialogDeleteAnimal} animalDelete={showDialogDeleteAnimal} />}
        </>
    )
}
