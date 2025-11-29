import {ZodError} from "zod/v4";

export class ZodValidationError extends Error {
    error: ZodError;

    constructor(msg: string, zodError: ZodError) {
        super(msg);
        this.error = zodError;
    }
}