import express from "express";
import { personService } from "../service/personService";

export const userRouter = express.Router();

userRouter.get("/:id/favorites",
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

userRouter.post("/:id/favorites/:practiceId",
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


userRouter.delete("/:id/favorites/:practiceId",
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