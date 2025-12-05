import { LoginType, PersonsAuthenticatedType } from "vetilib-shared/schemas/ZodSchemas";
import { login } from "./authenticationService";
import { JsonWebTokenError, JwtPayload, sign, verify } from "jsonwebtoken";


export async function verifyPasswordAndCreateJWT(email: string, password: string): Promise<string | undefined> {
    const secret = process.env.JWT_SECRET;
    const ttl = process.env.JWT_TTL;
    if (!secret || !ttl) {
        throw new Error("Umgebungsvariablen sind nicht richtig gesetzt");
    }

    const findperson: PersonsAuthenticatedType | false = await login(email, password);
    if (!findperson) {
        return undefined;
    }

    const ttlAsNumber: number = parseInt(ttl);
    const personID: string = String(findperson.id);

    // JwtPayload ist ein TypeScript-Type, der die Standard-Felder definiert
    // hier füllen wir unsere Zugriffberechtigung aus
    const payload: JwtPayload = {
        sub: personID,
        role: findperson.role,
    }

    // hier unterschreiben wir die Zugriffsberechtigung aus und übergeben das ausgefüllte 'Dokument'
    const jwtString = sign(
        payload,
        secret,
        {
            expiresIn: ttlAsNumber,
            algorithm: "HS256"
        });

    return jwtString;
}

export function verifyJWT(jwtString: string | undefined): LoginType {
    const secret = process.env.JWT_SECRET;
    const ttl = process.env.JWT_TTL;
    // verwende die Umgebungsvariablen, wenn diese nicht definiert sind wirf ein Fehler
    if (!secret || !ttl) {
        throw new Error("Umgebungsvariablen sind nicht richtig gesetzt");
    }

    if (!jwtString) {
        throw new JsonWebTokenError("JSON Web Token ist ungültig");
    }
    const payload = verify(jwtString, secret) as JwtPayload;

    const payloadID = payload.sub as string;
    const payloadRole = payload.role;
    const payloadEXP = payload.exp as number;
    
    const loginRes : LoginType= {
        id: parseInt(payloadID),
        role: payloadRole,
        exp: payloadEXP
    }
    return loginRes;
}