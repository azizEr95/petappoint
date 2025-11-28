import { NextFunction, Request, Response } from "express";
import { verifyJWT } from "../service/jwtService";
import { RoleEnum } from "vetlib-shared/schemas/ZodSchemas";

declare global {
    namespace Express {
        export interface Request {
            userId?: string;
            role?: RoleEnum;
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
        } catch (err) {
            res.sendStatus(401);
        }
    }
    
    next();
}