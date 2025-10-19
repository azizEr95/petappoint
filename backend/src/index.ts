import { PrismaClient } from "../generated/prisma";

const prisma = new PrismaClient();

async function getTierAerzte() {
    const tierAerzte = await prisma.tieraerzte.findMany();
    console.log(tierAerzte);
}

getTierAerzte();