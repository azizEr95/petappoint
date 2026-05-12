import express, { Request, Response, NextFunction } from "express";
import {
  AnimalracesType,
  AnimalsCreateSchema,
  AnimalUpdateSchema,
  Animal_has_RacesCreateSchema,
  Animal_has_RacesType,
  AddRacesToAnimalSchema,
  AnimalsCreateType,
  PostgresIdSchema,
} from "petappoint-shared/schemas/ZodSchemas";
import { animalService } from "../service/animalService";
import { personService } from "../service/personService";
import { animalRaceService } from "../service/animalRaceService";
import { animalHasRacesService } from "../service/animalHasRacesService";
import { appointmentService } from "../service/appointmentService";
import { veterinaryPracticeService } from "../service/veterinaryPracticeService";
import multer from "multer";
import { checkVerified, optionalAuthentication, requiresAuthentication } from "./authentication";
import { ConstraintError } from "../exceptions/errors/ConstraintError";
import { AuthorizationError } from "../exceptions/errors/AuthorizationError";
import { ensureCallerHasAccess } from "../helper/authorization";
export const animalsRouter = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/uploads/animals"); // make sure this folder exists
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + "-" + uniqueSuffix + "." + file.originalname.split(".").pop());
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB limit
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith("image/")) {
      return cb(new Error("Only images are allowed"));
    }
    cb(null, true);
  },
});

animalsRouter.post("/", requiresAuthentication, checkVerified, async (req, res) => {
  const validatedBody = AnimalsCreateSchema.parse(req.body);

  // Create new animal
  const animal = await animalService.create(validatedBody);

  // Connect animal to requestor
  await personService.connectAnimal(req.userId!, animal.id);

  res.send(animal);
});

animalsRouter.put("/:animalId", requiresAuthentication, checkVerified, async (req, res) => {
  const validatedBody = AnimalUpdateSchema.parse(req.body);
  const animalId = PostgresIdSchema.parse(parseInt(req.params.animalId));

  if (animalId !== validatedBody.id) {
    throw new ConstraintError("Mismatch", [
      { path: "query.id", value: animalId },
      { path: "body.id", value: validatedBody.id },
    ]);
  }

  await ensureCallerHasAccess(req, animalId);

  const animal = await animalService.update(validatedBody);
  return res.send(animal);
});

// muss irgendwann raus
animalsRouter.get("/", async (_req, res) => {
  const animals = await animalService.getAll()
  return res.send(animals)
})

animalsRouter.get("/:animalId/picture", requiresAuthentication, checkVerified, async (req, res) => {
  const animalId = PostgresIdSchema.parse(parseInt(req.params.animalId));

  await ensureCallerHasAccess(req, animalId);

  const filepath = await animalService.getPicturePath(animalId);
  res.sendFile(filepath);
});

animalsRouter.get("/unknownPicture", requiresAuthentication, checkVerified, async (req, res) => {
  const filepath = await animalService.getPicturePath(undefined);
  res.sendFile(filepath);
});

animalsRouter.post("/:animalId/picture", requiresAuthentication, checkVerified, upload.single("picture"), async (req, res) => {
  const animalId = PostgresIdSchema.parse(parseInt(req.params.animalId));

  await ensureCallerHasAccess(req, animalId);

  await animalService.savePicture(animalId, req.file?.path ?? null);
  res.sendStatus(201);
});

animalsRouter.delete("/:animalId/picture", requiresAuthentication, checkVerified, async (req, res) => {
  const animalId = PostgresIdSchema.parse(parseInt(req.params.animalId));

  await ensureCallerHasAccess(req, animalId);

  await animalService.deletePicture(animalId);
  res.sendStatus(204);
});

animalsRouter.delete("/:animalId", requiresAuthentication, checkVerified, async (req, res) => {
  const animalId = PostgresIdSchema.parse(parseInt(req.params.animalId));

  await ensureCallerHasAccess(req, animalId);

  await animalService.delete(animalId);
  res.sendStatus(204);
});

animalsRouter.delete("/:animalId/with-appointments", requiresAuthentication, checkVerified, async (req, res) => {
  const animalId = PostgresIdSchema.parse(parseInt(req.params.animalId));

  await ensureCallerHasAccess(req, animalId);

  await animalService.deleteWithAppointmentCancellation(animalId);
  res.sendStatus(204);
});

animalsRouter.get("/:animalId/races", requiresAuthentication, checkVerified, async (req, res) => {
  const animalId = PostgresIdSchema.parse(parseInt(req.params.animalId));

  await ensureCallerHasAccess(req, animalId);

  const animalRaces: AnimalracesType[] = await animalRaceService.getAnimalRaces(animalId);
  return res.send(animalRaces);
});

animalsRouter.post("/:animalId/races", requiresAuthentication, checkVerified, async (req, res) => {
  const animalId = PostgresIdSchema.parse(parseInt(req.params.animalId));
  const validatedBody = AddRacesToAnimalSchema.parse(req.body);

  if (animalId !== validatedBody.animalId) {
    res.status(400).send(`Mismatch in param id '${animalId}' and provided body id '${validatedBody.animalId}'.`);
    return;
  }

  await ensureCallerHasAccess(req, animalId);

  const animalRace = await animalHasRacesService.create({
    animalId: validatedBody.animalId,
    animalraceids: validatedBody.animalraceids,
  });

  res.status(201).send(animalRace);
});

animalsRouter.delete("/:animalId/races", requiresAuthentication, checkVerified, async (req, res) => {
  const animalId = PostgresIdSchema.parse(parseInt(req.params.animalId));

  await ensureCallerHasAccess(req, animalId);

  await animalHasRacesService.deleteAllRacesFromAnimal(animalId);
  res.sendStatus(204);
});

animalsRouter.delete("/:animalId/races/:raceId", requiresAuthentication, checkVerified, async (req, res) => {
  const animalId = PostgresIdSchema.parse(parseInt(req.params.animalId));
  const raceId = PostgresIdSchema.parse(parseInt(req.params.raceId));

  await ensureCallerHasAccess(req, animalId);

  await animalHasRacesService.delete({
    animalId: animalId,
    animalRaceId: raceId,
  });

  res.sendStatus(204);
});

animalsRouter.get("/:animalId/appointments", requiresAuthentication, checkVerified, async (req, res) => {
  const animalId = PostgresIdSchema.parse(parseInt(req.params.animalId));

  await ensureCallerHasAccess(req, animalId);

  const appointments = await appointmentService.getAppointmentsByAnimal(animalId);
  res.send(appointments);
});
