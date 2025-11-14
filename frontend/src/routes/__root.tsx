import { Outlet, createRootRoute } from '@tanstack/react-router'
import Header from '../components/Header'

export const Route = createRootRoute({
  component: RootComponent,
  notFoundComponent: notFoundComponent,
})

function RootComponent() {
  return (
    <>
      <Header />
      <Outlet />
    </>
  )
}

function notFoundComponent() {
  return (
    <div id="404Page" className="text-center background-green">
      404 - not found
    </div>
  )
}
