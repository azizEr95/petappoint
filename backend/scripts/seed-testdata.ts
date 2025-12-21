import { Prisma, Sexes } from "../generated/prisma";
import { prisma } from "../src/singletonPC";



async function seedTestdata() {
  console.log("🌱 Seeding test data...");

  try {
    const createdAddresses = await prisma.address.createMany({
      data: [
        {
          street: "Hauptstraße 1",
          cityCode: "10115",
          city: "Berlin",
          country: "Deutschland",
          latitude: 13.405,
          longitude: 52.52,
        },
        {
          street: "Bahnhofstraße 12",
          cityCode: "20095",
          city: "Hamburg",
          country: "Deutschland",
          longitude: 10.0,
          latitude: 53.55,
        },
        {
          street: "Marktplatz 5",
          cityCode: "80331",
          city: "München",
          country: "Deutschland",
          longitude: 11.5755,
          latitude: 48.1374,
        },
        {
          street: "Rheinallee 22",
          cityCode: "50667",
          city: "Köln",
          country: "Deutschland",
          longitude: 6.9603,
          latitude: 50.9375,
        },
        {
          street: "Kaiserstraße 8",
          cityCode: "60311",
          city: "Frankfurt am Main",
          country: "Deutschland",
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
        },
        /* 04 */ {
          firstName: "Maria",
          lastName: "May",
          sex: "female",
          dateOfBirth: new Date("1999-02-15"),
          addressId: 4,
          phone: "+493000000003",
          email: "m@m.de",
          password: "$2b$10$3aziu8mKSUNiJ7dGCGcKd.FZeiOSW2Nw5Ml0w7DhGWZtE3nR2Z6b2",
        },
        /* 05 */ {
          firstName: "Denis",
          lastName: "Deniz",
          sex: "not_known",
          dateOfBirth: new Date("2050-01-01"),
          addressId: 5,
          phone: "+493000000004",
          email: "joey@doey.de",
          password: "$2b$10$3aziu8mKSUNiJ7dGCGcKd.FZeiOSW2Nw5Ml0w7DhGWZtE3nR2Z6b2",
        },
        /* 06 */ {
          firstName: "Aziz",
          lastName: "Erol",
          sex: "male",
          dateOfBirth: new Date("1900-11-20"),
          addressId: 5,
          phone: "+493000000005",
          email: "aziz@erol.de",
          password: "$2b$10$3aziu8mKSUNiJ7dGCGcKd.FZeiOSW2Nw5Ml0w7DhGWZtE3nR2Z6b2",
        },
      ],
    });

    (await prisma.person.findMany()).forEach(async x => {
      await prisma.person_has_confirmation_code.create({
        data: {
          code: '123456',
          dateofcreation: new Date().toISOString(),
          verified: true,
          fk_personid: x.id
        }
      })
    });

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

    const createdAnimalGroups = await prisma.animalGroup.createMany({
      data: [
        /* id */
        /* 01 */ { name: "Viecher" },
        /* 02 */ { name: "Haustiere" },
        /* 03 */ { name: "Farm" },
        /* 04 */ { name: "Streuner" },
        /* 05 */ { name: "Farm" },
      ],
    });

    const createdAnimals = await prisma.animal.createMany({
      data: [
        /* 01 */ {
          name: "Bambi",
          dateOfBirth: new Date("2021-01-13"),
          dateOfBirthIsExact: true,
          weightInGram: 4000,
          heightInCm: null,
          timeOfDeath: null,
          isCastrated: true,
          lifestyle: "indoor",
          sex: "female",
          animalTypeId: 2,
          animalGroupId: null,
        },
        /* 02 */ {
          name: "Maya",
          dateOfBirth: new Date("2020-09-30"),
          dateOfBirthIsExact: true,
          weightInGram: 4300,
          heightInCm: null,
          timeOfDeath: null,
          isCastrated: true,
          lifestyle: "outdoor",
          sex: "female",
          animalTypeId: 2,
          animalGroupId: null,
        },
        /* 03 */ {
          name: "Huhn 1",
          dateOfBirth: null,
          dateOfBirthIsExact: false,
          weightInGram: null,
          heightInCm: null,
          timeOfDeath: null,
          isCastrated: true,
          lifestyle: "outdoor",
          sex: "female",
          animalTypeId: 7,
          animalGroupId: null,
        },
        /* 04 */ {
          name: "Huhn 2",
          dateOfBirth: null,
          dateOfBirthIsExact: false,
          weightInGram: null,
          heightInCm: null,
          timeOfDeath: null,
          isCastrated: true,
          lifestyle: "outdoor",
          sex: "female",
          animalTypeId: 7,
          animalGroupId: null,
        },
        /* 05 */ {
          name: "Huhn 3",
          dateOfBirth: null,
          dateOfBirthIsExact: false,
          weightInGram: null,
          heightInCm: null,
          timeOfDeath: null,
          isCastrated: true,
          lifestyle: "outdoor",
          sex: "female",
          animalTypeId: 7,
          animalGroupId: null,
        },
        /* 06 */ {
          name: "Huhn 4",
          dateOfBirth: null,
          dateOfBirthIsExact: false,
          weightInGram: null,
          heightInCm: null,
          timeOfDeath: null,
          isCastrated: true,
          lifestyle: "outdoor",
          sex: "female",
          animalTypeId: 7,
          animalGroupId: null,
        },
        /* 07 */ {
          name: "Huhn 5",
          dateOfBirth: null,
          dateOfBirthIsExact: false,
          weightInGram: null,
          heightInCm: null,
          timeOfDeath: null,
          isCastrated: true,
          lifestyle: "outdoor",
          sex: "female",
          animalTypeId: 7,
          animalGroupId: null,
        },
        /* 08 */ {
          name: "Cookie",
          dateOfBirth: new Date("2022-09-20"),
          dateOfBirthIsExact: false,
          weightInGram: 97000,
          heightInCm: 197,
          timeOfDeath: null,
          isCastrated: true,
          lifestyle: "outdoor",
          sex: "not_applicable",
          animalTypeId: 2,
          animalGroupId: null,
        },
      ],
    });

    const createdPersonHasAnimals = await prisma.personHasAnimal.createMany({
      data: [
        { personId: 6, animalId: 1 },
        { personId: 6, animalId: 2 },
        { personId: 1, animalId: 3 },
        { personId: 2, animalId: 4 },
        { personId: 4, animalId: 5 },
        { personId: 3, animalId: 6 },
      ],
    });

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

    const createdveterinarians = await prisma.veterinarian.createMany({
      data: [
        { id: 4, infoEmail: "maria@arzt.de", fk_veterinarypracticeid: 1 },
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

    await prisma.personHasFavorizedVeterinaryPractice.createMany({
      data: [
        { personId: 1, veterinaryPracticeId: 1 },
        { personId: 2, veterinaryPracticeId: 2 },
      ],
    });

    await prisma.veterinaryHasService.createMany({
      data: [
        { veterinaryId: 4, serviceId: 1 },
        { veterinaryId: 4, serviceId: 2 },
        { veterinaryId: 4, serviceId: 3 },
        { veterinaryId: 2, serviceId: 3 },
        { veterinaryId: 2, serviceId: 2 },
        { veterinaryId: 1, serviceId: 1 },
        { veterinaryId: 1, serviceId: 2 },
      ],
    });

    await prisma.veterinaryCanTreatAnimalType.createMany({
      data: [
        { veterinaryId: 4, animalTypeId: 1 },
        { veterinaryId: 4, animalTypeId: 2 },
        { veterinaryId: 4, animalTypeId: 3 },
        { veterinaryId: 2, animalTypeId: 3 },
        { veterinaryId: 2, animalTypeId: 5 },
        { veterinaryId: 2, animalTypeId: 6 },
        { veterinaryId: 1, animalTypeId: 3 },
      ],
    });
  } catch (error) {
    console.error("❌ Error seeding testdata:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

seedTestdata();