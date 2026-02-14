import type { AnimalsType, PersonsType } from "petappoint-shared/schemas/ZodSchemas";

export type CustomerType = { animal: AnimalsType; person: PersonsType };

export const getCustomersFromPractice = async (
  practiceId: string,
): Promise<Array<CustomerType>> => {
  const res = await fetch(
    import.meta.env.VITE_API_URL + '/veterinary-practice/' + practiceId + '/customers',
    { credentials: 'include' },
  );
  if (!res.ok) {
    throw new Error('Failed to fetch getCustomersFromPractice');
  }

  const data = await res.json();
  return data;
}