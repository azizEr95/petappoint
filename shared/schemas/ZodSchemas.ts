import { z } from "zod";

//Animalgroup:
export const AnimalGroupSchema = z.object({
    id: z.number().int(),
    name: z.string().optional(),
});

export const AnimalGroupCreateSchema = AnimalGroupSchema.omit({ //alles ohne id (das was beim Erstellen von Objekt vorhanden sein muss)
    id: true
});

export type AnimalGroupCreateType = z.infer<typeof AnimalGroupCreateSchema>;
export type AnimalGroupType = z.infer<typeof AnimalGroupSchema>;


//Animaltype:
export const AnimalTypeSchema = z.object({
    id: z.number().int(),
    name: z.string(),
});

export const AnimalTypeCreateSchema = AnimalTypeSchema.omit({ //alles ohne id
    id: true
});

export type AnimalTypeCreateType = z.infer<typeof AnimalTypeCreateSchema>;
export type AnimalTypeType = z.infer<typeof AnimalTypeSchema>;


//Animal: 
const sexes = z.enum(['notknown', 'male', 'female', 'notapplicable']);
export type sexesType = z.infer<typeof sexes>;

export const AnimalsSchema = z.object({
    id: z.number().int(),
    name: z.string().min(1).max(100),
    dateofbirth: z.date().nullable(),
    dateofbirthisexact: z.boolean().nullable(),
    weightingram: z.number().int().nullable(),
    heightincm: z.number().int().nullable(),
    timeofdeath: z.date().nullable(),
    iscastrated: z.boolean(),
    lifestyleisindoors: z.boolean(),
    sex: sexes,
    animaltypeid: z.int(),
    animalgroupid: z.int().nullable()
});


export const AnimalsCreateSchema = AnimalsSchema.omit({
    id: true
});

export type AnimalsCreateType = z.infer<typeof AnimalsCreateSchema>;
export type AnimalsType = z.infer<typeof AnimalsSchema>;


//Animalraces:
export const AnimalracesSchema = z.object({
    id: z.number().int(),
    name: z.string(),
    animaltypeid: z.number().int(),
});

export const AnimalracesCreateSchema = AnimalracesSchema;

export type AnimalracesCreateType = z.infer<typeof AnimalracesCreateSchema>;
export type AnimalracesType = z.infer<typeof AnimalracesSchema>;


//Animal has Races:
export const Animal_has_RacesSchema = z.object({
    animalid: z.number().int(),
    animalrace: z.array(AnimalracesSchema),
});

export const Animal_has_RacesCreateSchema = Animal_has_RacesSchema;
export type Animal_has_RacesCreateType = z.infer<typeof Animal_has_RacesCreateSchema>;
export type Animal_has_RacesType = z.infer<typeof Animal_has_RacesSchema>;

export const AddRacesToAnimalSchema = z.object({
    animalid: z.number().int(),
    animalraceids: z.array(z.number()).min(1)
});
export type AddRacesToAnimalType = z.infer<typeof AddRacesToAnimalSchema>;

//Adressen: 
export const AddressesSchema = z.object({
    id: z.number().int(),
    street: z.string().min(3).max(80),
    citycode: z.string().min(3).max(12),
    city: z.string().min(3).max(60),
    country: z.string().min(3).max(150),
    longitude: z.number(),
    latitude: z.number(),
});

export const AddressesCreateSchema = AddressesSchema.omit({
    id: true
});

export type AddressesCreateType = z.infer<typeof AddressesCreateSchema>;
export type AddressesType = z.infer<typeof AddressesSchema>;


//Persons:
export const PersonsSchema = z.object({
    id: z.number().int(),
    firstname: z.string().min(2).max(60),
    lastname: z.string().min(2).max(60),
    sex: sexes,
    dateofbirth: z.date(),
    addresses: AddressesSchema,
    phone: z.string().min(5).max(20),
    email: z.email().max(100),
    password: z.string().min(6).max(255),
    
});

export const PersonsCreateSchema = PersonsSchema.omit({
    id: true
}).extend({
    addresses: AddressesCreateSchema
});

export type PersonsCreateType = z.infer<typeof PersonsCreateSchema>;
export type PersonsType = z.infer<typeof PersonsSchema>;


//Person has Animal:
export const Person_has_AnimalSchema = z.object({
    personid: z.number().int(),
    animals: z.array(AnimalsSchema),
});

export const Person_has_AnimalCreateSchema = Person_has_AnimalSchema;

export type Person_has_AnimalCreateType = z.infer<typeof Person_has_AnimalCreateSchema>;
export type Person_has_AnimalType = z.infer<typeof Person_has_AnimalSchema>;

export const ServiceSchema = z.object({
    id: z.number().int(),
    name: z.string().min(1).max(100)
});

export type ServiceType = z.infer<typeof ServiceSchema>;


//VeterinaryPractice:
export const VeterinaryPracticeSchema = z.object({
    id: z.number().int(),
    name: z.string().min(5).max(200),
    email: z.email().max(100),
    phone: z.string().min(5).max(20),
    infoemail: z.email().max(100),
    website: z.url().max(150).nullable(),
    info: z.string().nullable(),
    addresses: AddressesSchema
})

export const VeterinaryPracticeCreateSchema = VeterinaryPracticeSchema.omit({
    id: true
}).extend({
    addresses: AddressesCreateSchema,
    password: z.string().min(6).max(255)
});

export type VeterinaryPracticesCreateType = z.infer<typeof VeterinaryPracticeCreateSchema>;
export type VeterinaryPracticesType = z.infer<typeof VeterinaryPracticeSchema>;

export const VeterinarySearchQuerySchema = z.object({
    name: z.string().default(''),
    address: z.string().default(''),
});

export type VeterinarySearchQueryType = z.infer<typeof VeterinarySearchQuerySchema>;

//Veterinarians:
export const VeterinariansSchema = z.object({
    id: z.number().int(), //ist identisch zur Personen ID
    infoemail: z.email().nullable(),
    veterinarypractice: z.number().int().nullable(),
});

export const VeterinariansCreateSchema = VeterinariansSchema //id muss uebergeben werden, da Referenz zur Person wichtig ist

export type VeterinariansCreateType = z.infer<typeof VeterinariansCreateSchema>;
export type VeterinariansType = z.infer<typeof VeterinariansSchema>;


//Appointments:
export const AppointmentsSchema = z.object({
    id: z.number().int(),
    starttime: z.date(),
    endtime: z.date(),
    animal: AnimalsSchema.nullable(),
    veterinary: VeterinariansSchema,
    veterinarypractice: VeterinaryPracticeSchema,
    service: ServiceSchema.nullable(),
    availableservices: z.array(ServiceSchema),
    notiz: z.string().nullable().optional()
});

export const AppointmentsCreateSchema = z.object({
    starttime: z.date(),
    endtime: z.date(),
    animalid: z.number().int().nullable(),
    veterinaryid: z.number().int(),
    veterinarypracticeid: z.number().int(),
    serviceid: z.number().int().nullable(),
})

export const BookAppointmentSchema = z.object({
    id: z.number().int(),
    animalid: z.number().int(),
    serviceid: z.number().int()
})

export type AppointmentsUpdateAsPersonType = z.infer<typeof BookAppointmentSchema>;
export type AppointmentsCreateType = z.infer<typeof AppointmentsCreateSchema>;
export type AppointmentsType = z.infer<typeof AppointmentsSchema>;

export const AppointmentFilterSchema = z.object({
    filterAnimalType: AnimalTypeSchema.nullable(),
    filterServiceType: z.array(ServiceSchema).nullable(),
});

export type AppointmentFilterType = z.infer<typeof AppointmentFilterSchema>;


export const AnimalUpdateSchema = AnimalsSchema;
export type AnimalUpdateType = z.infer<typeof AnimalUpdateSchema>;