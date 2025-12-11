import express from "express";
import { JsonWebTokenError } from "jsonwebtoken";
import { verifyJWT, verifyPasswordAndCreateJWT } from "../service/jwtService";
import { loginValidator } from "vetilib-shared/schemas/ZodSchemas";
import { optionalAuthentication } from "./authentication";
import { personService } from "../service/personService";
//import { optionalAuthentication } from "./authentication";

export const loginRouter = express.Router();

loginRouter.post("/",
    optionalAuthentication,
    async (req, res) => {
        const validatedBody = loginValidator.parse(req.body);
        const jwtString = await verifyPasswordAndCreateJWT(validatedBody.email, validatedBody.password);
        if (!jwtString) {
            return res.sendStatus(401);
        }

        const logRes = verifyJWT(jwtString);

        logRes.verified = await personService.checkVerified(logRes.id);

        res.cookie("access_token", jwtString, {
            httpOnly: true,
            // läuft zu dem Datum und zu der Zeit ab
            // Beim Cookie werden numerische Werte als Millisekunden interpretiert,
            // beim jsonwebtoken werden numerische Werte als Sekunden interpretiert,
            // deshalb * 1000, um von Milli zu Sekunden umzuwandeln
            expires: new Date(logRes.exp * 1000),
            secure: true, // cookie kann nur über eine sichere Verbindung verschickt werden -> https
            /**
            * None- Cookies werden in allen Kontexten gesendet, 
            * d.h. das Senden von Cross-Origin ist zulässig. 
            * Der Browser sendet das Cookie mit 
            * standortübergreifenden Anforderungen.
            */
            sameSite: "none"
        });
        res.status(201).send(logRes);
        return;
    }
);

loginRouter.get("/",
    optionalAuthentication,
    async (req, res) => {
        try {
            const jwtString = req.cookies.access_token;
            const loginRes = verifyJWT(jwtString);
            res.send(loginRes);
            return;
        } catch (err) {
            res.clearCookie("access_token");
            res.status(401).send(false);
            return;
        }
    })

loginRouter.delete("/",
    optionalAuthentication,
    async (_req, res) => {
        res.clearCookie("access_token");
        res.sendStatus(204);
    })