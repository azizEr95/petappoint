export class ConstraintError extends Error {
  constraints: { path: string; value?: any }[];
  constructor(message: string, constraints: { path: string; value?: any }[]) {
    super(message);
    this.constraints = constraints;
  }
}
