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
} from "vetilib-shared/schemas/ZodSchemas";
import { optionalAuthentication, requiresAuthentication } from "./authentication";

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

// TO-DO: erstellen von tierarztpraxen

veterinaryPracticeRouter.post("/", requiresAuthentication, async (req, res, next) => {
  const validatedBody = VeterinaryPracticeCreateSchema.parse(req.body);
  const vetRes: VeterinaryPracticesType = await veterinaryPracticeService.create(validatedBody);
  res.send(vetRes);
});
