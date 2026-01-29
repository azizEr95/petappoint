import { prisma } from "../../backend/src/singletonPC";

// initialze db with data for e2e tests
// do not change data here, if changes are made the e2e tests might break
// this script is executed in the CI to seed the database before running e2e tests
async function seedE2ETests() {
    try {

        // create required data and persons
        const createdAnimalTypes = await prisma.animalType.createMany({
            data: [
                { name: "Hund" },
                { name: "Katze" },
                { name: "Kleintier" },
                { name: "Vogel" },
                { name: "Reptil" },
                { name: "Pferd" },
                { name: "Nutztier" },
            ],
        });

        const createdAnimalRaces = await prisma.animalRace.createMany({
            data: [
        /* id */
        //  Hund
        /* 01 */ { name: "Labrador", animalTypeId: 1 },
        /* 02 */ { name: "Pudel", animalTypeId: 1 },
        /* 03 */ { name: "Schäferhund", animalTypeId: 1 },
        /* 04 */ { name: "Pitbull", animalTypeId: 1 },
        // Katze
        /* 05 */ { name: "Britisch Kurzhaar", animalTypeId: 2 },
        // Kleintier
        /* 06 */ { name: "Kaninchen", animalTypeId: 3 },
        /* 07 */ { name: "Meerschweinchen", animalTypeId: 3 },
        /* 08 */ { name: "Hamster", animalTypeId: 3 },
        // Vogel
        /* 09 */ { name: "Papagei", animalTypeId: 4 },
        /* 10 */ { name: "Wellensittich", animalTypeId: 4 },
        /* 11 */ { name: "Taube", animalTypeId: 4 },
        /* 12 */ { name: "Falke", animalTypeId: 4 },
        /* 13 */ { name: "Krähe", animalTypeId: 4 },
        /* 14 */ { name: "Rabe", animalTypeId: 4 },
        /* 15 */ { name: "Aasgeier", animalTypeId: 4 },
        // Reptil
        /* 16 */ { name: "Eidechse", animalTypeId: 5 },
        /* 17 */ { name: "Schlange", animalTypeId: 5 },
        // Pferd
        /* 18 */ { name: "Pegasus", animalTypeId: 6 },
        /* 19 */ { name: "Pony", animalTypeId: 6 },
        // Nutztier
        /* 20 */ { name: "Huhn", animalTypeId: 7 },
        /* 21 */ { name: "Schaf", animalTypeId: 7 },
        /* 22 */ { name: "Kuh", animalTypeId: 7 },
        /* 23 */ { name: "Rind", animalTypeId: 7 },
            ],
        });

        let germany = await prisma.countries.findUnique({where: {code: 'DEU'}});;
        if(!germany){
            germany = await prisma.countries.create({data:{code: 'DEU', name:'Deutschland'}});
        }

        const createdAddresses = await prisma.address.createMany({
            data: [
                {
                    street: "Hauptstraße 1",
                    cityCode: "10115",
                    city: "Berlin",
                    fk_country: germany.id,
                    latitude: 13.405,
                    longitude: 52.52,
                },
                {
                    street: "Bahnhofstraße 12",
                    cityCode: "20095",
                    city: "Hamburg",
                    fk_country: germany.id,
                    longitude: 10.0,
                    latitude: 53.55,
                },
                {
                    street: "Marktplatz 5",
                    cityCode: "80331",
                    city: "München",
                    fk_country: germany.id,
                    longitude: 11.5755,
                    latitude: 48.1374,
                },
                {
                    street: "Rheinallee 22",
                    cityCode: "50667",
                    city: "Köln",
                    fk_country: germany.id,
                    longitude: 6.9603,
                    latitude: 50.9375,
                },
                {
                    street: "Kaiserstraße 8",
                    cityCode: "60311",
                    city: "Frankfurt am Main",
                    fk_country: germany.id,
                    longitude: 8.6821,
                    latitude: 50.1109,
                },
            ],
        });

        const createdPersons = await prisma.person.createMany({
            data: [
        /* 01 */ {
                    firstName: "Joe",
                    lastName: "Doe",
                    sex: "male",
                    dateOfBirth: new Date("2000-01-01"),
                    addressId: 1,
                    phone: "+493000000000",
                    email: "joe@doe.de",
                    password: "$2b$10$3aziu8mKSUNiJ7dGCGcKd.FZeiOSW2Nw5Ml0w7DhGWZtE3nR2Z6b2",
                },
        /* 02 */ {
                    firstName: "Daniel",
                    lastName: "Müller",
                    sex: "male",
                    dateOfBirth: new Date("1920-05-10"),
                    addressId: 1,
                    phone: "+493000000001",
                    email: "daniel@daniel.de",
                    password: "$2b$10$3aziu8mKSUNiJ7dGCGcKd.FZeiOSW2Nw5Ml0w7DhGWZtE3nR2Z6b2",
                },
        /* 03 */ {
                    firstName: "James",
                    lastName: "Jayjay",
                    sex: "male",
                    dateOfBirth: new Date("1999-02-15"),
                    addressId: 2,
                    phone: "+493000000002",
                    email: "james@jay.de",
                    password: "$2b$10$3aziu8mKSUNiJ7dGCGcKd.FZeiOSW2Nw5Ml0w7DhGWZtE3nR2Z6b2",
                }],
        });

        const userE2E = await prisma.person.create({
            data: {
                firstName: "Max",
                lastName: "Mustermann",
                dateOfBirth: new Date("2025-12-23"),
                email: `e2e-tester@bht-berlin.de`,
                password: "Hallo123!E2ETest",
                addressId: 1,
                phone: "+4930123456789",
                sex: 'male'
            }
        });

        (await prisma.person.findMany()).forEach(async x => { // verify all created persons
            await prisma.person_has_confirmation_code.create({
                data: {
                    code: '123456',
                    dateofcreation: new Date().toISOString(),
                    verified: true,
                    fk_personid: x.id
                }
            })
        });

        await Promise.all([createdAnimalTypes, createdAnimalRaces, userE2E, createdAddresses, createdPersons]);

        // create ptactice, vets and services
        const createdVeterinaryPractices = await prisma.veterinaryPractice.createMany({
            data: [
                {
                    name: "Tierarztpraxis Berlin Mitte",
                    phone: "+49 30 123456",
                    infoEmail: "info@berlinvet.de",
                    email: "kontakt@berlinvet.de",
                    password: "$2b$10$3aziu8mKSUNiJ7dGCGcKd.FZeiOSW2Nw5Ml0w7DhGWZtE3nR2Z6b2",
                    website: "https://www.berlinvet.de",
                    info: "Kompetente Kleintierpraxis im Herzen Berlins.",
                    addressId: 1,
                },
                {
                    name: "Alstertal Tierklinik Hamburg",
                    phone: "+49 40 987654",
                    infoEmail: "info@alstertier.de",
                    email: "kontakt@alstertier.de",
                    password: "$2b$10$3aziu8mKSUNiJ7dGCGcKd.FZeiOSW2Nw5Ml0w7DhGWZtE3nR2Z6b2",
                    website: "https://www.alstertier.de",
                    info: "Moderne Tierklinik mit 24h-Notdienst.",
                    addressId: 2,
                }
            ],
        });

        const createdVeterinarians = await prisma.veterinarian.createMany({
            data: [
                { id: 3, infoEmail: "maria@arzt.de", fk_veterinarypracticeid: 1 },
                { id: 2, infoEmail: "daniel@arzt.de", fk_veterinarypracticeid: 2 },
                { id: 1, infoEmail: "hi@gmx.de", fk_veterinarypracticeid: 1 },
            ],
        });

        const createdServices = await prisma.service.createMany({
            data: [
                { name: "Allgemeine Untersuchung" },
                { name: "Röntgen" },
                { name: "Impfung" },
                { name: "Entwurmung" },
                { name: "Blutuntersuchung" },
                { name: "Kastration" },
                { name: "Untersuchung" },
                { name: "Zahnextraktion" },
                { name: "Zahnkontrolle" },
                { name: "Physiotherapie" },
                { name: "Notfalltermin" },
            ],
        });

        const veterinaryService = await prisma.veterinaryHasService.createMany({
            data: [
                { veterinaryId: 3, serviceId: 1 },
                { veterinaryId: 3, serviceId: 2 },
                { veterinaryId: 3, serviceId: 3 },
                { veterinaryId: 2, serviceId: 3 },
                { veterinaryId: 2, serviceId: 2 },
                { veterinaryId: 1, serviceId: 1 },
                { veterinaryId: 1, serviceId: 2 },
            ],
        });

        const veterinaryAnimaltype = await prisma.veterinaryCanTreatAnimalType.createMany({
            data: [
                { veterinaryId: 3, animalTypeId: 1 },
                { veterinaryId: 3, animalTypeId: 2 },
                { veterinaryId: 3, animalTypeId: 3 },
                { veterinaryId: 2, animalTypeId: 3 },
                { veterinaryId: 2, animalTypeId: 5 },
                { veterinaryId: 2, animalTypeId: 6 },
                { veterinaryId: 1, animalTypeId: 3 },
            ],
        });

        await Promise.all([createdVeterinaryPractices, createdVeterinarians, createdServices, veterinaryService, veterinaryAnimaltype]);

        // create appointments
        const practices = await prisma.veterinaryPractice.findMany({
            select: { id: true },
        });
        const vets = await prisma.veterinarian.findMany({
            select: { id: true, fk_veterinarypracticeid: true },
        });

        const appointments: any[] = [];
        const now = new Date();

        for (const [index, practice] of practices.entries()) {
            const practiceVets = vets.filter((v) => v.fk_veterinarypracticeid === practice.id);
            if (practiceVets.length === 0) {
                continue;
            }

            const startOffset = index % 2 === 1 ? 14 : 1; // first appointment in 2 weeks for odd indexed practices

            for (let dayOffset = startOffset; dayOffset <= 7; dayOffset++) { // Generate appointments for next 7 days
                const date = new Date(now);
                date.setDate(date.getDate() + dayOffset);

                const dayOfWeek = date.getDay();
                const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;

                const appointmentsPerDay = Math.floor(Math.random() * 3) + 2 // random between 2 and 4

                for (let i = 0; i < appointmentsPerDay; i++) {
                    const hour = 8 + Math.floor(Math.random() * 10);
                    const minute = Math.random() > 0.5 ? 0 : 30;

                    const startTime = new Date(date);
                    startTime.setHours(hour, minute, 0, 0);

                    const endTime = new Date(startTime);
                    endTime.setMinutes(endTime.getMinutes() + 30 + Math.floor(Math.random() * 3) * 15);

                    const vet = practiceVets[Math.floor(Math.random() * practiceVets.length)];

                    appointments.push({
                        startTime,
                        endTime,
                        animalId: null,
                        veterinaryId: vet.id,
                        veterinaryPracticeId: practice.id,
                        serviceId: null,
                        notes: null,
                    });
                }
            }
        }

        const created = await prisma.appointment.createMany({
            data: appointments,
        });
        await Promise.all([created]);
        const appointmentIDsWithVet = await prisma.appointment.findMany({
            select: { id: true, veterinaryId: true },
        });

        const vetServices = await prisma.veterinaryHasService.findMany({
            select: { veterinaryId: true, serviceId: true },
        });
        const vetServiceMap = new Map<number, number[]>();
        for (const { veterinaryId, serviceId } of vetServices) {
            const arr = vetServiceMap.get(veterinaryId) ?? [];
            arr.push(serviceId);
            vetServiceMap.set(veterinaryId, arr);
        }

        // Create appointment_has_service links for all services a vet offers
        const appointmentHasService: { appointmentId: number, serviceId: number }[] = [];
        for (const appt of appointmentIDsWithVet) {
            const serviceIds = vetServiceMap.get(appt.veterinaryId) ?? [];
            for (const sId of serviceIds) {
                appointmentHasService.push({
                    appointmentId: appt.id,
                    serviceId: sId,
                });
            }
        }

        if (appointmentHasService.length > 0) {
            const createAppointmentHasService = await prisma.appointmentHasService.createMany({
                data: appointmentHasService,
            });
            await Promise.all([createAppointmentHasService]);
        }

    } catch (error) {
        console.error("❌ Error seeding e2e:", error);
        process.exit(1);
    } finally {
        await prisma.$disconnect();
    }
}

export default seedE2ETests;