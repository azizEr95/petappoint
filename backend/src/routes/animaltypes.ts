import express from "express";
import { animalTypeService } from "../service/animalTypeService";
import { AnimalTypeType, PostgresIdSchema } from "petappoint-shared/schemas/ZodSchemas";
import { animalRaceService } from "../service/animalRaceService";
import { optionalAuthentication } from "./authentication";

export const animaltypeRouter = express.Router();

animaltypeRouter.get("/all",
    optionalAuthentication,
    async (_req, res) => {
        const animalTypes: AnimalTypeType[] = await animalTypeService.getAll();
        res.send(animalTypes);
    }
);

animaltypeRouter.get("/:animalTypeId",
    optionalAuthentication,
    async (req, res) => {
        const animalTypeId = PostgresIdSchema.parse(parseInt(req.params.animalTypeId));
        const animalType: AnimalTypeType = await animalTypeService.getById(animalTypeId);
        res.send(animalType);
    }
);

animaltypeRouter.get("/races/:animalTypeId",
    optionalAuthentication,
    async (req, res) => {
        const animalTypeId = PostgresIdSchema.parse(parseInt(req.params.animalTypeId));
        const animalRaces: AnimalTypeType[] = await animalRaceService.getAllForAnimalType(animalTypeId);
        res.send(animalRaces);
    }
);