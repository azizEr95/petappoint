import { VeterinariansSchema } from "vetilib-shared/schemas/ZodSchemas";
import type { VeterinariansType, VeterinariansCreateType } from "vetilib-shared/schemas/ZodSchemas";

export const getVeterinariansByPracticeId = async (practiceId: string): Promise<Array<VeterinariansType>> => {
    const res = await fetch(
        import.meta.env.VITE_API_URL + '/veterinary-practice/' + practiceId + '/veterinarians',
        { credentials: 'include' },
    );
    if (!res.ok) {
        throw new Error('Failed to fetch getVeterinariansByPracticeId');
    }

    const data = await res.json();
    return parseVeterinariansArray(data);
}

export const createVeterinarian = async (veterinarian: VeterinariansCreateType): Promise<VeterinariansType> => {
  const res = await fetch(
    import.meta.env.VITE_API_URL + '/veterinarians',
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(veterinarian),
      credentials: 'include',
    },
  );
  if (!res.ok) {
    throw new Error('Failed to create veterinarian');
  }

  const data = await res.json();
  const parsed = VeterinariansSchema.safeParse(data);
  if (!parsed.success) {
    console.log(parsed.error);
    throw new Error('Invalid veterinarian response');
  }
  return parsed.data;
};

const parseVeterinariansArray = (unsafeVeterinarians: Array<VeterinariansType>,): Array<VeterinariansType> => {
  return unsafeVeterinarians
    .map((x) => {
      const parsed = VeterinariansSchema.safeParse(x);
      if (parsed.error !== undefined) {
        console.log(parsed.error);
      }
      if (parsed.success) {
        return parsed.data;
      }
      return null;
    })
    .filter((x) => x !== null);
}