import express from "express";
import { AnimalTypeType, PersonsCreateSchema, PostgresIdSchema, VeterinariansCreateSchema, } from "vetilib-shared/schemas/ZodSchemas";
import { optionalAuthentication, requiresAuthentication } from "./authentication";
import { animalTypeService } from "../service/animalTypeService";
import { appointmentService } from "../service/appointmentService";
import { personService } from "../service/personService";
import { veterinaryService } from "../service/veterinaryService";

export const veterinariansRouter = express.Router();

veterinariansRouter.get("/:id/animaltypes", optionalAuthentication, async (req, res) => {
    const veterinaryId = PostgresIdSchema.parse(parseInt(req.params.id));
    const treatableAnimalTypes: AnimalTypeType[] = await animalTypeService.getTreatableTypesForVeterinaryId(veterinaryId);
    res.send(treatableAnimalTypes);
});

veterinariansRouter.get('/:id/appointments', optionalAuthentication, async (req, res) => {
    const veterinaryId = PostgresIdSchema.parse(parseInt(req.params.id));
    const appointments = await appointmentService.getAppointmentsByVeterinary(veterinaryId);
    return res.send(appointments);
});

veterinariansRouter.post('/', optionalAuthentication, async (req, res, next) => {
    try {
        if (!req.body.email) {
            return res.status(400).json({ success: false, message: "Email required" });
        }

        let person = await personService.getByEmail(req.body.email);

        if (!person) {
            const personData = {
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                sex: req.body.sex,
                dateOfBirth: req.body.dateOfBirth,
                email: req.body.email,
                password: req.body.password,
                phone: req.body.phone,
                address: req.body.address,
            };

            const personSchema = PersonsCreateSchema.parse(personData);
            person = await personService.create(personSchema);
        }

        const vetData = {
            id: person.id,
            firstName: person.firstName,
            lastName: person.lastName,
            infoEmail: req.body.infoEmail,
            fk_veterinarypracticeid: req.body.fk_veterinarypracticeid
        };

        const vet = await veterinaryService.create(vetData);
        res.status(201).send(vet);

    } catch (err: any) {
        res.sendStatus(500);
        next(err);
    }
});