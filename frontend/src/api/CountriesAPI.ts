import { CountrySchema  } from "vetilib-shared/schemas/ZodSchemas";
import type {CountryType} from "vetilib-shared/schemas/ZodSchemas";

export const getAllCountries = async (): Promise<Array<CountryType>> => {
  const url = import.meta.env.VITE_API_URL + '/countries/all';
  const requestOptions = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include' as RequestCredentials,
  }
  const res = await fetch(url, requestOptions);

  if (!res.ok) {
    throw new Error('Failed to fetch getAllCountries');
  }
  const data = await res.json();
  return parseCountryArray(data);
}

export const getCountryById = async (countryId: string): Promise<CountryType> => {
  const url = import.meta.env.VITE_API_URL + '/countries/' + countryId;
  const requestOptions = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include' as RequestCredentials,
  }
  const res = await fetch(url, requestOptions);

  if (!res.ok) {
    throw new Error('Failed to fetch getAllCountries');
  }
  const data = await res.json();
  return parseCountry(data);
}

const parseCountryArray = (
  unsafeCountries: Array<CountryType>,
): Array<CountryType> => {
  return unsafeCountries
    .map((x) => {
      const parsed = CountrySchema.safeParse(x);
      if (parsed.error !== undefined) {
        // if Zod throws an Error print them
        console.log(parsed.error);
      }
      if (parsed.success) {
        return parsed.data;
      }
      return null;
    })
    .filter((x) => x !== null);
}

const parseCountry = (
  unsafeCountry: CountryType,
): CountryType => {
  const parsed = CountrySchema.safeParse(unsafeCountry);
  if (parsed.error !== undefined) {
    // if Zod throws an Error print them
    console.log(parsed.error);
  }
  if (!parsed.success) {
    throw new Error(parsed.error.toString());
  }
  return parsed.data;
}