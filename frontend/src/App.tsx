import { RouterProvider } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { LoginContext } from './LoginContext'
import type { LoginType } from '../../shared/schemas/ZodSchemas'

type AppProps = {
  router: any
}

export function App({ router }: AppProps) {
  const [login, setLogin] = useState<LoginType | false | undefined>(() => {
    const stored = localStorage.getItem('login')
    if (!stored) return undefined
    try {
      return JSON.parse(stored)
    } catch {
      return undefined
    }
  })

  useEffect(() => {
    if (login === false || login === undefined) {
      localStorage.removeItem('login')
    } else {
      localStorage.setItem('login', JSON.stringify(login))
    }
  }, [login])

  return (
    <LoginContext value={{ login, setLogin }}>
      <RouterProvider router={router} />
    </LoginContext>
  )
}
