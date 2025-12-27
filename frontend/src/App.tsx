import { RouterProvider } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { LoginContext } from './LoginContext'
import { checkLogin } from './api/LoginAPI'
import type { LoginType } from 'vetilib-shared/schemas/ZodSchemas'

type AppProps = {
  router: any
}

export function App({ router }: AppProps) {
  const [login, setLogin] = useState<LoginType | false>(false)

  useEffect(() => {
    checkLogin().then((result) => {
      setLogin(result)
    })
  }, [])

  return (
    <LoginContext value={{ login, setLogin }}>
      <RouterProvider router={router} />
    </LoginContext>
  )
}
