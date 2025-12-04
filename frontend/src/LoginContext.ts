import React from 'react'
import type { LoginType } from '../../shared/schemas/ZodSchemas'

interface LoginContextType {
  login: LoginType | false | undefined
  setLogin: (loginResource: LoginType | false | undefined) => void
}

export const LoginContext = React.createContext<LoginContextType>(
  {} as LoginContextType,
)

export const useLoginContext = () => React.useContext(LoginContext)
