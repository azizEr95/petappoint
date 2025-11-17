import express from "express";
import { appointmentService } from "../service/appointmentService";
import { AppointmentsType, AppointmentsUpdateAsPersonSchema } from "vetlib-shared/schemas/ZodSchemas";

export const appointmentRouter = express.Router();


appointmentRouter.get("/all",
    async (_req, res) => {
        const allAppointments: AppointmentsType[] = await appointmentService.getAll();
        res.send(allAppointments);
    }
)


appointmentRouter.get("/past/:personId", 
    async (req, res,) => {
        try {
            const personId = parseInt(req.params.personId);
            if (!personId) {
                res.sendStatus(400);
                return;
            }
            const pastAppointments = await appointmentService.getPastAppointmentsForPerson(personId);
            res.send(pastAppointments);
        } catch (e) {
            res.sendStatus(404);
            return;
        }
    }
);

appointmentRouter.get("/future/:personId", 
    async (req, res,) => {
        try {
            const personId = parseInt(req.params.personId);
            if (!personId) {
                res.sendStatus(400);
                return;
            }
            const futureAppointments = await appointmentService.getFutureAppointmentsForPerson(personId);
            res.send(futureAppointments);
        } catch (e) {
            res.sendStatus(404);
            return;
        }
    }
);

appointmentRouter.get("/:id",
    async (req, res) => {
        try {
            const id = parseInt(req.params.id);
            const appointment = await appointmentService.getById(id);
            res.send(appointment);
        } catch (ex) {
            res.sendStatus(404);
        }
    }
)

appointmentRouter.put("/:id",
    async (req, res, next) => {
        try {
            const appointmentData = AppointmentsUpdateAsPersonSchema.safeParse(req.body);
            if(!appointmentData.success) {
                res.status(400).send(appointmentData.error);
                return;
            }
            res.status(201).send(await appointmentService.updateAppointmentAsPerson(appointmentData.data.id, appointmentData.data.fk_animalid, appointmentData.data.fk_serviceid));
            return;
        } catch (e) {
            if (String(e).includes("ID and AnimalID is required for update")) {
                res.status(400).send(e);
                return;
            }
            if (String(e).includes("Termin is already taken")) {
                res.status(400).send(e)
                return;
            }
            res.status(500);
            next(e)
        }
    }
);