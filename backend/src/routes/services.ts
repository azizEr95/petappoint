import express from "express";
import { PostgresIdSchema, ServiceType } from "vetilib-shared/schemas/ZodSchemas";
import { serviceService } from "../service/serviceService";
import { optionalAuthentication, requiresAuthentication } from "./authentication";

export const serviceRouter = express.Router();

serviceRouter.get("/all", optionalAuthentication, async (_req, res) => {
  const services: ServiceType[] = await serviceService.getAll();
  res.send(services);
});

serviceRouter.get("/all/available", optionalAuthentication, async (_req, res) => {
  const services: ServiceType[] = await serviceService.getAllAvailable();
  res.send(services);
});

serviceRouter.get('/veterinary/:id', optionalAuthentication, async (req, res) => {
  const id: number = PostgresIdSchema.parse(parseInt(req.params.id));
  const services: ServiceType[] = await serviceService.getAvailableServicesForVeterinary(id);
  res.send(services);
});