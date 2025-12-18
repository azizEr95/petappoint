import { LoginSchema } from '../../../shared/schemas/ZodSchemas'
import type {
  LoginType,
  PersonsCreateType,
} from '../../../shared/schemas/ZodSchemas'

export const loginUser = async (
  email: string,
  password: string,
): Promise<LoginType> => {
  const loginInfos = {
    email: email,
    password: password,
  }

  const requestOptions = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(loginInfos),
    credentials: 'include' as RequestCredentials,
  }
  const res = await fetch(
    import.meta.env.VITE_API_URL + '/login/',
    requestOptions,
  )
  if (!res.ok) {
    throw new Error('Failed to fetch login')
  }

  const data = await res.json()
  return parseLogin(data)
}

export const personRegistration = async (
  person: PersonsCreateType,
): Promise<LoginType> => {
  const requestOptions = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(person),
    credentials: 'include' as RequestCredentials,
  }
  const res = await fetch(
    import.meta.env.VITE_API_URL + '/persons/',
    requestOptions,
  )
  if (!res.ok) {
    throw new Error('Failed to fetch personRegistration')
  }

  const data = await res.json()
  return parseLogin(data);
}

export const checkLogin = async (): Promise<LoginType | false> => {
  const requestOptions = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include' as RequestCredentials,
  }
  const res = await fetch(
    import.meta.env.VITE_API_URL + '/login/',
    requestOptions,
  )
  if (!res.ok) {
    return false
  }

  const data = await res.json()
  if (data === false) {
    return false
  }
  return parseLogin(data)
}

export const logoutUser = async (): Promise<void> => {
  const requestOptions = {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include' as RequestCredentials,
  }
  const res = await fetch(
    import.meta.env.VITE_API_URL + '/login/',
    requestOptions,
  )
  if (!res.ok) {
    throw new Error('Failed to fetch login')
  }
  return
}

// for verify Email
export const verifyEmail = async (verifyCode: string): Promise<LoginType> => {
  const res = await fetch(
    import.meta.env.VITE_API_URL +
      '/registration/' + verifyCode,
    {
      method: 'GET',
      credentials: 'include',
    },
  )

  if (!res.ok) {
    throw Error('Failed to fetch verifyEmail')
  }

  const data = await res.json()
  return parseLogin(data);
}

export const newToken = async (): Promise<void> => {
  const res = await fetch(
    import.meta.env.VITE_API_URL +
      '/registration/',
    {
      method: 'POST',
      credentials: 'include',
    },
  )

  if (!res.ok) {
    throw Error('Failed to fetch newToken')
  }

  return;

}

const parseLogin = (unsafeAppointment: LoginType): LoginType => {
  const parsed = LoginSchema.safeParse(unsafeAppointment)
  if (parsed.error !== undefined) {
    // if Zod throws an Error print them
    console.log(parsed.error)
  }
  if (!parsed.success) {
    throw new Error(parsed.error.toString())
  }
  return parsed.data
}
