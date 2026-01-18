import express from "express";
import { veterinaryPracticeService } from "../service/veterinaryPracticeService";
import { appointmentService } from "../service/appointmentService";
import {
  AppointmentsType,
  VeterinaryPracticesType,
  VeterinaryPracticeCreateSchema,
  ServiceType,
  VeterinaryPracticeSearchQuerySchema,
  AnimalTypeType,
  AppointmentFilterSchema,
  VeterinaryPracticeSearchResultType,
  PostgresIdSchema,
  AnimalsType,
  PersonsType,
} from "vetilib-shared/schemas/ZodSchemas";
import { checkVerified, optionalAuthentication, requiresAuthentication } from "./authentication";
import { createJWT, verifyJWT, verifyPasswordAndCreateJWT } from "../service/jwtService";
import { emailService } from "../service/emailService";

export const veterinaryPracticeRouter = express.Router();

veterinaryPracticeRouter.get("/all", optionalAuthentication, async (_req, res) => {
  const allVeterinarians: VeterinaryPracticesType[] = await veterinaryPracticeService.getAll();
  res.send(allVeterinarians);
});

veterinaryPracticeRouter.get("/search", optionalAuthentication, async (req, res) => {
  const validatedQuery = VeterinaryPracticeSearchQuerySchema.parse(req.query);
  const found: VeterinaryPracticeSearchResultType = await veterinaryPracticeService.search(validatedQuery);
  return res.send(found);
});

veterinaryPracticeRouter.get("/:id", optionalAuthentication, async (req, res) => {
  const id = PostgresIdSchema.parse(parseInt(req.params.id));
  const veterinaryPractice: VeterinaryPracticesType = await veterinaryPracticeService.getById(id);
  return res.send(veterinaryPractice);
});

veterinaryPracticeRouter.get("/:id/services", optionalAuthentication, async (req, res) => {
  const id: number = PostgresIdSchema.parse(parseInt(req.params.id));
  const services: ServiceType[] = await veterinaryPracticeService.getServicesForPractice(id);
  return res.send(services);
});

veterinaryPracticeRouter.get("/:id/animaltypes", optionalAuthentication, async (req, res) => {
  const id: number = PostgresIdSchema.parse(parseInt(req.params.id));
  const animalTypes: AnimalTypeType[] = await veterinaryPracticeService.getAllAnimalTypes(id);
  return res.send(animalTypes);
});

veterinaryPracticeRouter.get("/:id/customers", optionalAuthentication, async (req, res) => {
  const id: number = PostgresIdSchema.parse(parseInt(req.params.id));
  const animalWithPersons: { animal: AnimalsType; person: PersonsType }[] = await veterinaryPracticeService.getAnimalWithPerson(id);
  return res.send(animalWithPersons);
})

veterinaryPracticeRouter.get("/:id/appointments", optionalAuthentication, async (req, res) => {
  const id: number = PostgresIdSchema.parse(parseInt(req.params.id));
  const parsedFilter = AppointmentFilterSchema.safeParse(req.query);
  const veterinaryPracticeAppointments: AppointmentsType[] = await appointmentService.getForPractice(
    id,
    parsedFilter.data
  );
  return res.send(veterinaryPracticeAppointments);
});

veterinaryPracticeRouter.get("/:id/appointments/available", optionalAuthentication, async (req, res) => {
  const id: number = PostgresIdSchema.parse(parseInt(req.params.id));

  const parsedFilter = AppointmentFilterSchema.safeParse(req.query);
  const availableAppointments: AppointmentsType[] = await appointmentService.getAvailableAppointmentsForPractice(
    id,
    parsedFilter.data
  );
  return res.send(availableAppointments);
});

veterinaryPracticeRouter.get('/:practiceId/veterinarians', optionalAuthentication, async (req, res) => {
  const id: number = PostgresIdSchema.parse(parseInt(req.params.practiceId));
  const veterinarians = await veterinaryPracticeService.getAllVeterinarians(id);
  return res.send(veterinarians);
});

veterinaryPracticeRouter.get("/:id/appointments/booked", optionalAuthentication, async (req, res) => {
  const id: number = PostgresIdSchema.parse(parseInt(req.params.id));

  const parsedFilter = AppointmentFilterSchema.safeParse(req.query);
  const availableAppointments: AppointmentsType[] = await appointmentService.getBookedAppointmentsForPractice(
    id,
    parsedFilter.data
  );
  return res.send(availableAppointments);
});

veterinaryPracticeRouter.post("/", optionalAuthentication,
  async (req, res) => {
  const validatedBody = VeterinaryPracticeCreateSchema.parse(req.body);
  
  const createdVeterinaryPractice: VeterinaryPracticesType = await veterinaryPracticeService.create(validatedBody);

  // TODO: Email Confirmation
  // TODO: Code verification for companies?
  await emailService.sendConfirmationEmailVetPractices(createdVeterinaryPractice)
  const jwt = await verifyPasswordAndCreateJWT(validatedBody.email,validatedBody.password);
  if (!jwt) {
    res.sendStatus(401);
    return;
  }

  const userdata = verifyJWT(jwt);
  res.cookie('access_token', jwt, {
    httpOnly: true,
    expires: new Date(userdata.exp * 1000),
    secure: true,
    sameSite: "none"
  });

  res.status(201).send(userdata);
});
