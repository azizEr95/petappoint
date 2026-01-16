import express from "express";
import { CountryType, PostgresIdSchema } from "vetilib-shared/schemas/ZodSchemas";
import { optionalAuthentication } from "./authentication";
import { countryService } from "../service/countryService";

export const countryRouter = express.Router();

countryRouter.get("/all",
    optionalAuthentication,
    async (_req, res) => {
        const countryTypes: CountryType[] = await countryService.getAll();
        res.send(countryTypes);
    }
);

countryRouter.get("/:id",
    optionalAuthentication,
    async (req, res) => {
        const countryId = PostgresIdSchema.parse(parseInt(req.params.animalId));
        const countryType: CountryType = await countryService.getById(countryId);
        res.send(countryType);
    }
);