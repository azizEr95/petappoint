import { NextFunction, Request, Response } from "express";
import { verifyJWT } from "../service/jwtService";
import { RoleEnum } from "vetilib-shared/schemas/ZodSchemas";
import { emailService } from "../service/emailService";

declare global {
    namespace Express {
        export interface Request {
            userId?: number;
            role?: RoleEnum;
            verified: boolean;
        }
    }
}

export function requiresAuthentication(req: Request, res: Response, next: NextFunction) {
    const jwtString = req.cookies.access_token;
    if (!jwtString) {
        res.sendStatus(401);
        return;
    }

    optionalAuthentication(req, res, next);
}

export function optionalAuthentication(req: Request, res: Response, next: NextFunction) {
    const jwtString = req.cookies.access_token;
    if (jwtString) {
        try {
            const loginRes = verifyJWT(jwtString);
            req.userId = loginRes.id;
            req.role = loginRes.role;
            req.verified = loginRes.verified;
        } catch (err) {
            res.sendStatus(401);
        }
    }

    next();
}

export function checkVerified(req: Request, res: Response, next: NextFunction) {
    if (!req.verified) {
        res.sendStatus(403);
        return;
    }
    next();
}

export function checkVerified(req: Request, res: Response, next: NextFunction) {
    if (!req.verified) {
        res.sendStatus(403);
        return;
    }
}