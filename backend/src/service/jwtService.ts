import { LoginType, AuthenticatedType, RoleEnum } from "vetilib-shared/schemas/ZodSchemas";
import { login } from "./authenticationService";
import { JsonWebTokenError, JwtPayload, sign, verify } from "jsonwebtoken";
import { personService } from "./personService";
import { veterinaryPracticeRouter } from "src/routes/veterinaryPractice";
import { veterinaryPracticeService } from "./veterinaryPracticeService";

export async function createJWT(subjectId: number, role: RoleEnum, isVerified: boolean) {
    // JwtPayload ist ein TypeScript-Type, der die Standard-Felder definiert
    // hier füllen wir unsere Zugriffberechtigung aus
    const payload: JwtPayload = {
        sub: String(subjectId),
        role: role,
        verified: isVerified
    }

    // hier unterschreiben wir die Zugriffsberechtigung aus und übergeben das ausgefüllte 'Dokument'
    const jwtString = sign(
        payload,
        process.env.JWT_SECRET,
        {
            expiresIn: parseInt(process.env.JWT_TTL),
            algorithm: "HS256"
        });
    return jwtString;
}

export async function verifyPasswordAndCreateJWT(email: string, password: string): Promise<string | undefined> {
    const finduser: AuthenticatedType | false = await login(email, password);
    if (!finduser) {
        return undefined;
    }
    let verified: boolean;

    if (finduser.role === "company") {
        verified = await veterinaryPracticeService.checkVerified(finduser.id);
    } else {
        verified = await personService.checkVerified(finduser.id);
    }
    return createJWT(finduser.id, finduser.role, verified);
}

export async function verifyCodeAndCreateJWT(role: RoleEnum, userId: number, code: string): Promise<string | undefined> {
    let check: boolean;
    let verified: boolean;
    if (role === "company") {
        check = await veterinaryPracticeService.checkConfirmationCodeExists(userId, code);
        verified = await veterinaryPracticeService.checkVerified(userId);
    } else {
        check = await personService.checkConfirmationCodeExists(userId, code);
        verified = await personService.checkVerified(userId);
    }
    if (!check) {
        return undefined;
    }
    
    return createJWT(userId, role, verified);
}

export function verifyJWT(jwtString: string | undefined): LoginType {
    if (!jwtString) {
        throw new JsonWebTokenError("JSON Web Token ist ungültig");
    }

    const payload = verify(jwtString, process.env.JWT_SECRET) as JwtPayload;
    const payloadID = payload.sub as string;
    const payloadRole = payload.role;
    const payloadEXP = payload.exp as number;
    const paylaodVerified = payload.verified as boolean;
    const loginRes: LoginType = {
        id: parseInt(payloadID),
        role: payloadRole,
        verified: paylaodVerified,
        exp: payloadEXP
    }
    return loginRes;
}