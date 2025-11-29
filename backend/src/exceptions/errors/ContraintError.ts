export class ConstraintError extends Error {
    contraints: { path: string, value?: any }[];
    constructor(message: string, constraints: { path: string, value?: any }[]) {
        super(message);
        this.contraints = constraints;
    }
}