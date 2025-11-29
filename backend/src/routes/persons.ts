import express from "express";
import { personService } from "../service/personService";
import { AnimalsType, PersonsCreateSchema, PersonsType, PostgresIdSchema } from "vetlib-shared/schemas/ZodSchemas";
import { verifyJWT, verifyPasswordAndCreateJWT } from "../service/jwtService";
import { optionalAuthentication, requiresAuthentication } from "./authentication";
import { AuthorizationError } from "../exceptions/errors/AuthorizationError";

export const personsRouter = express.Router();

personsRouter.get('/all',
    requiresAuthentication,
    async (_req, res) => {
        const persons: PersonsType[] = await personService.getAll();
        res.send(persons);
    }
);

personsRouter.get('/:id/animals',
    requiresAuthentication,
    async (req, res) => {
        const id = PostgresIdSchema.parse(parseInt(req.params.id));

        if (id !== req.userId!) {
            throw new AuthorizationError(`person(${req.userId!}) tried to access animals of person(${id}).`);
        }

        const animalTypes: AnimalsType[] = await personService.getAnimalsForPersonId(id);
        res.send(animalTypes);
    }
);

personsRouter.get("/:id/favorites",
    requiresAuthentication,
    async (req, res) => {
        const id = PostgresIdSchema.parse(parseInt(req.params.id));
        
        if (id !== req.userId!) {
            throw new AuthorizationError(`person(${req.userId!}) tried to access favorites of person(${id}).`);
        }

        const favoriteIDs: number[] = await personService.getFavorizedVeterinaryPracticeIds(id);
        res.send(favoriteIDs);
    }
);


personsRouter.post("/",
    optionalAuthentication,
    async (req, res) => {
        const validatedBody = PersonsCreateSchema.parse(req.body);

        await personService.create(validatedBody);

        const jwt = await verifyPasswordAndCreateJWT(validatedBody.email, validatedBody.password);
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
    }
);


personsRouter.post("/:id/favorites/:practiceId",
    requiresAuthentication,
    async (req, res) => {
        const id = PostgresIdSchema.parse(parseInt(req.params.id));
        const practiceId = PostgresIdSchema.parse(parseInt(req.params.practiceId));

        if (id !== req.userId!) {
            throw new AuthorizationError(`person(${req.userId!}) tried to write favorites of person(${id}).`);
        }

        await personService.favorizeVeterinaryPracticesByIds(id, [practiceId]);

        res.sendStatus(201);
    }
);



personsRouter.delete("/:id/favorites/:practiceId",
    requiresAuthentication,
    async (req, res) => {
        const id = PostgresIdSchema.parse(parseInt(req.params.id));
        const practiceId = PostgresIdSchema.parse(parseInt(req.params.practiceId));

        await personService.deleteFavorizedVeterinaryPracticeId(id, practiceId);

        res.sendStatus(204);
    }
);