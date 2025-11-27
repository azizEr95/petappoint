import { VeterinaryPracticeSchema, VeterinaryPracticeSearchResultSchema } from '../../../shared/schemas/ZodSchemas'
import type { VeterinaryPracticeSearchQueryType, VeterinaryPracticesCreateType, VeterinaryPracticesType, VeterinaryPracticeSearchResultType } from '../../../shared/schemas/ZodSchemas'

export const getVeterinaryPracticesByNameAddress = async (
  searchParams: VeterinaryPracticeSearchQueryType
): Promise<VeterinaryPracticeSearchResultType> => {
  const targetURL = import.meta.env.VITE_API_URL + '/veterinary-practice/search?';
  let query = '';
  if (searchParams.name) {
    query += `${query.length > 0 ? '&' : ''}name=${searchParams.name}`
  }
  if (searchParams.address) {
    query += `${query.length > 0 ? '&' : ''}address=${searchParams.address}`
  }
  if (searchParams.animalTypeIds) {
    query += `${query.length > 0 ? '&' : ''}animalTypeIds=${searchParams.animalTypeIds.join(',')}`
  }
  if (searchParams.serviceTypeIds) {
    query += `${query.length > 0 ? '&' : ''}serviceTypeIds=${searchParams.serviceTypeIds.join(',')}`
  }
  if (searchParams.page) {
    query += `${query.length > 0 ? '&' : ''}page=${searchParams.page}`
  }
  if (searchParams.pageSize) {
    query += `${query.length > 0 ? '&' : ''}pageSize=${searchParams.pageSize}`
  }
  const res = await fetch(targetURL + query);
  if (!res.ok) {
    throw new Error('Failed to fetch getVeterinaryPracticesByNameAddress')
  }

  const data = await res.json();
  const parsed = VeterinaryPracticeSearchResultSchema.safeParse(data);
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
export const creatVeterinaryPractice = async (practice: VeterinaryPracticesCreateType): Promise<VeterinaryPracticesType> => {

  const requestOptions = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(practice),
  }
  const res = await fetch(
    import.meta.env.VITE_API_URL + '/veterinary-practice/', requestOptions
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
  if (parsed.error !== undefined) { // if Zod throws an Error print them
    console.log(parsed.error);
  }
  if (!parsed.success) {
    throw new Error(parsed.error.toString());
  }
  console.log("parse erfolgreich")
  return parsed.data;
}