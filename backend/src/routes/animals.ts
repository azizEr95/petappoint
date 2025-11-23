import express, { Request } from "express";
import { AnimalracesType, AnimalsCreateSchema, AnimalUpdateSchema, Animal_has_RacesCreateSchema, Animal_has_RacesType, AddRacesToAnimalSchema } from "vetlib-shared/schemas/ZodSchemas";
import { animalService } from "../service/animalService";
import { personService } from "../service/personService";
import { animalRaceService } from "../service/animalRaceService";
import { animalHasRacesService } from "../service/animalHasRacesService";

export const animalsRouter = express.Router();

animalsRouter.post("/",
    async (req, res) => {
        // changing String Date props to Date

        let unsafeAnimal = req.body;
        unsafeAnimal = {
            ...unsafeAnimal,
            dateofbirth: new Date(unsafeAnimal.dateofbirth),
            timeofdeath: unsafeAnimal.timeofdeath !== null ? new Date(unsafeAnimal.timeofdeath) : null
        }
        const parseResult = AnimalsCreateSchema.safeParse(unsafeAnimal);
        if (!parseResult.success) {
            res.status(400).send(parseResult.error);
            return;
        }

        // TODO: After implementing validation get the personId or the
        // identifier for the person from the authentification token
        const personId = 6;

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
        let unsafeAnimal = req.body;
        unsafeAnimal = {
            ...unsafeAnimal,
            dateofbirth: new Date(unsafeAnimal.dateofbirth),
            timeofdeath: unsafeAnimal.timeofdeath !== null ? new Date(unsafeAnimal.timeofdeath) : null
        }

        const animalId = parseInt(req.params.animalId);

        const parseResult = AnimalUpdateSchema.safeParse(unsafeAnimal);
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

animalsRouter.delete('/:animalId',
    async (req, res) => {
        const animalId = parseInt(req.params.animalId);
        try {
            await animalService.delete(animalId);
            res.sendStatus(204);
        } catch (error) {
            res.sendStatus(500);
        }
    }
)

animalsRouter.get('/:animalId/races',
    async (req, res) => {
        const animalId = parseInt(req.params.animalId);
        const animalRaces: AnimalracesType[] = await animalRaceService.getAnimalRaces(animalId);
        return res.send(animalRaces);
    }
)

animalsRouter.post('/:animalId/races',
    async (req, res) => {
        const animalId = parseInt(req.params.animalId);
        const animalRaceData = AddRacesToAnimalSchema.safeParse(req.body);
        if (!animalRaceData.success) {
            res.status(400).send(animalRaceData.error);
            return;
        }
        if (animalId !== animalRaceData.data.animalid) {
            res.status(400).send(`Mismatch in param id '${animalId}' and provided body id '${animalRaceData.data.animalid}'.`);
            return;
        }
        try {
            const animalRace = await animalHasRacesService.create({
                animalid: animalRaceData.data.animalid,
                animalraceids: animalRaceData.data.animalraceids
            });
            res.status(201).send(animalRace);
        } catch (error) {
            res.sendStatus(500);
        }
    }
)

animalsRouter.delete('/:animalId/races',
    async (req, res) => {
        const animalId = parseInt(req.params.animalId);
        try {
            await animalHasRacesService.deleteAllRacesFromAnimal(animalId);
            res.status(204);
        } catch (error) {
            res.sendStatus(500);
        }
    }
)

animalsRouter.delete('/:animalId/races/:raceId',
    async (req, res) => {
        try {
            await animalHasRacesService.delete({
                fk_animalid: parseInt(req.params.animalId),
                fk_animalraceid: parseInt(req.params.raceId)
            });
            res.sendStatus(204);
        } catch (error) {
            res.sendStatus(500);
        }
    }
)

