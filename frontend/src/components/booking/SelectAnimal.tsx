import { Button } from 'react-bootstrap'
import '../../styles/components/booking/SelectAnimal.scss'
import { useEffect, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { getAnimalsFromUser } from '../../api/AnimalsAPI'
import { AnimalEditNewDialog } from '../animal/AnimalEditNewDialog'
import { AnimalDeleteDialog } from '../animal/AnimalDeleteDialog'
import { useLoginContext } from '../../LoginContext'
import type { AnimalsType } from '../../../../shared/schemas/ZodSchemas'

type SelectAnimalProps = {
  filteredAnimalType: number | undefined
  handleChangeAnimal: (animal: AnimalsType | null) => void
}

export function SelectAnimal({
  handleChangeAnimal,
  filteredAnimalType,
}: SelectAnimalProps) {
  const { login } = useLoginContext()
  const [selectedAnimal, setSelectedAnimal] = useState(-1)
  const [showDialogNewAnimal, setShowDialogNewAnimal] = useState(false)
  const [showDialogEditAnimal, setShowDialogEditAnimal] =
    useState<AnimalsType | null>(null)
  const [showDialogDeleteAnimal, setShowDialogDeleteAnimal] =
    useState<AnimalsType | null>(null)
  const [selectableAnimals, setSelectableAnimals] = useState<
    Array<AnimalsType>
  >([])
  const [notSelectableAnimals, setNotSelectableAnimals] = useState<
    Array<AnimalsType>
  >([])

  if (!login) {
    return
  }

  let animals: Array<AnimalsType> = []
  useEffect(() => {
    if (animals.length > 0) {
      // if selected animal was deleted, change the current selected animal
      const selAnimal = animals.find((animal) => {
        return animal.id === selectedAnimal
      })
      if (selAnimal === undefined && selectedAnimal !== -1) {
        handleChangeAnimal(null)
      }
    }
  }, [animals])

  const userId = login.id
  const { isSuccess, data } = useQuery<Array<AnimalsType>>({
    // for this query is no error handling implemented, if the query fails
    queryKey: ['animals', userId],
    queryFn: () => getAnimalsFromUser(userId),
    retry: false,
  })

  useEffect(() => {
    if (isSuccess && filteredAnimalType !== undefined) {
      const isSelectable = data.filter((x) => {
        return x.animalTypeId === filteredAnimalType
      })
      const isNotSelectable = data.filter((x) => {
        return x.animalTypeId !== filteredAnimalType
      })
      setSelectableAnimals(isSelectable)
      setNotSelectableAnimals(isNotSelectable)
    } else if (isSuccess) {
      setSelectableAnimals(data)
    }
  }, [isSuccess, data, filteredAnimalType])

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
    setShowDialogNewAnimal(false)
  }

  const hideDialogEditAnimal = () => {
    setShowDialogEditAnimal(null)
  }

  const hideDialogDeleteAnimal = () => {
    setShowDialogDeleteAnimal(null)
  }

  const handleAnimalEdit = (
    editAnimal: AnimalsType,
    e: React.MouseEvent<HTMLButtonElement>,
  ) => {
    e.stopPropagation()
    setShowDialogEditAnimal(editAnimal)
  }

  const handleAnimalDelete = (
    deleteAnimal: AnimalsType,
    e: React.MouseEvent<HTMLButtonElement>,
  ) => {
    e.stopPropagation()
    setShowDialogDeleteAnimal(deleteAnimal)
  }

  if (!isSuccess) {
    return null
  }

  animals = data

  return (
    <>
      <div className="select-animal">
        <h5 className="section-title">Tier auswählen:</h5>
        <div className="animal-list">
          {selectableAnimals.map((animal) => (
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
          {notSelectableAnimals.map(
            (
              animal, // should be shown as diabled and not clickable (edit and delete are allowed), animaltype does not matches with the filtered animaltype
            ) => (
              <div key={animal.id} className={`animal-item disabled`}>
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
            ),
          )}
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
      {showDialogNewAnimal && (
        <AnimalEditNewDialog
          hideDialogNewAnimal={hideDialogNewAnimal}
          animalEdit={undefined}
        />
      )}
      {showDialogEditAnimal !== null && (
        <AnimalEditNewDialog
          hideDialogNewAnimal={hideDialogEditAnimal}
          animalEdit={showDialogEditAnimal}
        />
      )}
      {showDialogDeleteAnimal !== null && (
        <AnimalDeleteDialog
          hideDialogDeleteAnimal={hideDialogDeleteAnimal}
          animalDelete={showDialogDeleteAnimal}
        />
      )}
    </>
  )
}
