import prisma from "./client";

export default async function globalSetup() {
    if (!process.env.DATABASE_URL) {
        throw new Error("DATABASE URL not set, please fix globalSetup.")
    }
    await prisma.$connect();
}