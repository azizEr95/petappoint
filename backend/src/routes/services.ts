import express from "express";
import { ServiceType } from "vetlib-shared/schemas/ZodSchemas";
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
