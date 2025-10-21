import { PrismaClient,Prisma } from "../generated/prisma";

const prisma = new PrismaClient();

async function getPerson(id: number) {
    const person = await prisma.persons.findMany({
        where: {
            id: id
        }
    })
    console.log(person)
    await prisma.persons.delete({
        where: {
            id: id
        }
    })
}

async function createPerson() {
    const createdAdresse = await prisma.addresses.create({
        data: {
            street: "Lesser-Ury-Weg 27",
            citycode: "10557",
            city: "Berlin",
            country: "Germany",
            longitude: 0.0,
            latitude: 0.0
        }
    })

    const createdPerson = await prisma.persons.create({
        data: {
            firstname: 'Aziz',
            lastname: 'Erol',
            sex: 'male',
            dateofbirth: new Date("December 17, 1995 03:24:00"),
            phone: '015759712682',
            email: 'beba3606@bht-berlin.de',
            password: '123',
            addresses: {connect: createdAdresse}
        }
    })
    getPerson(createdPerson.id);
}



async function getTierAerzte() {
    const tierAerzte = await prisma.veterinaries.findMany();
    console.log(tierAerzte);
}

createPerson();