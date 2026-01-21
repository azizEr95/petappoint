import { VeterinariansType } from "vetilib-shared/schemas/ZodSchemas";

export type VeterinaryPrismaMappedType = {
    id: number,
    infoEmail: string | null,
    person: {
        firstName: string,
        lastName: string,
    },
    fk_veterinarypracticeid: number | null
}

export function mapToVeterinary(veterinary: VeterinaryPrismaMappedType): VeterinariansType {
    return {
        firstName: veterinary.person.firstName,
        id: veterinary.id,
        infoEmail: veterinary.infoEmail,
        lastName: veterinary.person.lastName,
        fk_veterinarypracticeid: veterinary.fk_veterinarypracticeid
    };
}