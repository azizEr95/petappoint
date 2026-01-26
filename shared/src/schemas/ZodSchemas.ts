import { z } from "zod/v4";

export const PostgresIdSchema = z.number().int();
export type PostgresIdType = z.infer<typeof PostgresIdSchema>;

const ArrayOfIDs = z
  .union([z.string(), z.array(z.string())])
  .optional()
  .transform((val) => {
    if (!val) {
      return undefined;
    }

    const array = Array.isArray(val) ? val : val.split(",");
    return array
      .map((s) => s.trim())
      .filter((s) => s.length > 0)
      .map(Number)
      .filter((n) => !isNaN(n) && Number.isInteger(n));
  });

const DateTimeSchema = z.iso.datetime().transform((str) => new Date(str));

const lifestyles = z.enum(["indoor", "outdoor", "mixed"]);

//Animalgroup:
export const AnimalGroupSchema = z.object({
  id: PostgresIdSchema,
  name: z.string(),
});

export const AnimalGroupCreateSchema = AnimalGroupSchema.omit({
  //alles ohne id (das was beim Erstellen von Objekt vorhanden sein muss)
  id: true,
});

export type AnimalGroupCreateType = z.infer<typeof AnimalGroupCreateSchema>;
export type AnimalGroupType = z.infer<typeof AnimalGroupSchema>;

//Animaltype:
export const AnimalTypeSchema = z.object({
  id: PostgresIdSchema,
  name: z.string(),
});

export const AnimalTypeCreateSchema = AnimalTypeSchema.omit({
  //alles ohne id
  id: true,
});

export type AnimalTypeCreateType = z.infer<typeof AnimalTypeCreateSchema>;
export type AnimalTypeType = z.infer<typeof AnimalTypeSchema>;

//Animal:
const sexes = z.enum(["not_known", "male", "female", "not_applicable"]);
export type sexesType = z.infer<typeof sexes>;

export const AnimalsSchema = z.object({
  id: PostgresIdSchema,
  name: z.string().min(1).max(100),
  dateOfBirth: DateTimeSchema.nullable(),
  dateOfBirthIsExact: z.boolean().nullable(),
  weightInGram: z.number().int().nullable(),
  heightInCm: z.number().int().nullable(),
  timeOfDeath: DateTimeSchema.nullable(),
  isCastrated: z.boolean(),
  lifestyle: lifestyles,
  sex: sexes,
  animalTypeId: z.int(),
  animalGroupId: z.int().nullable(),
});

export const AnimalsCreateSchema = AnimalsSchema.omit({
  id: true,
});

export type AnimalsCreateType = z.infer<typeof AnimalsCreateSchema>;
export type AnimalsType = z.infer<typeof AnimalsSchema>;

//Animalraces:
export const AnimalracesSchema = z.object({
  id: PostgresIdSchema,
  name: z.string(),
  animalTypeId: PostgresIdSchema,
});

export const AnimalracesCreateSchema = AnimalracesSchema;

export type AnimalracesCreateType = z.infer<typeof AnimalracesCreateSchema>;
export type AnimalracesType = z.infer<typeof AnimalracesSchema>;

//Animal has Races:
export const Animal_has_RacesSchema = z.object({
  animalId: PostgresIdSchema,
  animalrace: z.array(AnimalracesSchema),
});

export const Animal_has_RacesCreateSchema = Animal_has_RacesSchema;
export type Animal_has_RacesCreateType = z.infer<typeof Animal_has_RacesCreateSchema>;
export type Animal_has_RacesType = z.infer<typeof Animal_has_RacesSchema>;

export const AddRacesToAnimalSchema = z.object({
  animalId: PostgresIdSchema,
  animalraceids: z.array(z.number()).min(1),
});
export type AddRacesToAnimalType = z.infer<typeof AddRacesToAnimalSchema>;

//Adressen:
export const AddressesSchema = z.object({
  id: PostgresIdSchema,
  street: z.string().min(3).max(80),
  cityCode: z.string().min(3).max(12),
  city: z.string().min(3).max(60),
  country: PostgresIdSchema,
  longitude: z.number(),
  latitude: z.number(),
});

export const AddressesCreateSchema = AddressesSchema.omit({
  id: true,
});

export const AddressesUpdateSchema = AddressesSchema;

export type AddressesUpdateType = z.infer<typeof AddressesUpdateSchema>;
export type AddressesCreateType = z.infer<typeof AddressesCreateSchema>;
export type AddressesType = z.infer<typeof AddressesSchema>;

//Persons:
export const PersonsSchema = z.object({
  id: PostgresIdSchema,
  firstName: z.string().min(2).max(60),
  lastName: z.string().min(2).max(60),
  sex: sexes,
  dateOfBirth: DateTimeSchema,
  address: AddressesSchema,
  phone: z.string().min(5).max(20),
  email: z.email().max(100),
});

export const PersonsCreateSchema = PersonsSchema.omit({
  id: true,
}).extend({
  address: AddressesCreateSchema,
  password: z.string().min(8).max(255),
});

export type PersonsCreateType = z.infer<typeof PersonsCreateSchema>;
export type PersonsType = z.infer<typeof PersonsSchema>;

export const PersonsUpdateSchema = PersonsCreateSchema.extend({
  id: z.number(),
  address: AddressesSchema,
  password: z.string().min(8).max(255).optional(),
});
export type PersonsUpdateType = z.infer<typeof PersonsUpdateSchema>;

//person with authentication type
export const RoleSchema = z.enum(["person", "company"]);
export type RoleEnum = z.infer<typeof RoleSchema>;
export const AuthenticatedSchema = z.object({
  role: RoleSchema,
  id: PostgresIdSchema,
});

export type AuthenticatedType = z.infer<typeof AuthenticatedSchema>;

export const loginValidator = z.object({
  email: z.email(),
  password: z.string().max(100).min(8)
});

export type LoginValidatorType = z.infer<typeof loginValidator>;

//Login Type
export const LoginSchema = z.object({
  id: PostgresIdSchema,
  role: RoleSchema,
  verified: z.boolean(),
  exp: z.number(),
});

export type LoginType = z.infer<typeof LoginSchema>;


//Person has Animal:
export const Person_has_AnimalSchema = z.object({
  personId: PostgresIdSchema,
  animals: z.array(AnimalsSchema),
});

export const Person_has_AnimalCreateSchema = Person_has_AnimalSchema;

export type Person_has_AnimalCreateType = z.infer<typeof Person_has_AnimalCreateSchema>;
export type Person_has_AnimalType = z.infer<typeof Person_has_AnimalSchema>;

export const ServiceSchema = z.object({
  id: PostgresIdSchema,
  name: z.string().min(1).max(100),
});

export const ServiceSchemaArray = z.array(ServiceSchema);

export type ServiceType = z.infer<typeof ServiceSchema>;

//VeterinaryPractice:
export const VeterinaryPracticeSchema = z.object({
  id: PostgresIdSchema,
  name: z.string().min(5).max(200),
  email: z.email().max(100),
  phone: z.string().min(5).max(20),
  infoEmail: z.email().max(100),
  website: z.url().max(150).nullable(),
  info: z.string().nullable(),
  address: AddressesSchema,
});

export const VeterinaryPracticeCreateSchema = VeterinaryPracticeSchema.omit({
  id: true,
}).extend({
  address: AddressesCreateSchema,
  password: z.string().min(6).max(255),
});

export const VeterinaryPracticeUpdateSchema = VeterinaryPracticeSchema.omit({
  id: true,
}).extend({
  address: AddressesUpdateSchema,
});

export type VeterinaryPracticesCreateType = z.infer<typeof VeterinaryPracticeCreateSchema>;
export type VeterinaryPracticeUpdateType = z.infer<typeof VeterinaryPracticeUpdateSchema>;
export type VeterinaryPracticesType = z.infer<typeof VeterinaryPracticeSchema>;

//Veterinarians:
export const VeterinariansSchema = z.object({
  id: PostgresIdSchema, //ist identisch zur Personen ID
  firstName: z.string().min(2).max(60),
  lastName: z.string().min(2).max(60),
  infoEmail: z.email().nullable(),
  fk_veterinarypracticeid: PostgresIdSchema.nullable(),
});

export const VeterinariansDbSchema = z.object({
  id: PostgresIdSchema, //ist identisch zur Personen ID
  infoEmail: z.email().nullable(),
  fk_veterinarypracticeid: PostgresIdSchema.nullable(),
});

export const VeterinariansUpdateSchema = VeterinariansSchema

export const VeterinariansCreateSchema = VeterinariansSchema; //id muss uebergeben werden, da Referenz zur Person wichtig ist

export type VeterinariansCreateType = z.infer<typeof VeterinariansCreateSchema>;
export type VeterinariansUpdateType = z.infer<typeof VeterinariansUpdateSchema>;
export type VeterinariansDbType = z.infer<typeof VeterinariansDbSchema>;
export type VeterinariansType = z.infer<typeof VeterinariansSchema>;

//Veterinary Can Treat AnimalType:
export const VeterinaryAnimaltypesSchema = z.object({
  veterinaryId: PostgresIdSchema,
  animalTypeIds: z.array(PostgresIdSchema),
});

export type VeterinaryAnimaltypesType = z.infer<typeof VeterinaryAnimaltypesSchema>;

//Veterinary Has Service:
export const VeterinaryServicesSchema = z.object({
  veterinaryId: PostgresIdSchema,
  serviceIds: z.array(PostgresIdSchema),
});

export type VeterinaryServicesType = z.infer<typeof VeterinaryServicesSchema>;

//Appointments:
export const AppointmentsSchema = z.object({
  id: PostgresIdSchema,
  startTime: DateTimeSchema,
  endTime: DateTimeSchema,
  animal: AnimalsSchema.nullable(),
  veterinary: VeterinariansSchema,
  veterinaryPractice: VeterinaryPracticeSchema,
  service: ServiceSchema.nullable(),
  availableServices: z.array(ServiceSchema),
  notes: z.string().nullable().optional(),
});

export const AppointmentsCreateSchema = z.object({
  startTime: DateTimeSchema,
  endTime: DateTimeSchema,
  veterinaryId: PostgresIdSchema,
  fk_veterinarypracticeid: PostgresIdSchema,
  availableServiceIds: PostgresIdSchema.array().optional().default([]),
  endDate: DateTimeSchema.optional(),
});

export const AvailableAppointmentSchema = z.object({
  startTime: DateTimeSchema.optional(),
  endTime: DateTimeSchema.optional(),
  veterinaryId: PostgresIdSchema.optional(),
  availableServiceIds: PostgresIdSchema.array().optional().default([]),
})

export const EventSchema = z.object({
    appointmentId: z.number(),
    oneDayReminder: z.boolean(),
});

export type EventType = z.infer<typeof EventSchema>;

export const BookAppointmentSchema = z.object({
  id: PostgresIdSchema,
  animalId: PostgresIdSchema,
  serviceId: PostgresIdSchema,
});

export type AppointmentsUpdateAsPersonType = z.infer<typeof BookAppointmentSchema>;
export type UpdateAvailableAppointment = z.infer<typeof AvailableAppointmentSchema>;
export type AppointmentsCreateType = z.infer<typeof AppointmentsCreateSchema>;
export type AppointmentsType = z.infer<typeof AppointmentsSchema>;

export const AppointmentFilterSchema = z.object({
  animalTypeIds: ArrayOfIDs.optional(),
  serviceTypeIds: ArrayOfIDs.optional(),
  animal: z.number().optional(), // only for Frontend to propagate filteredAnimal through components
});

export type AppointmentFilterType = z.infer<typeof AppointmentFilterSchema>;

export const AnimalUpdateSchema = AnimalsSchema;
export type AnimalUpdateType = z.infer<typeof AnimalUpdateSchema>;

export const VeterinaryPracticeSearchQuerySchema = z.object({
  name: z.string().default(""),
  address: z.string().default(""),
  animalTypeIds: ArrayOfIDs,
  serviceTypeIds: ArrayOfIDs,
  page: z
    .string()
    .optional()
    .transform((val) => (val ? parseInt(val) : 1)),
  pageSize: z
    .string()
    .optional()
    .transform((val) => (val ? parseInt(val) : 10)),
});

export type VeterinaryPracticeSearchQueryType = z.infer<typeof VeterinaryPracticeSearchQuerySchema>;

export const VeterinaryPracticeSearchResultSchema = z.object({
  data: z.array(VeterinaryPracticeSchema),
  total: z.number().int(),
  page: z.number().int(),
  pageSize: z.number().int(),
});

export type VeterinaryPracticeSearchResultType = z.infer<typeof VeterinaryPracticeSearchResultSchema>;

export const CountrySchema = z.object({
  id: PostgresIdSchema,
  code: z.string().min(1).max(3),
  name: z.string()
});

export type CountryType = z.infer<typeof CountrySchema>;

export const VeterinariansWithAnimalTypesSchema = z.object({
  id: PostgresIdSchema,
  treatableAnimalTypes: z.array(PostgresIdSchema),
});

export type VeterinariansWithAnimalTypesType = z.infer<typeof VeterinariansWithAnimalTypesSchema>;