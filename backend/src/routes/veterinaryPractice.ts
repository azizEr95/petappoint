import express from "express";
import { veterinaryPracticeService } from "../service/veterinaryPracticeService"
import { veterinarypractices } from "../../generated/prisma";

export const veterinaryPracticeRouter = express.Router();

veterinaryPracticeRouter.get("/all", 
    async (_req, res) => {
        const allVeterinaries: veterinarypractices[] = await veterinaryPracticeService.getAll();
        res.send(allVeterinaries);
    }
)

veterinaryPracticeRouter.get("/:nameORadress", 
    async (req, res) => {
        if(!req.params) {
            res.sendStatus(404);
            return;
        }
        const allVeterinaries: veterinarypractices[] = await veterinaryPracticeService.getByNameOrAdress(req.params.nameORadress);
        res.send(allVeterinaries);
    }
)