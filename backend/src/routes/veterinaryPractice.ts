import express from "express";
import { veterinaryPracticeService } from "../service/veterinaryPracticeService"
import { z } from 'zod';
import { appointmentService } from "../service/appointmentService";
import { AppointmentsType, VeterinaryPracticesType, VeterinaryPracticeCreateSchema, VeterinarySearchQuerySchema, ServiceType } from "vetlib-shared/schemas/ZodSchemas";

export const veterinaryPracticeRouter = express.Router();

veterinaryPracticeRouter.get("/all",
    async (_req, res) => {
        const allVeterinaries: VeterinaryPracticesType[] = await veterinaryPracticeService.getAll();
        res.send(allVeterinaries);
    }
)

veterinaryPracticeRouter.get('/search',
    async (req, res) => {
        const parsed = VeterinarySearchQuerySchema.safeParse(req.query);
        if (!parsed.success) {
            return res.sendStatus(400);
        }

        const allVeterinaries: VeterinaryPracticesType[] = await veterinaryPracticeService.getByNameOrAdress(parsed.data.name, parsed.data.address);
        return res.send(allVeterinaries);
    }
)

veterinaryPracticeRouter.get('/:id',
    async (req, res) => {
        try {
            const veterinaryPractice: VeterinaryPracticesType = await veterinaryPracticeService.getById(req.params.id);
            return res.send(veterinaryPractice);
        } catch (ex) {
            return res.sendStatus(404);
        }
    }
)

veterinaryPracticeRouter.get('/:id/services',
    async (req, res) => {
        try {
            const id: number = parseInt(req.params.id);
            const services: ServiceType[] = await appointmentService.getServicesForPractice(id);
            return res.send(services);
        } catch (ex) {
            return res.sendStatus(404);
        }
    }
)

veterinaryPracticeRouter.get('/:id/appointments',
    async (req, res) => {
        try {
            const id: number = parseInt(req.params.id);
            const veterinaryPracticeAppointments: AppointmentsType[] = await appointmentService.getForPractice(id);
            return res.send(veterinaryPracticeAppointments);
        } catch (ex) {
            return res.sendStatus(404);
        }
    }
)

veterinaryPracticeRouter.get('/:id/appointments/available',
    async (req, res) => {
        const id: number = parseInt(req.params.id);
        if (!id) {
            return res.sendStatus(400);
        }

        const availableAppointments: AppointmentsType[] = await appointmentService.getAvailableAppointmentsForPractice(id);
        return res.send(availableAppointments);
    }
)

// TO-DO: erstellen von tierarztpraxen

veterinaryPracticeRouter.post("/",
    async (req, res, next) => {
        const createdVet = VeterinaryPracticeCreateSchema.safeParse(req.body);
        if (!createdVet.success) {
            res.sendStatus(400);
            return;
        }
        try {
            const vetRes: VeterinaryPracticesType = await veterinaryPracticeService.create(createdVet.data);
            res.send(vetRes);
        } catch (error) {
            next(error);
        }
    }
)