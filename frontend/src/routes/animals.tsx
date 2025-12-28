import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { DashboardPetsSection } from '../components/dashboard/DashboardPetsSection'
import { useLoginContext } from '../LoginContext'
import { AnimalEditNewDialog } from '../components/animal/AnimalEditNewDialog'
import { isLoggedInAndVerified } from '../utils/Authentication'

export const Route = createFileRoute('/animals')({
  component: Animals,
})

function Animals() {
  const [showAnimalDialog, setShowAnimalDialog] = useState(false)
  const [hasAnimals, setHasAnimals] = useState(false)
  const { login } = useLoginContext()
  const navigate = useNavigate()
  
  useEffect(() => {
    if (!isLoggedInAndVerified(login)) {
      navigate({
        to: '/login',
        search: {
          redirect: '/animals',
        },
      })
    }
  }, [login])

  const userId = login ? login.id : -1; // userId is always !== -1

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
            data-testid="add-animal"
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
