import { lifestyles, Sexes } from "generated/prisma";
import { AnimalsType } from "vetilib-shared/schemas/ZodSchemas";

export type AnimalPrismaMappedType = {
    id: number,
    name: string,
    dateOfBirth: Date | null,
    dateOfBirthIsExact: boolean | null,
    weightInGram: number | null,
    heightInCm: number | null,
    timeOfDeath: Date | null,
    isCastrated: boolean,
    lifestyle: lifestyles,
    sex: Sexes,
    animalTypeId: number,
    animalGroupId: number | null
}

export function mapToAnimal(animal: AnimalPrismaMappedType): AnimalsType {
    return {
        animalGroupId: animal.animalGroupId,
        animalTypeId: animal.animalTypeId,
        dateOfBirth: animal.dateOfBirth,
        dateOfBirthIsExact: animal.dateOfBirthIsExact,
        heightInCm: animal.heightInCm,
        id: animal.id,
        isCastrated: animal.isCastrated,
        lifestyle: animal.lifestyle,
        name: animal.name,
        sex: animal.sex,
        timeOfDeath: animal.timeOfDeath,
        weightInGram: animal.weightInGram
    };
}