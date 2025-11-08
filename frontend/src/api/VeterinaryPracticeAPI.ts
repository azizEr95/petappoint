

export const getVeterinaryPracticesByNameAddress = async (name: string, ort: string) => {
  let res = await fetch(import.meta.env.VITE_API_URL + "/veterinary-practice/search?name=" + name + "&address=" + ort);
  return res.json();
}