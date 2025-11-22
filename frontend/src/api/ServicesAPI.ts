import z from "zod";
import { ServiceSchema, type ServiceType } from "../../../shared/schemas/ZodSchemas";


export const getServicesFromPractice = async (
  practiceId: string
  ): Promise<Array<ServiceType>> => {
    const res = await fetch(
      import.meta.env.VITE_API_URL +
        '/veterinary-practice/'+ practiceId+'/services'
    )
    if (!res.ok) {
      throw new Error('Failed to fetch getServicesFromPractice')
    }
  
    const data = await res.json();
    const parsed = z.array(ServiceSchema).safeParse(data);
    if (parsed.error !== undefined) { // if Zod throws an Error print them
      console.log(parsed.error);
    }
    if (!parsed.success) {
      throw new Error(parsed.error.toString())
    }
    return parsed.data
  }
  