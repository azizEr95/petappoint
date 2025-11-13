import express from "express";
import { appointmentService } from "../service/appointmentService";
import { appointments } from "../../generated/prisma";

export const appointmentRouter = express.Router();

appointmentRouter.get("/all",
    async (_req, res) => {
        const allAppointments: appointments[] = await appointmentService.getAll();
        res.send(allAppointments);
    }
)

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