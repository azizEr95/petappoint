import { lifestyles, Sexes } from "generated/prisma";
import { AddressesType, AnimalsType, ServiceType } from "petappoint-shared/schemas/ZodSchemas";

export type ServicePrismaMappedType = {
    id: number,
    name: string
}

export function mapToService(service: ServicePrismaMappedType): ServiceType {
    return service;
}