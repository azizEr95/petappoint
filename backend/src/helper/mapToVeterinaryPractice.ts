import { Sexes } from "generated/prisma";
import { PersonsType, VeterinaryPracticesType } from "vetilib-shared/schemas/ZodSchemas";
import { AddressPrismaMappedType, mapToAddress } from "./mapToAddress";

export type VeterinaryPracticePrismaMappedType = {
    id: number,
    name: string,
    email: string,
    phone: string,
    infoEmail: string,
    website: string | null,
    info: string | null,
    address: AddressPrismaMappedType
}

export function mapToVeterinaryPractice(veterinaryPractice: VeterinaryPracticePrismaMappedType): VeterinaryPracticesType {
    return {
        address: mapToAddress(veterinaryPractice.address),
        email: veterinaryPractice.email,
        id: veterinaryPractice.id,
        info: veterinaryPractice.info,
        infoEmail: veterinaryPractice.infoEmail,
        name: veterinaryPractice.name,
        phone: veterinaryPractice.phone,
        website: veterinaryPractice.website
    };
}