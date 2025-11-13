import express from "express";
import { veterinaryPracticeService } from "../service/veterinaryPracticeService"
import { veterinarypractices } from "../../generated/prisma";
import { z } from 'zod';

export const veterinaryPracticeRouter = express.Router();

veterinaryPracticeRouter.get("/all",
    async (_req, res) => {
        const allVeterinaries: veterinarypractices[] = await veterinaryPracticeService.getAll();
        res.send(allVeterinaries);
    }
)

const searchQuerySchema = z.object({
    name: z.string().default(''),
    address: z.string().default(''),
});

veterinaryPracticeRouter.get('/search',
    async (req, res) => {
        const parsed = searchQuerySchema.safeParse(req.query);
        if (!parsed.success) {
            return res.sendStatus(400);
        }

        const allVeterinaries: veterinarypractices[] = await veterinaryPracticeService.getByNameOrAdress(parsed.data.name, parsed.data.address);
        return res.send(allVeterinaries);
    }
)

veterinaryPracticeRouter.get('/:id',
    async (req, res) => {
        const veterinaryPractice = await veterinaryPracticeService.getById(req.params.id);
        return res.send(veterinaryPractice);
    }
)

// TO-DO: erstellen von tierarztpraxen

veterinaryPracticeRouter.post("/",
    async (req, res) => {
        // validation schema
        const adressSchema = z.object({
            street: z.string().min(3).max(100),
            citycode: z.string().min(3).max(100),
            city: z.string().min(3).max(100),
            country: z.string().min(3).max(100),
            longitude: z.number().default(0.0),
            latitude: z.number().default(0.0)
        })
        const vetinarySchema = z.object({
            name: z.string().min(3).max(100),
            phone: z.string().min(3).max(100),
            infoemail: z.email(),
            email: z.email(),
            password: z.string().min(12).max(100),
            website: z.string().max(100).default(''),
            info: z.string().max(100).default(''),
            addresses: adressSchema
        })
        const createdVet = vetinarySchema.safeParse(req.params);
        if (!createdVet.success) {
            return res.sendStatus(400);
        }
        const vetRes = await veterinaryPracticeService.create(createdVet.data);

        res.sendStatus(200);
        return;
    }
)