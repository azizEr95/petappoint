import { NextFunction, Request, Response } from "express";
import { verifyJWT } from "../service/jwtService";
import { RoleEnum } from "petappoint-shared/schemas/ZodSchemas";

declare global {
    namespace Express {
        export interface Request {
            userId?: number;
            role?: RoleEnum;
            verified: boolean;
        }
    }
}

function extractToken(req: Request): string | undefined {
    if (req.cookies.access_token) return req.cookies.access_token;
    const authHeader = req.headers.authorization;
    if (authHeader?.startsWith('Bearer ')) return authHeader.slice(7);
    return undefined;
}

export function requiresAuthentication(req: Request, res: Response, next: NextFunction) {
    const jwtString = extractToken(req);
    if (!jwtString) {
        res.sendStatus(401);
        return;
    }

    optionalAuthentication(req, res, next);
}

export function optionalAuthentication(req: Request, res: Response, next: NextFunction) {
    const jwtString = extractToken(req);
    if (jwtString) {
        try {
            const loginRes = verifyJWT(jwtString);
            req.userId = loginRes.id;
            req.role = loginRes.role;
            req.verified = loginRes.verified;
        } catch (err) {
            res.sendStatus(401);
            return;
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

export function requiresCompany(req: Request, res: Response, next: NextFunction) {
    requiresAuthentication(req, res, () => {
        checkVerified(req, res, () => {
            if (req.role !== 'company') {
                res.sendStatus(403);
                return;
            }

            next();
        });
    });
}

export function requiresPerson(req: Request, res: Response, next: NextFunction) {
    requiresAuthentication(req, res, () => {
        checkVerified(req, res, () => {
            if (req.role !== 'person') {
                res.sendStatus(403);
                return;
            }

            next();
        });
    });
}