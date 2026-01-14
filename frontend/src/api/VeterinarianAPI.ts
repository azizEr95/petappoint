import { VeterinariansSchema  } from "vetilib-shared/schemas/ZodSchemas";
import type {VeterinariansType} from "vetilib-shared/schemas/ZodSchemas";

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