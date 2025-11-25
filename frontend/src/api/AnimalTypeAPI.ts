import { AnimalTypeSchema, type AnimalTypeType } from "../../../shared/schemas/ZodSchemas"


export const getAllAnimalTypes = async (): Promise<AnimalTypeType[]> => {
    const res = await fetch(
        import.meta.env.VITE_API_URL + '/animaltypes/all',
    )
    if (!res.ok) {
        throw new Error('Failed to fetch getAllAnimalTypes')
    }

    const data = await res.json();
    return parseAnimalTypeArray(data);
}

export const getAnimaltypesFromPractice = async (practiceId: string): Promise<Array<AnimalTypeType>> => {
    const res = await fetch(
        import.meta.env.VITE_API_URL +
        '/veterinary-practice/' + practiceId + '/animaltypes'
    )
    if (!res.ok) {
        throw new Error('Failed to fetch getAnimaltypesFromPractice')
    }

    const data = await res.json();
    return parseAnimalTypeArray(data);
}

/*
* safeParse an array of animaltypes
*/
const parseAnimalTypeArray = (unsafeAnimalType: AnimalTypeType[]): AnimalTypeType[] => {
    return unsafeAnimalType.map(unsafeType => {
        const parsed = AnimalTypeSchema.safeParse(unsafeType);
        if (parsed.error !== undefined) { // if Zod throws an Error print them
            console.log(parsed.error);
        }
        if (parsed.success) {
            return parsed.data;
        }
        return null;
    }).filter(x => x !== null);
}