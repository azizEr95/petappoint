import express, {Request} from "express";
import { AnimalracesType, AnimalsCreateSchema, AnimalUpdateSchema, Animal_has_RacesCreateSchema, Animal_has_RacesType} from "vetlib-shared/schemas/ZodSchemas";
import { animalService } from "../service/animalService";
import { personService } from "../service/personService";
import { animalRaceService } from "../service/animalRaceService";
import { animalHasRacesService } from "../service/animalHasRacesService";

export const animalsRouter = express.Router();

animalsRouter.post("/",
    async (req, res) => {
        // changing String Date props to Date
        req.body = changeStringToDate(req);
        const parseResult = AnimalsCreateSchema.safeParse(req.body);
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
        req.body = changeStringToDate(req);
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

animalsRouter.post('/:animalId/races',
    async (req, res) => {
        const animalId = parseInt(req.params.animalId);
        const animalRaceData = Animal_has_RacesCreateSchema.safeParse(req.body);
        if(!animalRaceData.success) {
            res.status(400).send(animalRaceData.error);
            return;
        }
        if(animalId !== animalRaceData.data.fk_animalid){
            res.status(400).send(`Mismatch in param id '${animalId}' and provided body id '${animalRaceData.data.fk_animalid}'.`);
            return;
        }
        try {
            const animalRace = await animalHasRacesService.create(animalRaceData.data);
            res.status(201).send(animalRace);
        } catch (error) {
            res.sendStatus(500);
        }
    }
)

animalsRouter.delete('/:animalId/races/:raceId',
    async (req, res) => {
        const data: Animal_has_RacesType = {
            fk_animalid: parseInt(req.params.animalId),
            fk_animalraceid: parseInt(req.params.raceId)
        }
        try {
            await animalHasRacesService.delete(data);
            res.sendStatus(204);   
        } catch (error) {
            res.sendStatus(500);
        }
    }
)
// internal function to change request properties dateOfBirth and timeofdeath
function changeStringToDate(req: Request): Request {
    req.body.dateofBirth = new Date(req.body.dateofBirth);
    req.body.timeofdeath = new Date(req.body.timeofdeath);
    return req;
}

