import { Sexes } from "generated/prisma";
import { PersonsType } from "vetilib-shared/schemas/ZodSchemas";
import { AddressPrismaMappedType, mapToAddress } from "./mapToAddress";

export type PersonPrismaMappedType = {
    id: number,
    firstName: string,
    lastName: string,
    sex: Sexes,
    dateOfBirth: Date,
    address: AddressPrismaMappedType,
    phone: string,
    email: string
}

export function mapToPerson(person: PersonPrismaMappedType): PersonsType {
    return {
        id: person.id,
        firstName: person.firstName,
        lastName: person.lastName,
        sex: person.sex,
        dateOfBirth: person.dateOfBirth,
        address: mapToAddress(person.address),
        phone: person.phone,
        email: person.email,
    };
}