export type addressResource = {
  id?: number;
  street: string;
  city: string;
  citycode: string;
  country: string;
  longitude: number;
  latitude: number;
};

export type animalKindResource = {
  id?: number;
  name: string;
};

export type AnimalResource = {
  id?: number;
  name: string;
  dateOfBirth?: Date;
  animalTypeId: number;
};

export type AnimalTypeResource = {
  id?: number;
  name: string;
  animalKindId?: number;
};

export type AppointmentResource = {
  id?: number;
  startTime: Date;
  endTime: Date;
  animalId?: number;
  veterinaryId: number;
};

export type PersonHasAnimalResource = {
  personId: number;
  animalId: number;
};

export enum Sex {
  NotKnown = "notknown",
  Male = "male",
  Female = "female",
  NotApplicable = "notapplicable",
}

export type PersonResource = {
  id?: number;
  firstName: string;
  lastName: string;
  sex: Sex;
  dateOfBirth: Date;
  addressId: number;
  phone: string;
  email: string;
  password: string;
};

export type SpecializationResource = {
  id?: number;
  name: string;
};

export type VeterinaryResource = {
  id: number;
  infoEmail?: string;
  veterinaryPracticeId?: number;
};

export type VeterinaryHasSpecializationResource = {
  veterinaryId: number;
  specializationId: number;
};

export type VeterinaryPracticeResource = {
  id?: number;
  name: string;
  phone: string;
  infoEmail: string;
  email: string;
  password: string;
  website?: string;
  info?: string;
  addressId: number;
};
