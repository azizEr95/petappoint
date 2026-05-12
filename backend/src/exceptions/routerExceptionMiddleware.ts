import { ErrorRequestHandler, Request, Response } from 'express';
import { ResourceNotFoundError } from './errors/ResourceNotFoundError';
import { ZodValidationError } from './errors/ZodValidationError';
import { JsonWebTokenError } from 'jsonwebtoken';
import { AuthorizationError } from './errors/AuthorizationError';
import { ConstraintError } from './errors/ConstraintError';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

export const routerExceptionHandler: ErrorRequestHandler = (err, req, res, next) => {
    console.error(err.stack);
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
    } else if (err instanceof ConstraintError) {
        res.status(409).json({
            error: err.message,
            field: err.constraints[0]?.path,
        });
        return;
    } else if (err instanceof PrismaClientKnownRequestError) {
        if (err.code === 'P2002' && err.meta?.target) {
            const field = Array.isArray(err.meta.target)
                ? err.meta.target[0]
                : err.meta.target;
            res.status(409).json({
                error: `${field} wird bereits verwendet`,
                field,
            });
            return;
        }
    }

    next(err);
};