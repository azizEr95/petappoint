import { prisma } from "../src/singletonPC";

async function seedTestdata() {
  console.log("🌱 Seeding test data...");

  try {
    const createdAddresses = await prisma.addresses.createMany({
      data: [
        {
          street: "Hauptstraße 1",
          citycode: "10115",
          city: "Berlin",
          country: "Deutschland",
          latitude: 13.405,
          longitude: 52.52,
        },
        {
          street: "Bahnhofstraße 12",
          citycode: "20095",
          city: "Hamburg",
          country: "Deutschland",
          longitude: 10.0,
          latitude: 53.55,
        },
        {
          street: "Marktplatz 5",
          citycode: "80331",
          city: "München",
          country: "Deutschland",
          longitude: 11.5755,
          latitude: 48.1374,
        },
        {
          street: "Rheinallee 22",
          citycode: "50667",
          city: "Köln",
          country: "Deutschland",
          longitude: 6.9603,
          latitude: 50.9375,
        },
        {
          street: "Kaiserstraße 8",
          citycode: "60311",
          city: "Frankfurt am Main",
          country: "Deutschland",
          longitude: 8.6821,
          latitude: 50.1109,
        },
      ],
    });

    const createdPersons = await prisma.persons.createMany({
      data: [
        /* 01 */ {
          firstname: "Joe",
          lastname: "Doe",
          sex: "male",
          dateofbirth: new Date("2000-01-01"),
          fk_address: 1,
          phone: "+493000000000",
          email: "joe@doe.de",
          password: "$2b$10$3aziu8mKSUNiJ7dGCGcKd.FZeiOSW2Nw5Ml0w7DhGWZtE3nR2Z6b2",
        },
        /* 02 */ {
          firstname: "Daniel",
          lastname: "Müller",
          sex: "male",
          dateofbirth: new Date("1920-05-10"),
          fk_address: 1,
          phone: "+493000000001",
          email: "daniel@daniel.de",
          password: "$2b$10$3aziu8mKSUNiJ7dGCGcKd.FZeiOSW2Nw5Ml0w7DhGWZtE3nR2Z6b2",
        },
        /* 03 */ {
          firstname: "James",
          lastname: "Jayjay",
          sex: "male",
          dateofbirth: new Date("1999-02-15"),
          fk_address: 2,
          phone: "+493000000002",
          email: "james@jay.de",
          password: "$2b$10$3aziu8mKSUNiJ7dGCGcKd.FZeiOSW2Nw5Ml0w7DhGWZtE3nR2Z6b2",
        },
        /* 04 */ {
          firstname: "Maria",
          lastname: "May",
          sex: "female",
          dateofbirth: new Date("1999-02-15"),
          fk_address: 4,
          phone: "+493000000003",
          email: "m@m.de",
          password: "$2b$10$3aziu8mKSUNiJ7dGCGcKd.FZeiOSW2Nw5Ml0w7DhGWZtE3nR2Z6b2",
        },
        /* 05 */ {
          firstname: "Denis",
          lastname: "Deniz",
          sex: "not_known",
          dateofbirth: new Date("2050-01-01"),
          fk_address: 5,
          phone: "+493000000004",
          email: "joey@doey.de",
          password: "$2b$10$3aziu8mKSUNiJ7dGCGcKd.FZeiOSW2Nw5Ml0w7DhGWZtE3nR2Z6b2",
        },
        /* 06 */ {
          firstname: "Aziz",
          lastname: "Erol",
          sex: "male",
          dateofbirth: new Date("1900-11-20"),
          fk_address: 5,
          phone: "+493000000005",
          email: "aziz@erol.de",
          password: "$2b$10$3aziu8mKSUNiJ7dGCGcKd.FZeiOSW2Nw5Ml0w7DhGWZtE3nR2Z6b2",
        },
      ],
    });

    const createdAnimalTypes = await prisma.animaltypes.createMany({
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

    const createdAnimalRaces = await prisma.animalraces.createMany({
      data: [
        /* id */
        //  Hund
        /* 01 */ { name: "Labrador", fk_animaltypeid: 1 },
        /* 02 */ { name: "Pudel", fk_animaltypeid: 1 },
        /* 03 */ { name: "Schäferhund", fk_animaltypeid: 1 },
        /* 04 */ { name: "Pitbull", fk_animaltypeid: 1 },
        // Katze
        /* 05 */ { name: "Britisch Kurzhaar", fk_animaltypeid: 2 },
        // Kleintier
        /* 06 */ { name: "Kaninchen", fk_animaltypeid: 3 },
        /* 07 */ { name: "Meerschweinchen", fk_animaltypeid: 3 },
        /* 08 */ { name: "Hamster", fk_animaltypeid: 3 },
        // Vogel
        /* 09 */ { name: "Papagei", fk_animaltypeid: 4 },
        /* 10 */ { name: "Wellensittich", fk_animaltypeid: 4 },
        /* 11 */ { name: "Taube", fk_animaltypeid: 4 },
        /* 12 */ { name: "Falke", fk_animaltypeid: 4 },
        /* 13 */ { name: "Krähe", fk_animaltypeid: 4 },
        /* 14 */ { name: "Rabe", fk_animaltypeid: 4 },
        /* 15 */ { name: "Aasgeier", fk_animaltypeid: 4 },
        // Reptil
        /* 16 */ { name: "Eidechse", fk_animaltypeid: 5 },
        /* 17 */ { name: "Schlange", fk_animaltypeid: 5 },
        // Pferd
        /* 18 */ { name: "Pegasus", fk_animaltypeid: 6 },
        /* 19 */ { name: "Pony", fk_animaltypeid: 6 },
        // Nutztier
        /* 20 */ { name: "Huhn", fk_animaltypeid: 7 },
        /* 21 */ { name: "Schaf", fk_animaltypeid: 7 },
        /* 22 */ { name: "Kuh", fk_animaltypeid: 7 },
        /* 23 */ { name: "Rind", fk_animaltypeid: 7 },
      ],
    });

    const createdAnimalGroups = await prisma.animalgroup.createMany({
      data: [
        /* id */
        /* 01 */ { name: "Viecher" },
        /* 02 */ { name: "Haustiere" },
        /* 03 */ { name: "Farm" },
        /* 04 */ { name: "Streuner" },
        /* 05 */ { name: "Farm" },
      ],
    });

    const createdAnimals = await prisma.animals.createMany({
      data: [
        /* 01 */ {
          name: "Bambi",
          dateofbirth: new Date("2021-01-13"),
          dateofbirthisexact: true,
          weightingram: 4000,
          heightincm: null,
          timeofdeath: null,
          iscastrated: true,
          lifestyleisindoors: true,
          sex: "female",
          fk_animaltypeid: 2,
          fk_animalgroupid: null,
        },
        /* 02 */ {
          name: "Maya",
          dateofbirth: new Date("2020-09-30"),
          dateofbirthisexact: true,
          weightingram: 4300,
          heightincm: null,
          timeofdeath: null,
          iscastrated: true,
          lifestyleisindoors: false,
          sex: "female",
          fk_animaltypeid: 2,
          fk_animalgroupid: null,
        },
        /* 03 */ {
          name: "Huhn 1",
          dateofbirth: null,
          dateofbirthisexact: false,
          weightingram: null,
          heightincm: null,
          timeofdeath: null,
          iscastrated: true,
          lifestyleisindoors: false,
          sex: "female",
          fk_animaltypeid: 7,
          fk_animalgroupid: null,
        },
        /* 04 */ {
          name: "Huhn 2",
          dateofbirth: null,
          dateofbirthisexact: false,
          weightingram: null,
          heightincm: null,
          timeofdeath: null,
          iscastrated: true,
          lifestyleisindoors: false,
          sex: "female",
          fk_animaltypeid: 7,
          fk_animalgroupid: null,
        },
        /* 05 */ {
          name: "Huhn 3",
          dateofbirth: null,
          dateofbirthisexact: false,
          weightingram: null,
          heightincm: null,
          timeofdeath: null,
          iscastrated: true,
          lifestyleisindoors: false,
          sex: "female",
          fk_animaltypeid: 7,
          fk_animalgroupid: null,
        },
        /* 06 */ {
          name: "Huhn 4",
          dateofbirth: null,
          dateofbirthisexact: false,
          weightingram: null,
          heightincm: null,
          timeofdeath: null,
          iscastrated: true,
          lifestyleisindoors: false,
          sex: "female",
          fk_animaltypeid: 7,
          fk_animalgroupid: null,
        },
        /* 07 */ {
          name: "Huhn 5",
          dateofbirth: null,
          dateofbirthisexact: false,
          weightingram: null,
          heightincm: null,
          timeofdeath: null,
          iscastrated: true,
          lifestyleisindoors: false,
          sex: "female",
          fk_animaltypeid: 7,
          fk_animalgroupid: null,
        },
        /* 08 */ {
          name: "Cookie",
          dateofbirth: new Date("2022-09-20"),
          dateofbirthisexact: false,
          weightingram: 97000,
          heightincm: 197,
          timeofdeath: null,
          iscastrated: true,
          lifestyleisindoors: false,
          sex: "not_applicable",
          fk_animaltypeid: 2,
          fk_animalgroupid: null,
        },
      ],
    });

    const createdPersonHasAnimals = await prisma.person_has_animal.createMany({
      data: [
        { fk_personid: 6, fk_animalid: 1 },
        { fk_personid: 6, fk_animalid: 2 },
        { fk_personid: 1, fk_animalid: 3 },
        { fk_personid: 2, fk_animalid: 4 },
        { fk_personid: 4, fk_animalid: 5 },
        { fk_personid: 3, fk_animalid: 6 },
      ],
    });

    const createdVeterinaryPractices = await prisma.veterinarypractices.createMany({
      data: [
        {
          name: "Tierarztpraxis Berlin Mitte",
          phone: "+49 30 123456",
          infoemail: "info@berlinvet.de",
          email: "kontakt@berlinvet.de",
          password: "$2b$10$3aziu8mKSUNiJ7dGCGcKd.FZeiOSW2Nw5Ml0w7DhGWZtE3nR2Z6b2",
          website: "https://www.berlinvet.de",
          info: "Kompetente Kleintierpraxis im Herzen Berlins.",
          fk_addressid: 1,
        },
        {
          name: "Alstertal Tierklinik Hamburg",
          phone: "+49 40 987654",
          infoemail: "info@alstertier.de",
          email: "kontakt@alstertier.de",
          password: "$2b$10$3aziu8mKSUNiJ7dGCGcKd.FZeiOSW2Nw5Ml0w7DhGWZtE3nR2Z6b2",
          website: "https://www.alstertier.de",
          info: "Moderne Tierklinik mit 24h-Notdienst.",
          fk_addressid: 2,
        },
        {
          name: "Tiergesundheit München",
          phone: "+49 89 111222",
          infoemail: "info@muenchentiere.de",
          email: "praxis@muenchentiere.de",
          password: "$2b$10$3aziu8mKSUNiJ7dGCGcKd.FZeiOSW2Nw5Ml0w7DhGWZtE3nR2Z6b2",
          website: null,
          info: "Praxis für Haustiere aller Art.",
          fk_addressid: 3,
        },
        {
          name: "VetKöln - Tiermedizin am Rhein",
          phone: "+49 221 333444",
          infoemail: "info@vetkoeln.de",
          email: "praxis@vetkoeln.de",
          password: "$2b$10$3aziu8mKSUNiJ7dGCGcKd.FZeiOSW2Nw5Ml0w7DhGWZtE3nR2Z6b2",
          website: "https://www.vetkoeln.de",
          info: "Spezialisiert auf Kleintiere und Exoten.",
          fk_addressid: 4,
        },
        {
          name: "FrankfurtVet - Zentrum für Tiermedizin",
          phone: "+49 69 555666",
          infoemail: "info@frankfurtvet.de",
          email: "kontakt@frankfurtvet.de",
          password: "$2b$10$3aziu8mKSUNiJ7dGCGcKd.FZeiOSW2Nw5Ml0w7DhGWZtE3nR2Z6b2",
          website: "https://www.frankfurtvet.de",
          info: "Tierärztliches Zentrum mit Chirurgie und Diagnostik.",
          fk_addressid: 5,
        },
      ],
    });

    const createdveterinarians = await prisma.Veterinarians.createMany({
      data: [
        { id: 4, infoemail: "maria@arzt.de", fk_veterinarypractice: 1 },
        { id: 2, infoemail: "daniel@arzt.de", fk_veterinarypractice: 2 },
        { id: 1, infoemail: "hi@gmx.de", fk_veterinarypractice: 4 },
      ],
    });

    const createdServices = await prisma.services.createMany({
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

    await prisma.person_has_favorized_veterinarypractice.createMany({
      data: [
        { fk_personid: 1, fk_veterinarypracticeid: 1 },
        { fk_personid: 2, fk_veterinarypracticeid: 2 },
        { fk_personid: 1, fk_veterinarypracticeid: 3 },
        { fk_personid: 4, fk_veterinarypracticeid: 3 },
      ],
    });

    await prisma.veterinary_has_service.createMany({
      data: [
        { fk_veterinaryid: 4, fk_serviceid: 1 },
        { fk_veterinaryid: 4, fk_serviceid: 2 },
        { fk_veterinaryid: 4, fk_serviceid: 3 },
        { fk_veterinaryid: 2, fk_serviceid: 3 },
        { fk_veterinaryid: 2, fk_serviceid: 2 },
        { fk_veterinaryid: 1, fk_serviceid: 1 },
        { fk_veterinaryid: 1, fk_serviceid: 2 },
      ],
    });

    await prisma.veterinary_can_treat_animaltype.createMany({
      data: [
        { fk_veterinaryid: 4, fk_animaltypeid: 1 },
        { fk_veterinaryid: 4, fk_animaltypeid: 2 },
        { fk_veterinaryid: 4, fk_animaltypeid: 3 },
        { fk_veterinaryid: 2, fk_animaltypeid: 3 },
        { fk_veterinaryid: 2, fk_animaltypeid: 5 },
        { fk_veterinaryid: 2, fk_animaltypeid: 6 },
        { fk_veterinaryid: 1, fk_animaltypeid: 3 },
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
