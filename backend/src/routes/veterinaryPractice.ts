import express from "express";
import { veterinaryPracticeService } from "../service/veterinaryPracticeService";
import { appointmentService } from "../service/appointmentService";
import {
  AppointmentsType,
  VeterinaryPracticesType,
  VeterinaryPracticeCreateSchema,
  VeterinaryPracticeUpdateSchema,
  ServiceType,
  VeterinaryPracticeSearchQuerySchema,
  AnimalTypeType,
  AppointmentFilterSchema,
  VeterinaryPracticeSearchResultType,
  PostgresIdSchema,
  AnimalsType,
  PersonsType,
} from "petappoint-shared/schemas/ZodSchemas";
import { checkVerified, optionalAuthentication, requiresAuthentication } from "./authentication";
import { createJWT, verifyJWT, verifyPasswordAndCreateJWT } from "../service/jwtService";
import { emailService } from "../service/emailService";
import { AuthorizationError } from "../exceptions/errors/AuthorizationError";
import multer from "multer";

export const veterinaryPracticeRouter = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/uploads/practices");
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

veterinaryPracticeRouter.get("/all", optionalAuthentication, async (_req, res) => {
  const allVeterinarians: VeterinaryPracticesType[] = await veterinaryPracticeService.getAll();
  res.send(allVeterinarians);
});

veterinaryPracticeRouter.get("/:id/veterinarians/treatableanimals", optionalAuthentication, async (req, res) => {
  const veterinarians = await veterinaryPracticeService.getTreatableAnimals(parseInt(req.params.id));
  res.send(veterinarians);
});

veterinaryPracticeRouter.get("/search", optionalAuthentication, async (req, res) => {
  const validatedQuery = VeterinaryPracticeSearchQuerySchema.parse(req.query);
  const found: VeterinaryPracticeSearchResultType = await veterinaryPracticeService.search(validatedQuery);
  return res.send(found);
});

veterinaryPracticeRouter.get("/:id", optionalAuthentication, async (req, res) => {
  const id = PostgresIdSchema.parse(parseInt(req.params.id));
  const veterinaryPractice: VeterinaryPracticesType = await veterinaryPracticeService.getById(id);
  return res.send(veterinaryPractice);
});

veterinaryPracticeRouter.get("/:id/services", optionalAuthentication, async (req, res) => {
  const id: number = PostgresIdSchema.parse(parseInt(req.params.id));
  const services: ServiceType[] = await veterinaryPracticeService.getServicesForPractice(id);
  return res.send(services);
});

veterinaryPracticeRouter.get("/:id/animaltypes", optionalAuthentication, async (req, res) => {
  const id: number = PostgresIdSchema.parse(parseInt(req.params.id));
  const animalTypes: AnimalTypeType[] = await veterinaryPracticeService.getAllAnimalTypes(id);
  return res.send(animalTypes);
});

veterinaryPracticeRouter.get("/:id/customers", optionalAuthentication, async (req, res) => {
  const id: number = PostgresIdSchema.parse(parseInt(req.params.id));
  const animalWithPersons: { animal: AnimalsType; person: PersonsType }[] = await veterinaryPracticeService.getAnimalWithPerson(id);
  return res.send(animalWithPersons);
})

veterinaryPracticeRouter.get("/:id/appointments", optionalAuthentication, async (req, res) => {
  const id: number = PostgresIdSchema.parse(parseInt(req.params.id));
  const parsedFilter = AppointmentFilterSchema.safeParse(req.query);
  const veterinaryPracticeAppointments: AppointmentsType[] = await appointmentService.getForPractice(
    id,
    parsedFilter.data
  );
  return res.send(veterinaryPracticeAppointments);
});

veterinaryPracticeRouter.get("/:id/appointments/available", optionalAuthentication, async (req, res) => {
  const id: number = PostgresIdSchema.parse(parseInt(req.params.id));

  const parsedFilter = AppointmentFilterSchema.safeParse(req.query);
  const availableAppointments: AppointmentsType[] = await appointmentService.getAvailableAppointmentsForPractice(
    id,
    parsedFilter.data
  );
  return res.send(availableAppointments);
});

veterinaryPracticeRouter.get('/:practiceId/veterinarians', optionalAuthentication, async (req, res) => {
  const id: number = PostgresIdSchema.parse(parseInt(req.params.practiceId));
  const veterinarians = await veterinaryPracticeService.getAllVeterinarians(id);
  return res.send(veterinarians);
});

veterinaryPracticeRouter.get("/:id/appointments/booked", optionalAuthentication, async (req, res) => {
  const id: number = PostgresIdSchema.parse(parseInt(req.params.id));

  const parsedFilter = AppointmentFilterSchema.safeParse(req.query);
  const availableAppointments: AppointmentsType[] = await appointmentService.getBookedAppointmentsForPractice(
    id,
    parsedFilter.data
  );
  return res.send(availableAppointments);
});

veterinaryPracticeRouter.put("/:id", requiresAuthentication, checkVerified, async (req, res) => {
  const id = PostgresIdSchema.parse(parseInt(req.params.id));
  const validatedBody = VeterinaryPracticeUpdateSchema.parse(req.body);

  // Only allow practice to update their own profile
  if (req.userId !== id) {
    throw new AuthorizationError("No access to update this practice");
  }

  const updated = await veterinaryPracticeService.update({
    id,
    name: validatedBody.name,
    phone: validatedBody.phone,
    email: validatedBody.email,
    infoEmail: validatedBody.infoEmail,
    website: validatedBody.website,
    info: validatedBody.info,
    address: {
      ...validatedBody.address,
    },
  });
  res.send(updated);
});

veterinaryPracticeRouter.get("/:id/image", requiresAuthentication, checkVerified, async (req, res) => {
  const id = PostgresIdSchema.parse(parseInt(req.params.id));

  const filepath = await veterinaryPracticeService.getPicturePath(id);
  res.sendFile(filepath);
});

veterinaryPracticeRouter.post("/:id/image", requiresAuthentication, checkVerified, upload.single("image"), async (req, res) => {
  const id = PostgresIdSchema.parse(parseInt(req.params.id));

  if (id !== req.userId) {
    throw new AuthorizationError("No access to update image of this practice");
  }

  await veterinaryPracticeService.savePicture(id, req.file?.path ?? null);
  res.sendStatus(201);
});

veterinaryPracticeRouter.delete("/:id/image", requiresAuthentication, checkVerified, async (req, res) => {
  const id = PostgresIdSchema.parse(parseInt(req.params.id));

  if (id !== req.userId) {
    throw new AuthorizationError("No access to delete image of this practice");
  }

  await veterinaryPracticeService.deletePicture(id);
  res.sendStatus(204);
});

veterinaryPracticeRouter.post("/", optionalAuthentication,
  async (req, res) => {
    const validatedBody = VeterinaryPracticeCreateSchema.parse(req.body);

    const createdVeterinaryPractice: VeterinaryPracticesType = await veterinaryPracticeService.create(validatedBody);

    // TODO: Email Confirmation
    // TODO: Code verification for companies?
    await emailService.sendConfirmationEmailVetPractices(createdVeterinaryPractice)
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
    });

    res.status(201).send(userdata);
  });
