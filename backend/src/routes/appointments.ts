import express from "express";
import { appointmentService } from "../service/appointmentService";
import { AppointmentsCreateSchema, AppointmentsType, BookAppointmentSchema, PostgresIdSchema, AvailableAppointmentSchema, AppointmentsCreateType } from "vetilib-shared/schemas/ZodSchemas";
import { checkVerified, optionalAuthentication, requiresAuthentication, requiresCompany } from "./authentication";
import { AuthorizationError } from "../exceptions/errors/AuthorizationError";
import { animalService } from "../service/animalService";
import { ConstraintError } from "../exceptions/errors/ConstraintError";
import z from "zod";
import { emailService } from "../service/emailService";
import * as cron from "node-cron"

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

async function ensureCompanyCanDeleteAppointment(companyId: number, appointmentId: number) {
  const hasAccess = await appointmentService.canCompanyDeleteAppointment(companyId, appointmentId);
  if (!hasAccess) {
    throw new AuthorizationError(`Company(${companyId}) has no access to delete appointment(${appointmentId}).`);
  }
}

appointmentRouter.get("/past/:personId", requiresAuthentication, checkVerified, async (req, res) => {
  const personId = PostgresIdSchema.parse(parseInt(req.params.personId));

  // TODO: Only show appointments that the practice
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

    await ensureCallerHasAccess(req, appointment.animal.id);
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

  if (req.role === 'person') {
    await ensureUserCanEditAppointment(req.userId!, validatedData.id);
  }
  // TODO: Add check for company

  const bookedAppointment = await appointmentService.updateAppointmentAsPerson(
    validatedData.id,
    validatedData.animalId,
    validatedData.serviceId
  );

  await emailService.sendAppointmentEmail(req.userId!, bookedAppointment.id, "confirmation");

  res.status(201).send(bookedAppointment);
});

appointmentRouter.delete("/:id", requiresAuthentication, checkVerified, async (req, res) => {
  const appointmentId = PostgresIdSchema.parse(parseInt(req.params.id));

  switch (req.role!) {
    case 'person': {
      await ensureUserCanEditAppointment(req.userId!, appointmentId);

      // sending termination mail
      await emailService.sendAppointmentEmail(req.userId!, appointmentId, "termination");

      await appointmentService.cancelAppointmentAsPerson(appointmentId);

      return res.sendStatus(204);
    }
    case 'company': {
      await ensureCompanyCanDeleteAppointment(req.userId!, appointmentId);
      await appointmentService.delete(appointmentId);
      return res.sendStatus(204);
    }
    default: break;
  }
  res.sendStatus(500);
});

appointmentRouter.patch("/:id", requiresCompany, async (req, res) => {
  const appointmentId = PostgresIdSchema.parse(parseInt(req.params.id));
  const validatedData = AvailableAppointmentSchema.parse(req.body);
  const updated = await appointmentService.updateAvailableAppointment(appointmentId, validatedData);
  res.status(200).send(updated);
});

appointmentRouter.patch("/:id/notes", requiresCompany, async (req, res) => {
  const appointmentId = PostgresIdSchema.parse(parseInt(req.params.id));
  const notes = z.string().min(1).max(1000).optional().parse(req.body);

  await ensureUserCanEditAppointment(req.userId!, appointmentId);

  const updated = await appointmentService.updateNotes(appointmentId, notes || null);

  res.status(200).send(updated);
});

appointmentRouter.post('/', requiresCompany, async (req, res) => {
  const appointmentCreationData = AppointmentsCreateSchema.parse(req.body);
  if (appointmentCreationData.endDate) {
    await appointmentService.createWeeklyAppointments(appointmentCreationData);
  } else {
    await appointmentService.create(appointmentCreationData);
  }
  return res.sendStatus(201);
});