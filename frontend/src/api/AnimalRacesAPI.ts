import { AnimalracesSchema, type AnimalracesType } from "../../../shared/schemas/ZodSchemas";


export const getRacesByAnimalTypeID = async (animalTypeID: number | undefined): Promise<AnimalracesType[]> => {
    if (animalTypeID === undefined) { // should be also !== undefined, because of the enabled condition in useQuery
        throw new Error('Error getRacesByAnimalTypeID: animalTypeID is undefined')
    }
    const res = await fetch(
        import.meta.env.VITE_API_URL + '/animaltypes/races/' + animalTypeID,
    )
    if (!res.ok) {
        throw new Error('Failed to fetch getRacesByAnimalTypeID')
    }
    const data = await res.json();
    return parseAnimalRacesArray(data);
}

export const getRacesByAnimalID = async (animalID: number | undefined): Promise<AnimalracesType[]> => {
    if (animalID === undefined) { // should be also !== undefined, because of the enabled condition in useQuery
        throw new Error('Error getRacesByAnimalID: animalID is undefined')
    }
    const res = await fetch(
        import.meta.env.VITE_API_URL + '/animals/' + animalID + '/races',
    )
    if (!res.ok) {
        throw new Error('Failed to fetch getRacesByAnimalID')
    }
    const data = await res.json();
    return parseAnimalRacesArray(data);
}

/*
* safeParse an array of animalraces
*/
const parseAnimalRacesArray = (unsafeRaces: AnimalracesType[]): AnimalracesType[] => {
    return unsafeRaces.map(unsafeRace => {
        const parsed = AnimalracesSchema.safeParse(unsafeRace);
        if (parsed.error !== undefined) { // if Zod throws an Error print them
            console.log(parsed.error);
        }
        if (parsed.success) {
            return parsed.data;
        }
        return null;
    }).filter(x => x !== null);
}