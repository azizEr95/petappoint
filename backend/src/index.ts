import { PrismaClient } from "../generated/prisma";

const prisma = new PrismaClient();

async function getUsers(){
    const users = await prisma.users.findMany();
    console.log(users);
}

getUsers();