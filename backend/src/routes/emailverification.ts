import express from 'express'
import { emailService } from '../service/emailService';
import { confirmType } from 'vetilib-shared/schemas/ZodSchemas';
import { requiresAuthentication } from './authentication';
import { personService } from '../service/personService';
import { ResourceNotFoundError } from '../exceptions/errors/ResourceNotFoundError';

/*
* This Router is for emailverification only post emailverification is done in persons Router
*/
export const emailverificationRouter = express.Router();

emailverificationRouter.get("/:sixdigitcode", requiresAuthentication,
    async (req, res) => {
        try {
            const code = req.params.sixdigitcode;
            const result = await emailService.checkVerificationandSetVerifiedStatus(req.userId!, code);
            if (!result) {
                res.status(400).send("Code ist falsch oder abgelaufen");
                return;
            }
            const confirmRes: confirmType = {
                id: result.fk_personid,
                verified: result.verified
            }
            res.send(confirmRes);
        } catch (error) {
            res.sendStatus(500);
        }
    }
)

emailverificationRouter.post("/", requiresAuthentication,
    async (req, res) => {
        try {
            const check = await personService.checkVerified(req.userId!);
            if (check) {
                res.status(400).send("User is already verified.");
                return;
            }
            const person = await personService.getById(req.userId!);
            await emailService.sendConfirmationEmail(person);
            res.sendStatus(200);
        } catch (error) {
            if(error instanceof ResourceNotFoundError) {
                res.status(400).send(error.message);
                return;
            }
            res.sendStatus(500);
        }
    }
)