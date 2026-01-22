import { Outlet, createRootRoute } from '@tanstack/react-router'
import Header from '../components/common/Header'
import { Error404, Error500 } from '../components/error'
import Footer from '../components/common/Footer'

export const Route = createRootRoute({
  component: RootComponent,
  notFoundComponent: Error404,
  errorComponent: () => <Error500 />,
})

function RootComponent() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Header />
      <div style={{ flex: 1 }}>
        <Outlet />
      </div>
      <Footer />
    </div>
  )
}
