export const getVeterinaryPracticesByNameAddress = async (
  name: string,
  ort: string,
) => {
  const res = await fetch(
    import.meta.env.VITE_API_URL +
      '/veterinary-practice/search?name=' +
      name +
      '&address=' +
      ort,
  )
  return res.json()
}

export const getVeterinaryPracticesById = async (id: string) => {
  const res = await fetch(
    import.meta.env.VITE_API_URL + '/veterinary-practice/' + id,
  )
  return res.json()
}
