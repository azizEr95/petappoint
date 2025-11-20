import express from "express";
import { AnimalracesType, AnimalsCreateSchema, AnimalUpdateSchema } from "vetlib-shared/schemas/ZodSchemas";
import { animalService } from "../service/animalService";
import { personService } from "../service/personService";
import { animalRaceService } from "../service/animalRaceService";

export const animalsRouter = express.Router();

animalsRouter.post("/",
    async (req, res) => {
        const parseResult = AnimalsCreateSchema.safeParse(req.body);
        if (!parseResult.success) {
            res.status(400).send(parseResult.error);
            return;
        }

        // TODO: After implementing validation get the personId or the
        // identifier for the person from the authentification token
        const personId = 1;

        const creationData = parseResult.data;

        // Create new animal
        const animal = await animalService.create(creationData);

        // Connect animal to requestor
        await personService.connectAnimal(personId, animal.id);
        
        res.send(animal);
    }
);

animalsRouter.put('/:animalId',
    async (req, res) => {
        const animalId = parseInt(req.params.animalId);
        const parseResult = AnimalUpdateSchema.safeParse(req.body);
        if (!parseResult.success) {
            res.status(400).send(parseResult.error);
            return;
        }

        if (animalId !== parseResult.data.id) {
            res.status(400).send(`Mismatch in param id '${animalId}' and provided body id '${parseResult.data.id}'.`);
            return;
        }

        const animal = await animalService.update(parseResult.data);
        return res.send(animal);
    }
);

animalsRouter.get('/:animalId/races',
    async (req, res) => {
        const animalId = parseInt(req.params.animalId);
        const animalRaces: AnimalracesType[] = (await animalRaceService.getAnimalRaces(animalId)).map(x => x.animalraces);
        return res.send(animalRaces);
    }
)