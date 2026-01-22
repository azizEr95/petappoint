export const getAvailableCities = async (): Promise<string[]> => {
  const res = await fetch(
    import.meta.env.VITE_API_URL + '/locations/cities',
    { credentials: 'include' }
  );

  if (!res.ok) {
    throw new Error('Failed to fetch cities');
  }

  return await res.json();
};
