import { Button, Modal } from 'react-bootstrap'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { deleteAnimal } from '../../api/AnimalsAPI'
import type { AnimalsType } from 'vetilib-shared/schemas/ZodSchemas'

type AnimalDeleteDialogProps = {
  hideDialogDeleteAnimal: () => void
  animalDelete: AnimalsType
}

// visibility from this component has to be handled from the parent component
export function AnimalDeleteDialog({
  hideDialogDeleteAnimal,
  animalDelete,
}: AnimalDeleteDialogProps) {
  const queryClient = useQueryClient()

  const { mutate: mutateDeleteAnimal } = useMutation({
    mutationFn: (animalId: number) => deleteAnimal(animalId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['animals'] })
    },
  })

  const handleSubmitDeleteAnimal = () => {
    mutateDeleteAnimal(animalDelete.id)
    hideDialogDeleteAnimal()
  }

  return (
    <Modal
      show={true}
      onHide={hideDialogDeleteAnimal}
      className="animal-dialog"
    >
      <Modal.Header closeButton>
        <Modal.Title>Tier {animalDelete.name} löschen</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <div>Willst du dein Tier {animalDelete.name} wirklich löschen?</div>
      </Modal.Body>

      <Modal.Footer>
        <Button variant="secondary" onClick={hideDialogDeleteAnimal} data-testid="animal-cancel-button">
          Abbrechen
        </Button>
        <Button variant="danger" onClick={handleSubmitDeleteAnimal} data-testid="animal-delete-button">
          {animalDelete.name} löschen
        </Button>
      </Modal.Footer>
    </Modal>
  )
}
