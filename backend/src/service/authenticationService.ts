import { prisma } from '../singletonPC';
import bcrypt from "bcrypt";
import { PersonsAuthenticatedType } from 'vetlib-shared/schemas/ZodSchemas';
/*
* This Service acts as login layer
*/

export async function login(email: string, password: string): Promise<PersonsAuthenticatedType | false> {
    const foundPerson = await prisma.persons.findFirst({
        where: {
            email: email
        },
        select: {
            id: true,
            password: true
        }
    });

    if (!foundPerson) {
        return false;
    }
    if (!(await checkPassword(password, foundPerson.password))) {
        return false;
    }

    return {
        role: "person",
        id: foundPerson.id
    }
}

export async function checkPassword(password: string, hashedPassword: string): Promise<boolean> {
    return await bcrypt.compare(password, hashedPassword);
}