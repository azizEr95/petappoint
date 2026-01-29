import express from "express";
import { AnimalTypeType, PersonsCreateSchema, PostgresIdSchema, VeterinariansCreateSchema, } from "vetilib-shared/schemas/ZodSchemas";
import { optionalAuthentication, requiresAuthentication } from "./authentication";
import { animalTypeService } from "../service/animalTypeService";
import { appointmentService } from "../service/appointmentService";
import { personService } from "../service/personService";
import { veterinaryService } from "../service/veterinaryService";
import { veterinaryCanTreatAnimalTypeService } from "../service/veterinaryCanTreatAnimalTypeService";
import { veterinaryHasServiceService } from "../service/veterinaryHasServiceService";
import { prisma } from "../singletonPC";

export const veterinariansRouter = express.Router();

veterinariansRouter.get('/:id', optionalAuthentication, async (req, res, next) => {
    try {
        const veterinaryId = PostgresIdSchema.parse(parseInt(req.params.id));
        const veterinary = await veterinaryService.getById(veterinaryId);
        res.send(veterinary);
    } catch (err: any) {
        res.sendStatus(500);
        next(err);
    }
});

veterinariansRouter.put('/:id', optionalAuthentication, async (req, res, next) => {
    try {
        const veterinaryId = PostgresIdSchema.parse(parseInt(req.params.id));
        const { infoEmail, animalTypeIds = [], serviceIds = [] } = req.body;

        // Update infoEmail
        const updated = await prisma.veterinarian.update({
            where: { id: veterinaryId },
            data: {
                infoEmail: infoEmail !== undefined ? infoEmail : null,
            },
            include: {
                person: {
                    select: {
                        firstName: true,
                        lastName: true,
                        phone: true,
                    }
                }
            }
        });

        // Update animal types if provided
        if (animalTypeIds.length > 0) {
            await prisma.veterinaryCanTreatAnimalType.deleteMany({
                where: { veterinaryId }
            });
            for (const animalTypeId of animalTypeIds) {
                await prisma.veterinaryCanTreatAnimalType.create({
                    data: {
                        veterinaryId,
                        animalTypeId,
                    }
                });
            }
        }

        // Update services if provided
        if (serviceIds.length > 0) {
            await prisma.veterinaryHasService.deleteMany({
                where: { veterinaryId }
            });
            for (const serviceId of serviceIds) {
                await prisma.veterinaryHasService.create({
                    data: {
                        veterinaryId,
                        serviceId,
                    }
                });
            }
        }

        // Map to VeterinariansType
        const result = {
            id: updated.id,
            firstName: updated.person.firstName,
            lastName: updated.person.lastName,
            infoEmail: updated.infoEmail,
            fk_veterinarypracticeid: updated.fk_veterinarypracticeid,
        };

        res.send(result);
    } catch (err: any) {
        res.sendStatus(500);
        next(err);
    }
});

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

        // Detect mode: if no password & no dateOfBirth -> existing person mode
        const isExistingPersonMode = !req.body.password && !req.body.dateOfBirth;
        let person = await personService.getByEmail(req.body.email);

        if (isExistingPersonMode) {
            // EXISTING PERSON MODE
            if (!person) {
                return res.status(404).json({
                    success: false,
                    message: 'Person with this email does not exist',
                });
            }

            // Check if person already has veterinarian role
            const existingVet = await veterinaryService.getById(person.id).catch(() => null);
            if (existingVet) {
                return res.status(400).json({
                    success: false,
                    message: 'Person is already a veterinarian',
                });
            }
        } else {
            // NEW PERSON MODE
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
        }

        // Create veterinarian (always use person's firstName/lastName)
        const vetData = {
            id: person.id,
            firstName: person.firstName,
            lastName: person.lastName,
            infoEmail: req.body.infoEmail || null,
            fk_veterinarypracticeid: req.body.veterinaryPracticeId,
        };

        const vet = await veterinaryService.create(vetData);

        // Link animaltypes if provided
        if (req.body.animalTypeIds?.length > 0) {
            await veterinaryCanTreatAnimalTypeService.create({
                veterinaryId: vet.id,
                animalTypeIds: req.body.animalTypeIds,
            });
        }

        // Link services if provided
        if (req.body.serviceIds?.length > 0) {
            await veterinaryHasServiceService.create({
                veterinaryId: vet.id,
                serviceIds: req.body.serviceIds,
            });
        }

        res.status(201).send(vet);

    } catch (err: any) {
        res.sendStatus(500);
        next(err);
    }
});