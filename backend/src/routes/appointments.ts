import express from "express";
import { appointmentService } from "../service/appointmentService";
import { AppointmentsType, BookAppointmentSchema, PostgresIdSchema } from "vetilib-shared/schemas/ZodSchemas";
import { checkVerified, optionalAuthentication, requiresAuthentication } from "./authentication";
import { AuthorizationError } from "../exceptions/errors/AuthorizationError";
import { animalService } from "../service/animalService";
import { ConstraintError } from "../exceptions/errors/ConstraintError";
import z from "zod";
import { emailService } from "../service/emailService";

export const appointmentRouter = express.Router();

async function ensureUserCanAccessAppointment(personId: number, appointmentId: number) {
  const hasAccess = await appointmentService.canPersonAccessAppointment(personId, appointmentId);
  if (!hasAccess) {
    throw new AuthorizationError("No read access");
  }
}

async function ensureUserCanEditAppointment(personId: number, appointmentId: number) {
  const hasAccess = await appointmentService.canPersonAccessAppointment(personId, appointmentId);
  if (!hasAccess) {
    throw new AuthorizationError("No write access");
  }
}

appointmentRouter.get("/all", requiresAuthentication, checkVerified, async (_req, res) => {
  const allAppointments: AppointmentsType[] = await appointmentService.getAll();
  res.send(allAppointments);
});

appointmentRouter.get("/past/:personId", requiresAuthentication, checkVerified, async (req, res) => {
  const personId = PostgresIdSchema.parse(parseInt(req.params.personId));

  if (personId !== req.userId!) {
    throw new AuthorizationError(`User(${req.userId!}) is not allowed to access ${personId}`);
  }

  const pastAppointments: AppointmentsType[] = await appointmentService.getPastAppointmentsForPerson(personId);
  res.send(pastAppointments);
});

appointmentRouter.get("/future/:personId", requiresAuthentication, checkVerified, async (req, res) => {
  const personId = PostgresIdSchema.parse(parseInt(req.params.personId));

  if (personId !== req.userId!) {
    throw new AuthorizationError(`User(${req.userId!}) is not allowed to access ${personId}`);
  }

  const futureAppointments: AppointmentsType[] = await appointmentService.getFutureAppointmentsForPerson(personId);
  res.send(futureAppointments);
});

appointmentRouter.get("/:id", optionalAuthentication, async (req, res) => {
  const id = PostgresIdSchema.parse(parseInt(req.params.id));

  const appointment: AppointmentsType = await appointmentService.getById(id);
  if (appointment.animal) {
    if (!req.userId) {
      throw new AuthorizationError("Guest is trying to access an active appointment.");
    }

    if (!animalService.canPersonAccessAnimal(req.userId, appointment.animal.id)) {
      throw new AuthorizationError("User is trying to access an appointment for an unowned animal.");
    }
  }

  res.send(appointment);
});

appointmentRouter.put("/:id", requiresAuthentication, checkVerified, async (req, res, next) => {
  const appointmentId = parseInt(req.params.id);
  const validatedData = BookAppointmentSchema.parse(req.body);

  if (appointmentId !== validatedData.id) {
    throw new ConstraintError("Mismatch between param and body", [
      { path: "params", value: appointmentId },
      { path: "body", value: validatedData.id },
    ]);
  }

  ensureUserCanEditAppointment(req.userId!, validatedData.id);

  const bookedAppointment = await appointmentService.updateAppointmentAsPerson(
    validatedData.id,
    validatedData.animalId,
    validatedData.serviceId
  );
  // send confirmation email
  emailService.sendAppointmentEmail(req.userId!, bookedAppointment.id, "confirmation");
  res.status(201).send(bookedAppointment);
});

appointmentRouter.delete("/:id", requiresAuthentication, checkVerified, async (req, res) => {
  const appointmentId = PostgresIdSchema.parse(parseInt(req.params.id));

  ensureUserCanEditAppointment(req.userId!, appointmentId);

  // sending termination mail
  await emailService.sendAppointmentEmail(req.userId!, appointmentId, "termination");

  await appointmentService.cancelAppointmentAsPerson(appointmentId);

  res.sendStatus(204);
});

appointmentRouter.patch("/:id/notes", requiresAuthentication, checkVerified, async (req, res) => {
  const appointmentId = PostgresIdSchema.parse(parseInt(req.params.id));
  const notes = z.string().min(1).max(1000).optional().parse(req.body);

  ensureUserCanEditAppointment(req.userId!, appointmentId);

  const updated = await appointmentService.updateNotes(appointmentId, notes || null);

  res.status(200).send(updated);
});
