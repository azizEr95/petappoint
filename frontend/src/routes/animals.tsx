import { createFileRoute } from '@tanstack/react-router'
import { DashboardPetsSection } from '../components/dashboard/DashboardPetsSection'
import { useLoginContext } from '../LoginContext'
import { useState } from 'react'
import { AnimalEditNewDialog } from '../components/animal/AnimalEditNewDialog'

export const Route = createFileRoute('/animals')({
  component: Animals,
})

function Animals() {
  const [showAnimalDialog, setShowAnimalDialog] = useState(false)
  const [hasAnimals, setHasAnimals] = useState(false)

  const { login } = useLoginContext()
  if (!login) {
    return
  }

  const userId = login.id

  const handleAddPet = () => {
    setShowAnimalDialog(true)
  }

  return (
    <div className="container py-5">
      <h1 className="mb-4">Meine Tiere</h1>
      <div>
        {!hasAnimals ? (
          <></>
        ) : (
          <button
            className="btn btn-primary btn-add-pet"
            onClick={handleAddPet}
          >
            <i className="bi bi-plus-circle"></i> Tier hinzufügen
          </button>
        )}
        <div>
          {showAnimalDialog && (
            <AnimalEditNewDialog
              hideDialogNewAnimal={() => setShowAnimalDialog(false)}
              animalEdit={undefined}
            />
          )}
        </div>
      </div>
      <br />
      <div>
        <DashboardPetsSection 
        userId={userId} 
        onAnimalsLoaded={setHasAnimals}/>
      </div>
    </div>
  )
}
