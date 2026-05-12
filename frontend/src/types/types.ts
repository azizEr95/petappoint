
type CheckPersonType = {
    exists: boolean;
    isVeterinarian?: boolean;
    firstName?: string;
    lastName?: string;
};

type SearchParamsType = {
    address: string;
    animalType: string;
    serviceType: string;
    animal?: string;
};