import { createFileRoute, useLocation } from '@tanstack/react-router'

export const Route = createFileRoute('/registration/verify-email')({
  component: pendingConfirmation,
})

function pendingConfirmation() {
    const location = useLocation();


    return <div>Bitte verifiziere deine Emailadresse</div>
}
