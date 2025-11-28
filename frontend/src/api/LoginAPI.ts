import { LoginSchema, type LoginType, type PersonsCreateType } from "../../../shared/schemas/ZodSchemas"


export const loginUser = async (email: string, password: string): Promise<LoginType> => {
    const loginInfos = {
        email: email,
        password: password
    }

    const requestOptions = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(loginInfos),
        credentials: 'include'  as RequestCredentials
    }
    const res = await fetch(
        import.meta.env.VITE_API_URL + '/login/', requestOptions
    )
    if (!res.ok) {
        throw new Error('Failed to fetch login')
    }

    const data = await res.json();
    return parseLogin(data);
}

export const personRegistration = async (person: PersonsCreateType): Promise<string> => {
    const requestOptions = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(person),
        credentials: 'include'  as RequestCredentials
    }
    const res = await fetch(
        import.meta.env.VITE_API_URL + '/persons/', requestOptions // to be changed
    )
    if (!res.ok) {
        console.log(res)
        throw new Error('Failed to fetch personRegistration')
    }

    const data = await res.json();
    return data; // is an string, should be from type LoginType
}

const parseLogin = (unsafeAppointment: LoginType): LoginType => {

    const parsed = LoginSchema.safeParse(unsafeAppointment);
    if (parsed.error !== undefined) { // if Zod throws an Error print them
        console.log(parsed.error);
    }
    if (!parsed.success) {
        throw new Error(parsed.error.toString());
    }
    return parsed.data;
}