import { PrismaClient,Prisma } from "../generated/prisma";

const prisma = new PrismaClient();

async function getPerson(id: number) {
    const person = await prisma.personen.findMany({
        where: {
            id: id
        }
    })
    console.log(person)
    await prisma.personen.delete({
        where: {
            id: id
        }
    })
}

async function createPerson() {
    const createdAdresse = await prisma.addressen.create({
        
        data: {
            strasse: "Lesser-Ury-Weg 27",
            citycode: "10557",
            city: "Berlin",
            country: "Germany"
        }
    })

    const createdPerson = await prisma.personen.create({
        data: {
            vorname: 'Aziz',
            nachname: 'Erol',
            geschlecht: 'm',
            geburtsdatum: new Date("December 17, 1995 03:24:00"),
            telefon: '015759712682',
            email: 'beba3606@bht-berlin.de',
            password: '123',
            addressen: {connect: createdAdresse}
        }
    })
    getPerson(createdPerson.id);
}



async function getTierAerzte() {
    const tierAerzte = await prisma.tieraerzte.findMany();
    console.log(tierAerzte);
}

createPerson();