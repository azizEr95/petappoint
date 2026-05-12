import type { CountryType, sexesType } from "petappoint-shared/schemas/ZodSchemas";


export type VeterinarianValidateType = {
    firstName: string;
    lastName: string;
    infoEmail: string;
    // Person data (used when creating new person)
    email: string;
    password?: string;
    confirmPassword?: string;
    dateOfBirth: string;
    sex: sexesType | undefined;
    phone: string;
    address: {
        country: CountryType | undefined;
        street: string;
        streetNumber: string;
        cityCode: string;
        city: string;
    };
}

export type PersonsValidateType = {
    sex: sexesType | undefined;
    dateOfBirth: string;
    firstName: string;
    lastName: string;
    phone: string;
    email: string;
    address: {
        country: CountryType | undefined;
        street: string;
        streetNumber: string;
        cityCode: string;
        city: string;
    };
    password?: string;
    confirmPassword?: string;
}

export type PracticeValidateType = {
    name: string;
    phone: string;
    email: string;
    address: {
        country: CountryType | undefined;
        street: string;
        streetNumber: string;
        cityCode: string;
        city: string;
    };
    password?: string;
    confirmPassword?: string;
    infoEmail: string;
    website: string;
    info: string;
}