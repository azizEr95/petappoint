import express from "express";
import { personService } from "../service/personService";
import { AnimalsType, PersonsCreateSchema, PersonsType } from "vetlib-shared/schemas/ZodSchemas";
import { verifyJWT, verifyPasswordAndCreateJWT } from "../service/jwtService";

export const personsRouter = express.Router();

personsRouter.get('/all',
    async (_req, res) => {
        const persons: PersonsType[] = await personService.getAll();
        res.send(persons);
    }
);

personsRouter.get('/:id/animals',
    async (req, res) => {
        try {
            const id = parseInt(req.params.id);
            const animalTypes: AnimalsType[] = await personService.getAnimalsForPersonId(id);
            res.send(animalTypes);
        } catch (ex) {
            res.sendStatus(404);
        }
    }
);

personsRouter.get("/:id/favorites",
    async (req, res) => {
        try {
            const id = parseInt(req.params.id);
            const favoriteIDs: number[] = await personService.getFavorizedVeterinaryPracticeIds(id);
            res.send(favoriteIDs);
        } catch (ex) {
            res.sendStatus(404);
        }
    }
);


personsRouter.post("/",
    async (req, res) => {
        try {
            const personData = PersonsCreateSchema.safeParse(req.body);
            if (!personData.success) {
                res.status(400).send(personData.error);
                return;
            }

            await personService.create(personData.data);

            const jwt = await verifyPasswordAndCreateJWT(personData.data.email, personData.data.password);
            if (!jwt) {
                res.sendStatus(401);
                return;
            }

            const loginResource = verifyJWT(jwt);
            res.cookie('access_token', jwt, {
                httpOnly: true,
                expires: new Date(loginResource.exp * 1000),
                secure: true,
                sameSite: "none"
            });

            res.status(201).send(loginResource);
        } catch (ex) {
            if (String(ex).includes("JSON Web Token ist ungültig")) {
                res.status(400).send("JSON Web Token ist ungültig");
                return;
            }

            res.status(400).send(ex);
            return;
        }
    }
);


personsRouter.post("/:id/favorites/:practiceId",
    async (req, res) => {
        try {
            const id = parseInt(req.params.id);
            const practiceId = parseInt(req.params.practiceId);
            await personService.favorizeVeterinaryPracticesByIds(id, [practiceId]);
            res.sendStatus(201);
        } catch (ex) {
            res.sendStatus(400);
            return;
        }
    }
);



personsRouter.delete("/:id/favorites/:practiceId",
    async (req, res) => {
        try {
            const id = parseInt(req.params.id);
            const practiceId = parseInt(req.params.practiceId);
            await personService.deleteFavorizedVeterinaryPracticeId(id, practiceId);
            res.sendStatus(204);
        } catch (ex) {
            res.sendStatus(400);
            return;
        }
    }
);