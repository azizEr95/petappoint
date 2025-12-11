import express from "express";
import { AnimalTypeType, PostgresIdSchema, } from "vetilib-shared/schemas/ZodSchemas";
import { optionalAuthentication } from "./authentication";
import { animalTypeService } from "../service/animalTypeService";

export const veterinariansRouter = express.Router();

veterinariansRouter.get("/:id/animaltypes", optionalAuthentication, async (req, res) => {
    const veterinaryId = PostgresIdSchema.parse(parseInt(req.params.id));
    const treatableAnimalTypes: AnimalTypeType[] = await animalTypeService.getTreatableTypesForVeterinaryId(veterinaryId);
    res.send(treatableAnimalTypes);
});