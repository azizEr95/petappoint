import { Outlet, createRootRoute } from '@tanstack/react-router'
import Header from '../components/common/Header'
import Breadcrumb from '../components/common/Breadcrumb'

export const Route = createRootRoute({
  component: RootComponent,
  notFoundComponent: notFoundComponent,
})

function RootComponent() {
  return (
    <>
      <Header />
      <Breadcrumb />
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
