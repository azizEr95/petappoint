import { Button } from 'react-bootstrap'
import '../../styles/components/booking/SelectAnimal.scss'
import { useEffect, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { getAnimalsFromUser } from '../../api/AnimalsAPI'
import { AnimalEditNewDialog } from '../animal/AnimalEditNewDialog'
import { AnimalDeleteDialog } from '../animal/AnimalDeleteDialog'
import { useLoginContext } from '../../LoginContext'
import { getAllAnimalTypes } from '../../api/AnimalTypeAPI'
import type { AnimalTypeType, AnimalsType } from 'vetilib-shared/schemas/ZodSchemas'

type SelectAnimalProps = {
  filteredAnimalTypeId: Array<number>
  handleChangeAnimal: (animal: AnimalsType | null) => void
}

export function SelectAnimal({
  handleChangeAnimal,
  filteredAnimalTypeId,
}: SelectAnimalProps) {
  const { login } = useLoginContext()
  const [selectedAnimal, setSelectedAnimal] = useState(-1)
  const [showDialogNewAnimal, setShowDialogNewAnimal] = useState(false)
  const [filterAnimalType, setFilterAnimalType] = useState<Array<AnimalTypeType> | undefined>(undefined)
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

  const userId = login ? login.id : undefined
  const { isSuccess: isSuccessAnimalUser, data: dataAnimalUser } = useQuery<Array<AnimalsType>>({
    // for this query is no error handling implemented, if the query fails
    queryKey: ['animals', userId],
    queryFn: () => getAnimalsFromUser(userId ?? -1), // always defined if enabled
    retry: false,
    enabled: userId !== undefined && login && login.role === "person", // only get animals if the user is logged in
  })

  // get all Animaltypes
  const { isSuccess: isSuccessAnimalType, data: dataAnimalType } = useQuery<
    Array<AnimalTypeType>
  >({
    queryKey: ['allAnimalTypes'],
    queryFn: () => getAllAnimalTypes(undefined),
    retry: false,
  })

  useEffect(() => {
    if (isSuccessAnimalType) {
      const x = dataAnimalType.filter((animalType) => {
        const foundAnimalType = filteredAnimalTypeId.find((y) => {
          if (animalType.id === y) {
            return true
          }
        })
        if (foundAnimalType !== undefined) {
          return true
        } else {
          return false
        }
      })
      setFilterAnimalType(x);
    }
  }, [isSuccessAnimalType, dataAnimalType, filteredAnimalTypeId])

  useEffect(() => {
    if (isSuccessAnimalUser) {
      // If no filter, all animals are selectable
      if (filteredAnimalTypeId.length === 0) {
        setSelectableAnimals(dataAnimalUser)
        setNotSelectableAnimals([])
        return
      }

      const isSelectable = dataAnimalUser.filter((x) => {
        const foundSelect = filteredAnimalTypeId.find((y) => {
          if (x.animalTypeId === y) {
            return true
          }
        })
        if (foundSelect !== undefined) {
          return true
        } else {
          return false
        }
      })
      const isNotSelectable = dataAnimalUser.filter((x) => {
        const notFoundSelect = filteredAnimalTypeId.find((y) => {
          if (x.animalTypeId === y) {
            return true
          }
        })
        if (notFoundSelect !== undefined) {
          return false
        } else {
          return true
        }
      })
      setSelectableAnimals(isSelectable)
      setNotSelectableAnimals(isNotSelectable)
    }
  }, [isSuccessAnimalUser, dataAnimalUser, filteredAnimalTypeId])

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

  if (!isSuccessAnimalUser) {
    return null
  }

  animals = dataAnimalUser

  let animaltypesString = ""
  for (const type of filterAnimalType ?? []) {
    if (animaltypesString !== "") {
      animaltypesString = animaltypesString + ", "
    }
    animaltypesString = animaltypesString + type.name
  }

  return (
    <>
      <div className="select-animal">
        <h5 className="section-title">Tier auswählen:</h5>
        <div className='animaltypes-string'>({animaltypesString})</div>
        <div className="animal-list">
          {selectableAnimals.map((animal) => (
            <div
              key={animal.id}
              className={`animal-item ${selectedAnimal === animal.id ? 'selected' : ''}`}
              onClick={() => handleSelectAnimal(animal)}
            >
              <div className="animal-name">{animal.name}</div>
              <div className="action-buttons" onClick={(e) => e.stopPropagation()}>
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
            </div>
          ))}
          {notSelectableAnimals.map(
            (
              animal,
            ) => (
              <div key={animal.id} className={`animal-item disabled`} aria-disabled={true}>
                <div className="animal-name">{animal.name}</div>
                <div className="action-buttons" onClick={(e) => e.stopPropagation()}>
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
