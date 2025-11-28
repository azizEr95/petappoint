import express, { Request } from "express";
import { AnimalracesType, AnimalsCreateSchema, AnimalUpdateSchema, Animal_has_RacesCreateSchema, Animal_has_RacesType, AddRacesToAnimalSchema } from "vetlib-shared/schemas/ZodSchemas";
import { animalService } from "../service/animalService";
import { personService } from "../service/personService";
import { animalRaceService } from "../service/animalRaceService";
import { animalHasRacesService } from "../service/animalHasRacesService";
import multer from "multer";
import { optionalAuthentication, requiresAuthentication } from "./authentication";
export const animalsRouter = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/uploads/animals'); // make sure this folder exists
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + '.' + file.originalname.split('.').pop());
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB limit
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith('image/')) {
      return cb(new Error('Only images are allowed'));
    }
    cb(null, true);
  }
});

animalsRouter.post("/",
    requiresAuthentication,
    async (req, res) => {
        const parseResult = AnimalsCreateSchema.safeParse(req.body);
        if (!parseResult.success) {
            res.status(400).send(parseResult.error);
            return;
        }

        // TODO: After implementing validation get the personId or the
        // identifier for the person from the authentification token
        const personId = parseInt(req.userId!);

        const creationData = parseResult.data;

        // Create new animal
        const animal = await animalService.create(creationData);

        // Connect animal to requestor
        await personService.connectAnimal(personId, animal.id);

        res.send(animal);
    }
);

animalsRouter.put('/:animalId',
    requiresAuthentication,
    async (req, res) => {
        const parseResult = AnimalUpdateSchema.safeParse(req.body);
        if (!parseResult.success) {
            res.status(400).send(parseResult.error);
            return;
        }

        const animalId = parseInt(req.params.animalId);
        if (animalId !== parseResult.data.id) {
            res.status(400).send(`Mismatch in param id '${animalId}' and provided body id '${parseResult.data.id}'.`);
            return;
        }

        const animal = await animalService.update(parseResult.data);
        return res.send(animal);
    }
);

animalsRouter.get('/:animalId/picture',
    requiresAuthentication,
    async (req, res) => {
        const animalId = parseInt(req.params.animalId);
        const filepath = await animalService.getPicturePath(animalId);
        res.sendFile(filepath);
    }
)

animalsRouter.post('/:animalId/picture',
    requiresAuthentication,
    upload.single('picture'),
    async (req, res) => {
        const animalId = parseInt(req.params.animalId);
        await animalService.savePicture(animalId, req.file?.path ?? null);
    }
)

animalsRouter.delete('/:animalId',
    requiresAuthentication,
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
    requiresAuthentication,
    async (req, res) => {
        const animalId = parseInt(req.params.animalId);
        const animalRaces: AnimalracesType[] = await animalRaceService.getAnimalRaces(animalId);
        return res.send(animalRaces);
    }
)

animalsRouter.post('/:animalId/races',
    requiresAuthentication,
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
    requiresAuthentication,
    async (req, res) => {
        const animalId = parseInt(req.params.animalId);
        try {
            await animalHasRacesService.deleteAllRacesFromAnimal(animalId);
            res.sendStatus(204);
        } catch (error) {
            res.sendStatus(500);
        }
    }
)

animalsRouter.delete('/:animalId/races/:raceId',
    requiresAuthentication,
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

