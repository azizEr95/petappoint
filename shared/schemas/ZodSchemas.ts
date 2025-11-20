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
    name: z.string().optional(),
});

export const AnimalTypeCreateSchema = AnimalTypeSchema.omit({ //alles ohne id
    id: true
});

export type AnimalTypeCreateType = z.infer<typeof AnimalTypeCreateSchema>;
export type AnimalTypeType = z.infer<typeof AnimalTypeSchema>;


//Animal: 
const husbandarySystem = z.enum(['indoor', 'indoorPlusSpace', 'indoorWithFreshAir', 'outdoorRunsFreeRange', 'organic']); //Moeglichkeiten vom Lifestyle
export type husbandarySystemType = z.infer<typeof husbandarySystem>;
const sexes = z.enum(['notknown', 'male', 'female', 'notapplicable']);
export type sexesType = z.infer<typeof sexes>;

export const AnimalsSchema = z.object({
    id: z.number().int(),
    name: z.string().min(2).max(100),
    dateofbirth: z.date().nullable(),
    dateofbirthisexact: z.boolean().nullable(),
    weightingram: z.number().int().nullable(),
    heightincm: z.number().int().nullable(),
    timeofdeath: z.date().nullable(),
    iscastrated: z.boolean(),
    lifestyle: husbandarySystem,
    sex: sexes
});


export const AnimalsCreateSchema = AnimalsSchema.omit({
    id: true
}).extend({
    animaltype: AnimalTypeCreateSchema,
    animalgroup: AnimalGroupCreateSchema
});

export type AnimalsCreateType = z.infer<typeof AnimalsCreateSchema>;
export type AnimalsType = z.infer<typeof AnimalsSchema>;


//Animalraces:
export const AnimalracesSchema = z.object({
    id: z.number().int(),
    name: z.string(),
    fk_animaltypeid: z.number().int(),
});

export const AnimalracesCreateSchema = AnimalracesSchema;

export type AnimalracesCreateType = z.infer<typeof AnimalracesCreateSchema>;
export type AnimalracesType = z.infer<typeof AnimalracesSchema>;


//Animal has Races:
export const Animal_has_RacesSchema = z.object({
    fk_animalid: z.number().int(),
    fk_animalraceid: z.number().int(),
});

export const Animal_has_RacesCreateSchema = AnimalracesSchema;

export type Animal_has_RacesCreateType = z.infer<typeof Animal_has_RacesCreateSchema>;
export type Animal_has_RacesType = z.infer<typeof Animal_has_RacesSchema>;


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
    fk_personid: z.number().int(),
    fk_animalid: z.number().int(),
});

export const Person_has_AnimalCreateSchema = Person_has_AnimalSchema;

export type Person_has_AnimalCreateType = z.infer<typeof Person_has_AnimalCreateSchema>;
export type Person_has_AnimalType = z.infer<typeof Person_has_AnimalSchema>;

export const ServiceSchema = z.object({
    id: z.number().int(),
    name: z.string().min(1).max(100),
    estimateddurationinminutes: z.number().int().min(0)
});

export type ServiceType = z.infer<typeof ServiceSchema>;


//VeterinaryPractice:
export const VeterinaryPracticeSchema = z.object({
    id: z.number().int(),
    name: z.string().min(5).max(200),
    email: z.email().max(100),
    password: z.string().min(6).max(255),
    phone: z.string().min(5).max(20),
    infoemail: z.email().max(100),
    website: z.url().max(150).nullable(),
    info: z.string().nullable(),
    addresses: AddressesSchema,
    services: z.array(ServiceSchema).optional()
})

export const VeterinaryPracticeCreateSchema = VeterinaryPracticeSchema.omit({
    id: true
}).extend({
    addresses: AddressesCreateSchema
})

export type VeterinaryPracticesCreateType = z.infer<typeof VeterinaryPracticeCreateSchema>;
export type VeterinaryPracticesType = z.infer<typeof VeterinaryPracticeSchema>;

//Veterinarians:
export const VeterinariansSchema = z.object({
    id: z.number().int(), //ist identisch zur Personen ID
    infoemail: z.email().optional(),
    fk_veterinarypractice: z.number().int().optional(),
});

export const VeterinariansCreateSchema = VeterinariansSchema //id muss uebergeben werden, da Referenz zur Person wichtig ist

export type VeterinariansCreateType = z.infer<typeof VeterinariansCreateSchema>;
export type VeterinariansType = z.infer<typeof VeterinariansSchema>;


//Appointments:
export const AppointmentsSchema = z.object({
    id: z.number().int(),
    starttime: z.date(),
    endtime: z.date(),
    fk_animalid: z.number().int().nullable(),
    fk_veterinaryid: z.number().int(),
    fk_veterinarypracticeid: z.number().int(),
    fk_serviceid: z.number().int().nullable(),
});

export const AppointmentsCreateSchema = AppointmentsSchema.omit({
    id: true
})

export const AppointmentsUpdateAsPersonSchema = z.object({
    id: z.number().int(),
    fk_animalid: z.number().int(),
    fk_serviceid: z.number().int()
})

export type AppointmentsUpdateAsPersonType = z.infer<typeof AppointmentsUpdateAsPersonSchema>;
export type AppointmentsCreateType = z.infer<typeof AppointmentsCreateSchema>;
export type AppointmentsType = z.infer<typeof AppointmentsSchema>;