


export const getAllVeterinaryPractices = async () => {
  let res = await fetch(import.meta.env.VITE_API_URL + "/veterinary-practice/all");
  return res.json();
}

export const getVeterinaryPracticesByNameAddress = async (suche: string) => {
  if(suche === ""){
    return await getAllVeterinaryPractices();
  }
  let res = await fetch(import.meta.env.VITE_API_URL + "/veterinary-practice/" + suche);
  return res.json();
}