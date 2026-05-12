import express, { Request } from "express";
import { personService } from "../service/personService";
import { veterinaryService } from "../service/veterinaryService";
import { AnimalsType, PersonsCreateSchema, PersonsType, PersonsUpdateSchema, PostgresIdSchema } from "petappoint-shared/schemas/ZodSchemas";
import { verifyJWT, verifyPasswordAndCreateJWT } from "../service/jwtService";
import { emailService } from "../service/emailService";
import { optionalAuthentication, requiresAuthentication, requiresPerson } from "./authentication";
import { AuthorizationError } from "../exceptions/errors/AuthorizationError";
import multer from "multer";
import { ConstraintError } from "../exceptions/errors/ConstraintError";
import z from "zod";
import { veterinaryPracticeService } from "../service/veterinaryPracticeService";


export const personsRouter = express.Router();

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "public/uploads/persons");
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        cb(null, file.fieldname + "-" + uniqueSuffix + "." + file.originalname.split(".").pop());
    },
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 2 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
        if (!file.mimetype.startsWith("image/")) {
            return cb(new Error("Only images are allowed"));
        }
        cb(null, true);
    },
});

async function ensurePersonIsCustomer(personId: number, praxisId: number) {
    const hasAccess = await veterinaryPracticeService.isPersonACustomerOfPractice(personId, praxisId);
    if (!hasAccess) {
        throw new AuthorizationError("");
    }
}

async function ensureCallerHasAccess(req: Request, personId: number) {
    switch (req.role) {
        case 'person': {
            if (personId !== req.userId!) {
                throw new AuthorizationError(`person(${req.userId!}) tried to access animals of person(${personId}).`);
            }
            break;
        }
        case 'company': await ensurePersonIsCustomer(personId, req.userId!);
        default: break;
    }
}

personsRouter.get('/:id/animals',
    requiresAuthentication,
    async (req, res) => {
        const id = PostgresIdSchema.parse(parseInt(req.params.id));

        await ensureCallerHasAccess(req, id);

        const animalTypes: AnimalsType[] = await personService.getAnimalsForPersonId(id);
        res.send(animalTypes);
    }
);

personsRouter.get("/:id/favorites",
    requiresPerson,
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
        const person = await personService.create(validatedBody);

        // confirmation email 
        await emailService.sendConfirmationEmail(person);

        const jwt = await verifyPasswordAndCreateJWT(validatedBody.email, validatedBody.password);
        if (!jwt) {
            res.sendStatus(401);
            return;
        }
        const userdata = verifyJWT(jwt);
        res.cookie('access_token', jwt, {
            httpOnly: true,
            expires: new Date(userdata.exp * 1000),
            secure: true,
            sameSite: "none"
        })

        res.status(201).send({ ...userdata, token: jwt });
    }
);


personsRouter.post("/:id/favorites/:practiceId",
    requiresPerson,
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
    requiresPerson,
    async (req, res) => {
        const id = PostgresIdSchema.parse(parseInt(req.params.id));
        const practiceId = PostgresIdSchema.parse(parseInt(req.params.practiceId));

        await personService.deleteFavorizedVeterinaryPracticeId(id, practiceId);

        res.sendStatus(204);
    }
);

personsRouter.get('/:id',
    requiresAuthentication,
    async (req, res) => {
        const id = PostgresIdSchema.parse(parseInt(req.params.id));

        await ensureCallerHasAccess(req, id);

        const person: PersonsType = await personService.getById(id);
        res.send(person);
    }
);

personsRouter.put('/:id', // only possible if user is verified
    requiresPerson,
    async (req, res) => {
        const id = PostgresIdSchema.parse(parseInt(req.params.id));

        if (id !== req.userId!) {
            throw new AuthorizationError(`person(${req.userId!}) tried to update profile of person(${id}).`);
        }

        const validatedBody = PersonsUpdateSchema.parse(req.body);

        if (validatedBody.id !== id) {
            throw new ConstraintError("Mismatch", [
                { path: "params.id", value: id },
                { path: "body.id", value: validatedBody.id },
            ]);
        }

        const updatedPerson: PersonsType = await personService.update(validatedBody);
        res.send(updatedPerson);
    }
);

const EmailSchema = z.object({
    email: z.email(),
});

personsRouter.put('/:id/email', // is possible if user is logged in but not verified, only editing email
    requiresPerson,
    async (req, res) => {
        const id = PostgresIdSchema.parse(parseInt(req.params.id));

        if (id !== req.userId!) {
            throw new AuthorizationError(`person(${req.userId!}) tried to update profile of person(${id}).`);
        }

        const validatedBody = EmailSchema.parse(req.body); // only email

        const updatedPerson: PersonsType = await personService.updateEmail(id, validatedBody.email);
        res.send(updatedPerson);
    }
);

personsRouter.get('/:id/picture',
    requiresAuthentication,
    async (req, res) => {
        const id = PostgresIdSchema.parse(parseInt(req.params.id));

        await ensureCallerHasAccess(req, id);

        const filepath = await personService.getPicturePath(id);
        res.sendFile(filepath);
    }
);

personsRouter.post('/:id/picture',
    requiresAuthentication,
    upload.single("picture"),
    async (req, res) => {
        const id = PostgresIdSchema.parse(parseInt(req.params.id));

        await ensureCallerHasAccess(req, id);

        await personService.savePicture(id, req.file?.path ?? null);
        res.sendStatus(200);
    }
);

// email has to be provided in body, returns person if exists
personsRouter.post('/email', optionalAuthentication, async (req, res, next) => {
    if (!req.body.email) {
        res.status(400).json({ error: "Email is required" });
        return;
    }
    try {
        const person = await personService.getByEmail(req.body.email);
        if (!person) {
            return res.status(404).json({ exists: false });
        }

        // Check if already veterinarian
        const isVet = await veterinaryService.getById(person.id).catch(() => null);

        res.status(200).json({
            exists: true,
            isVeterinarian: !!isVet,
            firstName: person.firstName,
            lastName: person.lastName,
        });
    } catch (err) {
        res.sendStatus(500);
        next(err);
    }
});