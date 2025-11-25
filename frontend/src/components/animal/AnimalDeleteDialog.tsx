import { Button, Modal } from "react-bootstrap";
import type { AnimalsType } from "../../../../shared/schemas/ZodSchemas"
import { deleteAnimal } from "../../api/AnimalsAPI";
import { useMutation } from "@tanstack/react-query";


type AnimalDeleteDialogProps = {
    hideDialogDeleteAnimal: () => void,
    animalDelete: AnimalsType
}

// visibility from this component has to be handled from the parent component
export function AnimalDeleteDialog({ hideDialogDeleteAnimal, animalDelete }: AnimalDeleteDialogProps) {

    const { mutate: mutateDeleteAnimal } = useMutation({
        mutationFn: (animalId: number) =>
            deleteAnimal(animalId),
        onError: () => {
            // setErrorText("Fehler beim Erstellen des Tieres");
        },
        onSuccess: () => {
            
        },
    })

    const handleSubmitDeleteAnimal = () => {
        mutateDeleteAnimal(animalDelete.id);
    }

    return <Modal show={true} onHide={hideDialogDeleteAnimal} className="animal-dialog">
        <Modal.Header closeButton>
            <Modal.Title>Tier {animalDelete.name} löschen</Modal.Title>
        </Modal.Header>

        <Modal.Body>
            <div>Willst du dein Tier {animalDelete.name} wirklich löschen?</div>
        </Modal.Body>

        <Modal.Footer>
            <Button variant="secondary" onClick={hideDialogDeleteAnimal}>Abbrechen</Button>
            <Button variant="danger" onClick={handleSubmitDeleteAnimal}>{animalDelete.name} löschen</Button>
        </Modal.Footer>
    </Modal>;
}



