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
        const parsed = searchQuerySchema.parse(req.query);
        if (!parsed) {
            return res.sendStatus(400);
        }

        const allVeterinaries: veterinarypractices[] = await veterinaryPracticeService.getByNameOrAdress(parsed.name, parsed.address);
        return res.send(allVeterinaries);
    }
)