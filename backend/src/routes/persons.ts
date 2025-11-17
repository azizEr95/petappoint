import express from "express";
import { personService } from "../service/personService";
import { animalService } from "../service/animalService";

export const personsRouter = express.Router();

personsRouter.get('/all',
    async (_req, res) => {
        const persons = await personService.getAll();
        res.send(persons);
    }
)

personsRouter.get('/:id/animals',
    async (req, res) => {
        try {
            const id = parseInt(req.params.id);
            const ids = await personService.getAnimalsForPersonId(id);
            res.send(ids);
        } catch (ex) {
            res.sendStatus(404);
        }
    }
)
personsRouter.get("/:id/favorites",
    async (req, res) => {
        try {
            const id = parseInt(req.params.id);
            const ids = await personService.getFavorizedVeterinaryPracticeIds(id);
            res.send(ids);
        } catch (ex) {
            res.sendStatus(404);
        }
    }
)

personsRouter.post("/:id/favorites/:practiceId",
    async (req, res) => {
        try {
            const id = parseInt(req.params.id);
            const practiceId = parseInt(req.params.practiceId);
            await personService.favorizeVeterinaryPracticesByIds(id, [practiceId]);
            res.sendStatus(201);
        } catch (ex) {
            res.sendStatus(400);
        }
    }
)


personsRouter.delete("/:id/favorites/:practiceId",
    async (req, res) => {
        try {
            const id = parseInt(req.params.id);
            const practiceId = parseInt(req.params.practiceId);
            await personService.deleteFavorizedVeterinaryPracticeId(id, practiceId);
            res.sendStatus(204);
        } catch (ex) {
            res.sendStatus(400);
        }
    }
)