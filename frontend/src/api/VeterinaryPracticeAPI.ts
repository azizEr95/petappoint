import z from 'zod'
import { VeterinaryPracticeSchema } from '../../../shared/schemas/ZodSchemas'
import type { VeterinaryPracticesType } from '../../../shared/schemas/ZodSchemas'

export const getVeterinaryPracticesByNameAddress = async (
  name: string,
  ort: string,
): Promise<Array<VeterinaryPracticesType>> => {
  const res = await fetch(
    import.meta.env.VITE_API_URL +
      '/veterinary-practice/search?name=' +
      name +
      '&address=' +
      ort,
  )
  if (!res.ok) {
    throw new Error('Failed to fetch getVeterinaryPracticesByNameAddress')
  }

  const data = await res.json()
  const parsed = z.array(VeterinaryPracticeSchema).safeParse(data)
  if (parsed.error !== undefined) {
    // if Zod throws an Error print them
    console.log(parsed.error)
  }
  if (!parsed.success) {
    throw new Error(parsed.error.toString())
  }
  return parsed.data
}

export const getVeterinaryPracticesById = async (
  id: string,
): Promise<VeterinaryPracticesType> => {
  const res = await fetch(
    import.meta.env.VITE_API_URL + '/veterinary-practice/' + id,
  )
  if (!res.ok) {
    throw new Error('Failed to fetch getVeterinaryPracticesById')
  }

  const data = await res.json()
  const parsed = VeterinaryPracticeSchema.safeParse(data)
  if (parsed.error !== undefined) {
    // if Zod throws an Error print them
    console.log(parsed.error)
  }
  if (!parsed.success) {
    throw new Error(parsed.error.toString())
  }
  return parsed.data
}
