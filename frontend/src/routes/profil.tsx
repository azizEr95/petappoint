import { createFileRoute } from '@tanstack/react-router'
import { PraxisProfile } from '../components/profile/PraxisProfile'
import { useTitle } from '@/utils/useTitle';

export const Route = createFileRoute('/profil')({
  component: Profil,
})

function Profil() {
  useTitle('Praxisprofil');

  return (
    <div className="auth-page">
      <div className="auth-container">
        <PraxisProfile />
      </div>
    </div>
  )
}