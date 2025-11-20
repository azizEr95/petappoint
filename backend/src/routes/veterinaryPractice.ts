import express from "express";
import { veterinaryPracticeService } from "../service/veterinaryPracticeService"
import { veterinarypractices } from "../../generated/prisma";
import { z } from 'zod';
import { appointmentService } from "../service/appointmentService";
import { VeterinaryPracticeCreateSchema, VeterinarySearchQuerySchema } from "vetlib-shared/schemas/ZodSchemas";

export const veterinaryPracticeRouter = express.Router();

veterinaryPracticeRouter.get("/all",
    async (_req, res) => {
        const allVeterinaries: veterinarypractices[] = await veterinaryPracticeService.getAll();
        res.send(allVeterinaries);
    }
)

veterinaryPracticeRouter.get('/search',
    async (req, res) => {
        const parsed = VeterinarySearchQuerySchema.safeParse(req.query);
        if (!parsed.success) {
            return res.sendStatus(400);
        }

        const allVeterinaries: veterinarypractices[] = await veterinaryPracticeService.getByNameOrAdress(parsed.data.name, parsed.data.address);
        return res.send(allVeterinaries);
    }
)

veterinaryPracticeRouter.get('/:id',
    async (req, res) => {
        try {
            const veterinaryPractice = await veterinaryPracticeService.getById(req.params.id);
            return res.send(veterinaryPractice);
        } catch (ex) {
            return res.sendStatus(404);
        }
    }
)


veterinaryPracticeRouter.get('/:id/appointments',
    async (req, res) => {
        try {
            const id: number = parseInt(req.params.id);
            const veterinaryPractice = await appointmentService.getForPractice(id);
            return res.send(veterinaryPractice);
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

        const veterinaryPractice = await appointmentService.getAvailableAppointmentsForPractice(id);
        return res.send(veterinaryPractice);
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
            const vetRes = await veterinaryPracticeService.create(createdVet.data);
            res.sendStatus(200).send(vetRes);
        } catch (error) {
            next(error);
        }
    }
)