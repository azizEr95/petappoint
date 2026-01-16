import { lifestyles, Sexes } from "generated/prisma";
import { AddressesType, AnimalsType } from "vetilib-shared/schemas/ZodSchemas";

export type AddressPrismaMappedType = {
    id: number,
    street: string,
    cityCode: string,
    city: string,
    fk_country: number,
    longitude: number,
    latitude: number
}

export function mapToAddress(address: AddressPrismaMappedType): AddressesType {
    return {
        city: address.city,
        cityCode: address.cityCode,
        country: address.fk_country,
        id: address.id,
        latitude: address.latitude,
        longitude: address.longitude,
        street: address.street
    }
}