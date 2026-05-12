import express from 'express'
import { emailService } from '../service/emailService';
import { requiresAuthentication } from './authentication';
import { personService } from '../service/personService';
import { ResourceNotFoundError } from '../exceptions/errors/ResourceNotFoundError';
import { createJWT, verifyCodeAndCreateJWT, verifyJWT, verifyPasswordAndCreateJWT } from '../service/jwtService';
import { person_has_confirmation_code, veterinarypractices_has_confirmation_code } from 'generated/prisma';
import { create } from 'domain';


/*
* This Router is for emailverification only post emailverification is done in persons Router
*/
export const emailverificationRouter = express.Router();

emailverificationRouter.get("/:sixdigitcode", requiresAuthentication,
    async (req, res) => {
        try {
            const code = req.params.sixdigitcode;
            const result: person_has_confirmation_code | veterinarypractices_has_confirmation_code | false = await emailService.checkVerificationandSetVerifiedStatus(req.userId!, code, req.role!);
            if (req.role! === "company") {
                const jwtCompany = await verifyCodeAndCreateJWT("company",req.userId!,code);

                const logRes = verifyJWT(jwtCompany);
                res.cookie("access_token", jwtCompany), {
                    httpOnly: true,
                    expires: new Date(logRes.exp * 1000),
                    secure: true,
                    sameSite: "none"
                }
                res.send(logRes);
                return;
            }
            const jwt = await verifyCodeAndCreateJWT("person", req.userId!, code);
            if (!result) {
                res.status(400).send("Code ist falsch oder abgelaufen");
                return;
            }
            const logRes = verifyJWT(jwt);
            res.cookie("access_token", jwt, {
                httpOnly: true,
                expires: new Date(logRes.exp * 1000),
                secure: true,
                sameSite: "none"
            });
            res.send(logRes);
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
            if (error instanceof ResourceNotFoundError) {
                res.status(400).send(error.message);
                return;
            }
            res.sendStatus(500);
        }
    }
)