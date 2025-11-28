import express from "express";
import { animalTypeService } from "../service/animalTypeService";
import { AnimalTypeType } from "vetlib-shared/schemas/ZodSchemas";
import { animalRaceService } from "../service/animalRaceService";
import { optionalAuthentication } from "./authentication";

export const animaltypeRouter = express.Router();

animaltypeRouter.get("/all",
    optionalAuthentication,
    async (req, res) => {
        const animalTypes: AnimalTypeType[] = await animalTypeService.getAll();
        res.send(animalTypes);
    }
);

animaltypeRouter.get("/races/:animalTypeId",
    optionalAuthentication,
    async (req, res) => {
        try {
            const animalTypeId = parseInt(req.params.animalTypeId);
            const animalRaces: AnimalTypeType[] = await animalRaceService.getAllForAnimalType(animalTypeId);
            res.send(animalRaces);
        } catch (err) {
            res.status(400).send(err);
        }
    }
);