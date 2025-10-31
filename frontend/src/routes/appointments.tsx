import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/appointments')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div className='text-center background-green'>Hello, du bist eingeloggt, hier stehen die anstehenden Termine</div>
}
