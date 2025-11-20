import z, { promise } from 'zod'
import { VeterinaryPracticeSchema } from '../../../shared/schemas/ZodSchemas'
import type { VeterinaryPracticesCreateType,VeterinaryPracticesType } from '../../../shared/schemas/ZodSchemas'

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

  const data = await res.json();
  const parsed = z.array(VeterinaryPracticeSchema).safeParse(data);
  if (parsed.error !== undefined) { // if Zod throws an Error print them
    console.log(parsed.error);
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

  const data = await res.json();
  const parsed = VeterinaryPracticeSchema.safeParse(data);
  if (parsed.error !== undefined) { // if Zod throws an Error print them
    console.log(parsed.error);
  }
  if (!parsed.success) {
    throw new Error(parsed.error.toString())
  }
  return parsed.data
}
export const creatVeterinaryPractice =async (practice:VeterinaryPracticesCreateType): Promise<VeterinaryPracticesType> =>{
  
  const requestOptions = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(practice),
  }
   const res = await fetch(
    import.meta.env.VITE_API_URL + '/veterinary-practice/' ,requestOptions
  )
  if (!res.ok) {
    throw new Error('Failed to fetch getVeterinaryPracticesById')
  }
  console.log("fetch eerfolgreich")
  console.log(res)
  const data = await res.json();
  console.log("data parsed")
  return parsedVeterinaryPractice(data);
}
/*
 * change the date from the Appointment to Date Object and safeParse the object
 */
const parsedVeterinaryPractice = (unsafeAppointment: VeterinaryPracticesType): VeterinaryPracticesType => {
    
    const parsed = VeterinaryPracticeSchema.safeParse(unsafeAppointment);
    if (parsed.error !== undefined) { //if Zod throws an Error print them
        console.log(parsed.error);
    }
    if (!parsed.success) {
        throw new Error(parsed.error.toString());
    }
    console.log("parse erfolgreich")
    return parsed.data;
}