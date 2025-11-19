import { AnimalsSchema } from '../../../shared/schemas/ZodSchemas'
import type { AnimalsType } from '../../../shared/schemas/ZodSchemas'

export const getAnimalsFromUser = async (
  userId: number,
): Promise<Array<AnimalsType>> => {
  const res = await fetch(
    import.meta.env.VITE_API_URL + '/persons/' + userId + '/animals',
  )
  if (!res.ok) {
    throw new Error('Failed to fetch getAnimalsFromUser')
  }

  const data = (await res.json()) as Array<AnimalsType>
  return data
    .map((unsafeData) => {
      if (unsafeData.dateofbirth !== null) {
        unsafeData.dateofbirth = new Date(unsafeData.dateofbirth) // change Date to Date Object
      }

      const parsed = AnimalsSchema.safeParse(unsafeData)
      if (parsed.error !== undefined) {
        // if Zod throws an Error print them
        console.log(parsed.error)
      }
      if (parsed.success) {
        return parsed.data
      }
      return null
    })
    .filter((x) => x !== null)
}
