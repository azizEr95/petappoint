import React from 'react'
import type { LoginType } from 'vetilib-shared/schemas/ZodSchemas'

interface LoginContextType {
  login: LoginType | false
  setLogin: (loginResource: LoginType | false) => void
}

export const LoginContext = React.createContext<LoginContextType>(
  {} as LoginContextType,
)

export const useLoginContext = () => React.useContext(LoginContext)
