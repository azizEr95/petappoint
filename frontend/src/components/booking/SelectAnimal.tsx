import { Form } from 'react-bootstrap'
import '../../styles/components/booking/SelectAnimal.scss'
import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { getAnimalsFromUser } from '../../api/AnimalsAPI'
import type { AnimalsType } from '../../../../shared/schemas/ZodSchemas'

type SelectAnimalProps = {
  handleChangeAnimal: (animal: AnimalsType | null) => void
}

export function SelectAnimal({ handleChangeAnimal }: SelectAnimalProps) {
  const [selectedAnimal, setSelectedAnimal] = useState(-1) // -1 means that no animal has been selected yet

  const userId = 6 // for user with ID 6, to be changed...
  const { isSuccess, data } = useQuery<Array<AnimalsType>>({
    // for this query is no error handling implemented, if the query fails
    queryKey: ['animals', userId],
    queryFn: () => getAnimalsFromUser(userId),
    retry: false,
  })

  const handleSelectAnimal = (animal: AnimalsType) => {
    if (selectedAnimal === animal.id) {
      setSelectedAnimal(-1)
      handleChangeAnimal(null)
    } else {
      setSelectedAnimal(animal.id)
      handleChangeAnimal(animal) // BookingComponent also need to know the selected animal
    }
  }

  if (!isSuccess) {
    return
  }

  const animal = data

  return (
    <Form id="tierList">
      <div className="text-center ueberschrift">Tier auswählen:</div>
      {animal.map((animal) => {
        return (
          <div
            key={'' + animal.id}
            className="flex-row"
            onClick={() => handleSelectAnimal(animal)}
          >
            <Form.Check
              key={'Form' + animal.id}
              className="tierCheckbox"
              type="checkbox"
              label={animal.name}
              checked={animal.id === selectedAnimal}
              onChange={() => handleSelectAnimal(animal)}
            />
          </div>
        )
      })}
    </Form>
  )
}
