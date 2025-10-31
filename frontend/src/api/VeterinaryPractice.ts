import { BACKEND_URL } from "../../config/config";


export const getAllVeterinaryPratice = async () => {
    let res = await fetch(BACKEND_URL + "api/veterinary/all");
    return res.json();
  }