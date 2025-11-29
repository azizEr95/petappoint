export class ResourceNotFoundError extends Error {
    path: string;
    value?: any;

    constructor(msg: string, path: string, value?: any) {
        super(msg);
        this.path = path;
        this.value = value;
    }
}