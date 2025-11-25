import express from "express";
import { ServiceType } from "vetlib-shared/schemas/ZodSchemas";
import { serviceService } from "../service/serviceServices";

export const serviceRouter = express.Router();

serviceRouter.get('/all',
    async (_req, res) => {
        const services: ServiceType[] = await serviceService.getAll();
        res.send(services);
    }
);

serviceRouter.get('/all/available',
    async (_req, res) => {
        const services: ServiceType[] = await serviceService.getAllAvailable();
        res.send(services);
    }
);