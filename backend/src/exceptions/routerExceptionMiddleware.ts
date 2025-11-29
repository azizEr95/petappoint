import {ErrorRequestHandler, Request, Response} from 'express';
import { ResourceNotFoundError } from './errors/ResourceNotFoundError';
import { ZodValidationError } from './errors/ZodValidationError';
import { JsonWebTokenError } from 'jsonwebtoken';
import { AuthorizationError } from './errors/AuthorizationError';

export const routerExceptionHandler: ErrorRequestHandler = (err, req, res, next) => {
    if (err instanceof ResourceNotFoundError) {
        res.sendStatus(404);
        return;
    }
    else if (err instanceof ZodValidationError) {
        res.status(400).send(err.error);
        return;
    } else if (err instanceof JsonWebTokenError) {
        res.sendStatus(401);
        return;
    } else if (err instanceof AuthorizationError) {
        res.sendStatus(req.userId ? 403 : 401);
        return;
    }

    next(err);
};