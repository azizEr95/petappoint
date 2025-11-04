


export const getAllVeterinaryPratice = async () => {
    let res = await fetch(import.meta.env.VITE_API_URL + "/veterinary-practice/all");
    return res.json();
  }