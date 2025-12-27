import type { LoginType } from "vetilib-shared/schemas/ZodSchemas";

export function isLoggedInAndVerified(login: LoginType | false): boolean {
    if (login && login.verified) {
        return true;
    } else {
        return false;
    }
}
