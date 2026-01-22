import {
  VeterinaryPracticeSchema,
  VeterinaryPracticeSearchResultSchema,
} from 'vetilib-shared/schemas/ZodSchemas'
import type {
  VeterinaryPracticeSearchQueryType,
  VeterinaryPracticeSearchResultType,
  VeterinaryPracticesType,
} from 'vetilib-shared/schemas/ZodSchemas'

export const getVeterinaryPracticesByNameAddress = async (
  searchParams: VeterinaryPracticeSearchQueryType,
): Promise<VeterinaryPracticeSearchResultType> => {
  const targetURL = import.meta.env.VITE_API_URL + '/veterinary-practice/search?';
  let query = ''
  if (searchParams.name) {
    query += `${query.length > 0 ? '&' : ''}name=${searchParams.name}`;
  }
  if (searchParams.address) {
    query += `${query.length > 0 ? '&' : ''}address=${searchParams.address}`;
  }
  if (searchParams.animalTypeIds) {
    query += `${query.length > 0 ? '&' : ''}animalTypeIds=${searchParams.animalTypeIds.join(',')}`;
  }
  if (searchParams.serviceTypeIds) {
    query += `${query.length > 0 ? '&' : ''}serviceTypeIds=${searchParams.serviceTypeIds.join(',')}`;
  }
  if (searchParams.page) {
    query += `${query.length > 0 ? '&' : ''}page=${searchParams.page}`;
  }
  if (searchParams.pageSize) {
    query += `${query.length > 0 ? '&' : ''}pageSize=${searchParams.pageSize}`;
  }
  const res = await fetch(targetURL + query, { credentials: 'include' });
  if (!res.ok) {
    throw new Error('Failed to fetch getVeterinaryPracticesByNameAddress');
  }

  const data = await res.json()
  const parsed = VeterinaryPracticeSearchResultSchema.safeParse(data);
  if (parsed.error !== undefined) {
    // if Zod throws an Error print them
    console.log(parsed.error);
  }
  if (!parsed.success) {
    throw new Error(parsed.error.toString());
  }
  return parsed.data;
}

export const getVeterinaryPracticesById = async (
  id: string,
): Promise<VeterinaryPracticesType> => {
  const res = await fetch(
    import.meta.env.VITE_API_URL + '/veterinary-practice/' + id,
    { credentials: 'include' });
  if (!res.ok) {
    throw new Error('Failed to fetch getVeterinaryPracticesById')
  }

  const data = await res.json();
  return parsedVeterinaryPractice(data);
}

export const getFavoritesVeterinaryPractices = async (
  userId: string,
): Promise<Array<number>> => {
  const res = await fetch(
    import.meta.env.VITE_API_URL + '/persons/' + userId + '/favorites',
    { credentials: 'include' },
  );
  if (!res.ok) {
    throw new Error('Failed to fetch getFavoritesVeterinaryPractices');
  }

  const data = await res.json();
  return data;
}

export const getFavoritesVeterinaryPracticesDetails = async (
  userId: string,
): Promise<Array<VeterinaryPracticesType>> => {
  const favoriteIds = await getFavoritesVeterinaryPractices(userId);
  if (favoriteIds.length === 0) {
    return [];
  }

  const practicesPromises = favoriteIds.map(async (id) => {
    try {
      return await getVeterinaryPracticesById(id.toString());
    } catch (error) {
      console.error(`Fehler beim Laden der Praxis ${id}:`, error);
      return null;
    }
  });

  const practices = await Promise.all(practicesPromises);
  return practices.filter((p): p is VeterinaryPracticesType => p !== null);
}

export const addFavoritesVeterinaryPractices = async (
  userId: string,
  practiceId: string,
): Promise<void> => {
  const requestOptions = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include' as RequestCredentials,
  }

  const res = await fetch(
    import.meta.env.VITE_API_URL +
    '/persons/' +
    userId +
    '/favorites/' +
    practiceId,
    requestOptions);
  if (!res.ok) {
    throw new Error('Failed to fetch addFavoritesVeterinaryPractices');
  }

  return;
}

export const deleteFavoritesVeterinaryPractices = async (
  userId: string,
  practiceId: string,
): Promise<void> => {
  const requestOptions = {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include' as RequestCredentials,
  }

  const res = await fetch(
    import.meta.env.VITE_API_URL +
    '/persons/' +
    userId +
    '/favorites/' +
    practiceId,
    requestOptions);
  if (!res.ok) {
    throw new Error('Failed to fetch deleteFavoritesVeterinaryPractices');
  }

  return;
}

export const getPictureURLForPracticeId = (practiceId: number, timestamp?: number): string => {
  const url = `${import.meta.env.VITE_API_URL}/veterinary-practice/${practiceId}/image`;
  return timestamp ? `${url}?t=${timestamp}` : url;
}

export const getPictureFromPracticeId = async (
  practiceId: number,
): Promise<string> => {
  const response = await fetch(
    `${import.meta.env.VITE_API_URL}/veterinary-practice/${practiceId}/image`,
    { credentials: 'include' },
  );

  if (!response.ok) {
    throw new Error('Failed to fetch getPictureFromPracticeId');
  }

  const data = await response.blob();
  const url = URL.createObjectURL(data);
  return url;
}

export const uploadPictureForPracticeId = async (
  practiceId: number,
  file: File,
): Promise<void> => {
  const formData = new FormData();
  formData.append('image', file);
  const targetURL = `${import.meta.env.VITE_API_URL}/veterinary-practice/${practiceId}/image`;
  const response = await fetch(targetURL, {
    method: 'POST',
    body: formData,
    credentials: 'include',
  });

  if (!response.ok) {
    throw Error('Could not upload image');
  }
}

export const deletePictureForPracticeId = async (
  practiceId: number,
): Promise<void> => {
  const targetURL = `${import.meta.env.VITE_API_URL}/veterinary-practice/${practiceId}/image`;
  const response = await fetch(targetURL, {
    method: 'DELETE',
    credentials: 'include',
  });

  if (!response.ok) {
    throw Error('Failed to delete practice image');
  }
}

export const updateVeterinaryPractice = async (
  id: number,
  data: VeterinaryPracticesType,
): Promise<VeterinaryPracticesType> => {
  const requestOptions = {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
    credentials: 'include' as RequestCredentials,
  };

  const res = await fetch(
    `${import.meta.env.VITE_API_URL}/veterinary-practice/${id}`,
    requestOptions,
  );

  if (!res.ok) {
    throw new Error('Failed to update veterinary practice');
  }

  const responseData = await res.json();
  return parsedVeterinaryPractice(responseData);
}

/*
 * change the date from the Appointment to Date Object and safeParse the object
 */
const parsedVeterinaryPractice = (
  unsafeAppointment: VeterinaryPracticesType,
): VeterinaryPracticesType => {
  const parsed = VeterinaryPracticeSchema.safeParse(unsafeAppointment);
  if (parsed.error !== undefined) {
    // if Zod throws an Error print them
    console.log(parsed.error);
  }
  if (!parsed.success) {
    throw new Error(parsed.error.toString());
  }
  return parsed.data;
}
