import { lifestyles, Sexes } from "generated/prisma";
import { AddressesType, AnimalsType, VeterinariansType } from "vetilib-shared/schemas/ZodSchemas";
import { PersonPrismaMappedType } from "./mapToPerson";

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
        veterinaryPracticeId: veterinary.fk_veterinarypracticeid
    };
}