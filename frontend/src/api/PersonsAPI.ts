import { PersonsSchema } from '../../../shared/schemas/ZodSchemas'
import type {
  PersonsType,
  PersonsUpdateType,
} from '../../../shared/schemas/ZodSchemas'

export const getPersonById = async (personId: number): Promise<PersonsType> => {
  const res = await fetch(
    import.meta.env.VITE_API_URL + '/persons/' + personId,
    { credentials: 'include' },
  )
  if (!res.ok) {
    throw new Error('Failed to fetch person profile')
  }

  const data = await res.json()
  return parsePerson(data)
}

export const updatePerson = async (
  personId: number,
  person: PersonsUpdateType,
): Promise<PersonsType> => {
  const requestOptions = {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(person),
    credentials: 'include' as RequestCredentials,
  }

  const res = await fetch(
    import.meta.env.VITE_API_URL + '/persons/' + personId,
    requestOptions,
  )
  if (!res.ok) {
    throw new Error('Failed to update person profile')
  }

  const data = await res.json()
  return parsePerson(data)
}

export const getPictureURLForPersonId = (personId: number, cacheBust?: number): string => {
  const url = import.meta.env.VITE_API_URL + '/persons/' + personId + '/picture'
  return cacheBust ? `${url}?t=${cacheBust}` : url
}

export const uploadPictureForPersonId = async (
  personId: number,
  file: File,
): Promise<void> => {
  const formData = new FormData()
  formData.append('picture', file)
  const targetURL =
    import.meta.env.VITE_API_URL + '/persons/' + personId + '/picture'
  const response = await fetch(targetURL, {
    method: 'POST',
    body: formData,
    credentials: 'include',
  })

  if (!response.ok) {
    throw Error('Could not upload profile picture')
  }
}

const parsePerson = (unsafePerson: PersonsType): PersonsType => {
  const parsed = PersonsSchema.safeParse(unsafePerson)
  if (parsed.error !== undefined) {
    console.log(parsed.error)
  }
  if (!parsed.success) {
    throw new Error(parsed.error.toString())
  }
  return parsed.data
}
