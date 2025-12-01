import { z } from "zod";

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
  dateofbirth: DateTimeSchema.nullable(),
  dateofbirthisexact: z.boolean().nullable(),
  weightingram: z.number().int().nullable(),
  heightincm: z.number().int().nullable(),
  timeofdeath: DateTimeSchema.nullable(),
  iscastrated: z.boolean(),
  lifestyleisindoors: z.boolean(),
  sex: sexes,
  animaltypeid: z.int(),
  animalgroupid: z.int().nullable(),
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
  animaltypeid: PostgresIdSchema,
});

export const AnimalracesCreateSchema = AnimalracesSchema;

export type AnimalracesCreateType = z.infer<typeof AnimalracesCreateSchema>;
export type AnimalracesType = z.infer<typeof AnimalracesSchema>;

//Animal has Races:
export const Animal_has_RacesSchema = z.object({
  animalid: PostgresIdSchema,
  animalrace: z.array(AnimalracesSchema),
});

export const Animal_has_RacesCreateSchema = Animal_has_RacesSchema;
export type Animal_has_RacesCreateType = z.infer<typeof Animal_has_RacesCreateSchema>;
export type Animal_has_RacesType = z.infer<typeof Animal_has_RacesSchema>;

export const AddRacesToAnimalSchema = z.object({
  animalid: PostgresIdSchema,
  animalraceids: z.array(z.number()).min(1),
});
export type AddRacesToAnimalType = z.infer<typeof AddRacesToAnimalSchema>;

//Adressen:
export const AddressesSchema = z.object({
  id: PostgresIdSchema,
  street: z.string().min(3).max(80),
  citycode: z.string().min(3).max(12),
  city: z.string().min(3).max(60),
  country: z.string().min(3).max(150),
  longitude: z.number(),
  latitude: z.number(),
});

export const AddressesCreateSchema = AddressesSchema.omit({
  id: true,
});

export type AddressesCreateType = z.infer<typeof AddressesCreateSchema>;
export type AddressesType = z.infer<typeof AddressesSchema>;

//Persons:
export const PersonsSchema = z.object({
  id: PostgresIdSchema,
  firstname: z.string().min(2).max(60),
  lastname: z.string().min(2).max(60),
  sex: sexes,
  dateofbirth: DateTimeSchema,
  addresses: AddressesSchema,
  phone: z.string().min(5).max(20),
  email: z.email().max(100),
});

export const PersonsCreateSchema = PersonsSchema.omit({
  id: true,
}).extend({
  addresses: AddressesCreateSchema,
  password: z.string().min(6).max(255),
});

export type PersonsCreateType = z.infer<typeof PersonsCreateSchema>;
export type PersonsType = z.infer<typeof PersonsSchema>;

export const PersonsUpdateSchema = PersonsCreateSchema.extend({
  id: z.number(),
  addresses: AddressesSchema,
});
export type PersonsUpdateType = z.infer<typeof PersonsUpdateSchema>;

//person with authentication type
export const RoleSchema = z.enum(["person"]);
export type RoleEnum = z.infer<typeof RoleSchema>;
export const PersonsAuthenticatedSchema = z.object({
  role: RoleSchema,
  id: PostgresIdSchema,
});

export type PersonsAuthenticatedType = z.infer<typeof PersonsAuthenticatedSchema>;

export const loginValidator = z.object({
  email: z.email(),
  password: z.string().max(100).min(8),
});

export type LoginValidatorType = z.infer<typeof loginValidator>;

//Login Type
export const LoginSchema = z.object({
  id: PostgresIdSchema,
  role: RoleSchema,
  exp: z.number(),
});

export type LoginType = z.infer<typeof LoginSchema>;

//Person has Animal:
export const Person_has_AnimalSchema = z.object({
  personid: PostgresIdSchema,
  animals: z.array(AnimalsSchema),
});

export const Person_has_AnimalCreateSchema = Person_has_AnimalSchema;

export type Person_has_AnimalCreateType = z.infer<typeof Person_has_AnimalCreateSchema>;
export type Person_has_AnimalType = z.infer<typeof Person_has_AnimalSchema>;

export const ServiceSchema = z.object({
  id: PostgresIdSchema,
  name: z.string().min(1).max(100),
});

export type ServiceType = z.infer<typeof ServiceSchema>;

//VeterinaryPractice:
export const VeterinaryPracticeSchema = z.object({
  id: PostgresIdSchema,
  name: z.string().min(5).max(200),
  email: z.email().max(100),
  phone: z.string().min(5).max(20),
  infoemail: z.email().max(100),
  website: z.url().max(150).nullable(),
  info: z.string().nullable(),
  addresses: AddressesSchema,
});

export const VeterinaryPracticeCreateSchema = VeterinaryPracticeSchema.omit({
  id: true,
}).extend({
  addresses: AddressesCreateSchema,
  password: z.string().min(6).max(255),
});

export type VeterinaryPracticesCreateType = z.infer<typeof VeterinaryPracticeCreateSchema>;
export type VeterinaryPracticesType = z.infer<typeof VeterinaryPracticeSchema>;

//Veterinarians:
export const VeterinariansSchema = z.object({
  id: PostgresIdSchema, //ist identisch zur Personen ID
  infoemail: z.email().nullable(),
  veterinarypractice: PostgresIdSchema.nullable(),
});

export const VeterinariansCreateSchema = VeterinariansSchema; //id muss uebergeben werden, da Referenz zur Person wichtig ist

export type VeterinariansCreateType = z.infer<typeof VeterinariansCreateSchema>;
export type VeterinariansType = z.infer<typeof VeterinariansSchema>;

//Appointments:
export const AppointmentsSchema = z.object({
  id: PostgresIdSchema,
  starttime: DateTimeSchema,
  endtime: DateTimeSchema,
  animal: AnimalsSchema.nullable(),
  veterinary: VeterinariansSchema,
  veterinarypractice: VeterinaryPracticeSchema,
  service: ServiceSchema.nullable(),
  availableservices: z.array(ServiceSchema),
  notes: z.string().nullable().optional(),
});

export const AppointmentsCreateSchema = z.object({
  starttime: DateTimeSchema,
  endtime: DateTimeSchema,
  animalid: PostgresIdSchema.nullable(),
  veterinaryid: PostgresIdSchema,
  veterinarypracticeid: PostgresIdSchema,
  serviceid: PostgresIdSchema.nullable(),
});

export const BookAppointmentSchema = z.object({
  id: PostgresIdSchema,
  animalid: PostgresIdSchema,
  serviceid: PostgresIdSchema,
});

export type AppointmentsUpdateAsPersonType = z.infer<typeof BookAppointmentSchema>;
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
