import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/appointments')({
  component: Appoinments,
})

function Appoinments() {
  return (
    <div className="text-center background-green">
      Hello, hier stehen deine anstehenden Termine
    </div>
  )
}
