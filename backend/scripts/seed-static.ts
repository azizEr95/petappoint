import { prisma } from "../src/singletonPC";

/**
 * Static Seed: Fixed, deterministic data
 * Creates practices, persons, animals with constant data
 * Idempotent: skips if already exists
 * Run once per fresh DB, data persists across restarts
 *
 * Data volumes:
 * - 15 practices (fixed, exact)
 * - 6 test accounts (fixed)
 * - 24 animals (1 per race, good variation across all 7 animal types)
 * - 3 veterinarians
 */

// ============================
// FIXED DATA DEFINITIONS
// ============================

const FIXED_PRACTICES = [
  { email: "kontakt@berlinvet.de", name: "Tierarztpraxis Berlin Mitte", city: "Berlin", cityCode: "10115", phone: "+49 30 123456", latitude: 52.52, longitude: 13.405 },
  { email: "kontakt@alstertier.de", name: "Alstertal Tierklinik Hamburg", city: "Hamburg", cityCode: "20095", phone: "+49 40 987654", latitude: 53.55, longitude: 10.0 },
  { email: "kontakt@muenchen-tier.de", name: "Tierarztpraxis München", city: "München", cityCode: "80331", phone: "+49 89 123456", latitude: 48.1374, longitude: 11.5755 },
  { email: "kontakt@koeln-vet.de", name: "Tierarztpraxis Köln", city: "Köln", cityCode: "50667", phone: "+49 221 123456", latitude: 50.9375, longitude: 6.9603 },
  { email: "kontakt@frankfurt-vet.de", name: "Tierarztpraxis Frankfurt", city: "Frankfurt am Main", cityCode: "60311", phone: "+49 69 123456", latitude: 50.1109, longitude: 8.6821 },
  { email: "kontakt@stuttgart-vet.de", name: "Tierarztpraxis Stuttgart", city: "Stuttgart", cityCode: "70173", phone: "+49 711 123456", latitude: 48.7758, longitude: 9.1829 },
  { email: "kontakt@duesseldorf-vet.de", name: "Tierarztpraxis Düsseldorf", city: "Düsseldorf", cityCode: "40210", phone: "+49 211 123456", latitude: 51.2277, longitude: 6.7735 },
  { email: "kontakt@leipzig-vet.de", name: "Tierarztpraxis Leipzig", city: "Leipzig", cityCode: "04103", phone: "+49 341 123456", latitude: 51.3397, longitude: 12.3731 },
  { email: "kontakt@dresden-vet.de", name: "Tierarztpraxis Dresden", city: "Dresden", cityCode: "01067", phone: "+49 351 123456", latitude: 51.0504, longitude: 13.7372 },
  { email: "kontakt@hannover-vet.de", name: "Tierarztpraxis Hannover", city: "Hannover", cityCode: "30159", phone: "+49 511 123456", latitude: 52.3759, longitude: 9.732 },
  { email: "kontakt@nuernberg-vet.de", name: "Tierarztpraxis Nürnberg", city: "Nürnberg", cityCode: "90402", phone: "+49 911 123456", latitude: 49.4521, longitude: 11.0767 },
  { email: "kontakt@bremen-vet.de", name: "Tierarztpraxis Bremen", city: "Bremen", cityCode: "28195", phone: "+49 421 123456", latitude: 53.0793, longitude: 8.8017 },
  { email: "kontakt@essen-vet.de", name: "Tierarztpraxis Essen", city: "Essen", cityCode: "45127", phone: "+49 201 123456", latitude: 51.4556, longitude: 7.0116 },
  { email: "kontakt@dortmund-vet.de", name: "Tierarztpraxis Dortmund", city: "Dortmund", cityCode: "44135", phone: "+49 231 123456", latitude: 51.5136, longitude: 7.4653 },
  { email: "kontakt@bonn-vet.de", name: "Tierarztpraxis Bonn", city: "Bonn", cityCode: "53111", phone: "+49 228 123456", latitude: 50.7374, longitude: 7.0982 },
];

const FIXED_PERSONS = [
  { email: "joe@doe.de", firstName: "Joe", lastName: "Doe", city: "Berlin", cityCode: "10115" },
  { email: "daniel@daniel.de", firstName: "Daniel", lastName: "Müller", city: "Berlin", cityCode: "10115" },
  { email: "james@jay.de", firstName: "James", lastName: "Jayjay", city: "Hamburg", cityCode: "20095" },
  { email: "m@m.de", firstName: "Maria", lastName: "May", city: "Köln", cityCode: "50667" },
  { email: "joey@doey.de", firstName: "Denis", lastName: "Deniz", city: "Frankfurt am Main", cityCode: "60311" },
  { email: "aziz@erol.de", firstName: "Aziz", lastName: "Erol", city: "Frankfurt am Main", cityCode: "60311" },
];

// 24 animals: 1 per race + variation across all 7 animal types
const FIXED_ANIMALS = [
  // Hund (4 races, 1 per race)
  { name: "Rex", ownerEmail: "joe@doe.de", animalTypeId: 1, raceId: 1 }, // Labrador
  { name: "Buddy", ownerEmail: "daniel@daniel.de", animalTypeId: 1, raceId: 2 }, // Pudel
  { name: "Charlie", ownerEmail: "james@jay.de", animalTypeId: 1, raceId: 3 }, // Schäferhund
  { name: "Duke", ownerEmail: "m@m.de", animalTypeId: 1, raceId: 4 }, // Pitbull

  // Katze (1 race, 2 animals for Aziz ONLY)
  { name: "Bambi", ownerEmail: "aziz@erol.de", animalTypeId: 2, raceId: 5 }, // Britisch Kurzhaar
  { name: "Maya", ownerEmail: "aziz@erol.de", animalTypeId: 2, raceId: 5 },

  // Kleintier (3 races, 1 per race)
  { name: "Hoppy", ownerEmail: "joe@doe.de", animalTypeId: 3, raceId: 6 }, // Kaninchen
  { name: "Whiskers", ownerEmail: "daniel@daniel.de", animalTypeId: 3, raceId: 7 }, // Meerschweinchen
  { name: "Nibbles", ownerEmail: "james@jay.de", animalTypeId: 3, raceId: 8 }, // Hamster

  // Vogel (6 races, 1 per race)
  { name: "Polly", ownerEmail: "m@m.de", animalTypeId: 4, raceId: 9 }, // Papagei
  { name: "Tweety", ownerEmail: "joey@doey.de", animalTypeId: 4, raceId: 10 }, // Wellensittich
  { name: "Taube1", ownerEmail: "joe@doe.de", animalTypeId: 4, raceId: 11 }, // Taube
  { name: "Falky", ownerEmail: "daniel@daniel.de", animalTypeId: 4, raceId: 12 }, // Falke
  { name: "Krähe1", ownerEmail: "james@jay.de", animalTypeId: 4, raceId: 13 }, // Krähe
  { name: "Raven", ownerEmail: "joey@doey.de", animalTypeId: 4, raceId: 14 }, // Rabe
  { name: "Geier1", ownerEmail: "joe@doe.de", animalTypeId: 4, raceId: 15 }, // Aasgeier

  // Reptil (2 races, 1 per race)
  { name: "Lizzy", ownerEmail: "m@m.de", animalTypeId: 5, raceId: 16 }, // Eidechse
  { name: "Slinky", ownerEmail: "joey@doey.de", animalTypeId: 5, raceId: 17 }, // Schlange

  // Pferd (2 races, 1 per race)
  { name: "Pegasus", ownerEmail: "james@jay.de", animalTypeId: 6, raceId: 18 }, // Pegasus
  { name: "Pony1", ownerEmail: "daniel@daniel.de", animalTypeId: 6, raceId: 19 }, // Pony

  // Nutztier (4 races, 1 per race)
  { name: "Huhn1", ownerEmail: "m@m.de", animalTypeId: 7, raceId: 20 }, // Huhn
  { name: "Schaf1", ownerEmail: "james@jay.de", animalTypeId: 7, raceId: 21 }, // Schaf
  { name: "Cow1", ownerEmail: "joey@doey.de", animalTypeId: 7, raceId: 22 }, // Kuh
  { name: "Bull1", ownerEmail: "daniel@daniel.de", animalTypeId: 7, raceId: 23 }, // Rind
];

const FIXED_VETS = [
  { email: "maria.vet@example.de", firstName: "Maria", lastName: "Schmidt", practiceEmail: "kontakt@berlinvet.de", city: "Berlin", cityCode: "10115" },
  { email: "daniel.vet@example.de", firstName: "Daniel", lastName: "Fischer", practiceEmail: "kontakt@alstertier.de", city: "Hamburg", cityCode: "20095" },
  { email: "joe.vet@example.de", firstName: "Joe", lastName: "Wagner", practiceEmail: "kontakt@berlinvet.de", city: "Berlin", cityCode: "10115" },
];

// ============================
// SEEDING FUNCTION
// ============================

async function seedStatic() {
  console.log("🌱 Seeding static data (practices, persons, animals)...");

  try {
    const germany = await prisma.countries.findFirst({
      where: { name: "Deutschland" },
    });
    if (!germany) {
      throw new Error("Germany not found");
    }

    // ============================
    // Phase 1: Foundation (services, animal types)
    // ============================
    console.log("📋 Setting up foundation data...");

    const existingServices = await prisma.service.count();
    if (existingServices > 0) {
      console.log("✓ Services already exist");
    } else {
      await prisma.service.createMany({
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
      console.log("✓ Created services");
    }

    const existingTypes = await prisma.animalType.count();
    if (existingTypes > 0) {
      console.log("✓ Animal types already exist");
    } else {
      await prisma.animalType.createMany({
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
      console.log("✓ Created animal types");
    }

    const existingRaces = await prisma.animalRace.count();
    if (existingRaces > 0) {
      console.log("✓ Animal races already exist");
    } else {
      await prisma.animalRace.createMany({
        data: [
          { name: "Labrador", animalTypeId: 1 },
          { name: "Pudel", animalTypeId: 1 },
          { name: "Schäferhund", animalTypeId: 1 },
          { name: "Pitbull", animalTypeId: 1 },
          { name: "Britisch Kurzhaar", animalTypeId: 2 },
          { name: "Kaninchen", animalTypeId: 3 },
          { name: "Meerschweinchen", animalTypeId: 3 },
          { name: "Hamster", animalTypeId: 3 },
          { name: "Papagei", animalTypeId: 4 },
          { name: "Wellensittich", animalTypeId: 4 },
          { name: "Taube", animalTypeId: 4 },
          { name: "Falke", animalTypeId: 4 },
          { name: "Krähe", animalTypeId: 4 },
          { name: "Rabe", animalTypeId: 4 },
          { name: "Aasgeier", animalTypeId: 4 },
          { name: "Eidechse", animalTypeId: 5 },
          { name: "Schlange", animalTypeId: 5 },
          { name: "Pegasus", animalTypeId: 6 },
          { name: "Pony", animalTypeId: 6 },
          { name: "Huhn", animalTypeId: 7 },
          { name: "Schaf", animalTypeId: 7 },
          { name: "Kuh", animalTypeId: 7 },
          { name: "Rind", animalTypeId: 7 },
        ],
      });
      console.log("✓ Created animal races");
    }

    const existingGroups = await prisma.animalGroup.count();
    if (existingGroups > 0) {
      console.log("✓ Animal groups already exist");
    } else {
      await prisma.animalGroup.createMany({
        data: [
          { name: "Haustiere" },
          { name: "Nutztiere" },
          { name: "Wildtiere" },
          { name: "Streuner" },
          { name: "Zucht" },
        ],
      });
      console.log("✓ Created animal groups");
    }

    const services = await prisma.service.findMany({ select: { id: true } });
    const animalTypes = await prisma.animalType.findMany({ select: { id: true } });

    // ============================
    // Phase 2: 15 Practices
    // ============================
    console.log("🏥 Creating 15 veterinary practices...");

    let practicesCreated = 0;
    const practiceMap = new Map<string, { id: number; email: string }>();

    for (const practiceData of FIXED_PRACTICES) {
      const existing = await prisma.veterinaryPractice.findUnique({
        where: { email: practiceData.email },
        select: { id: true },
      });

      if (existing) {
        practiceMap.set(practiceData.email, { id: existing.id, email: practiceData.email });
        continue;
      }

      const practice = await prisma.veterinaryPractice.create({
        data: {
          name: practiceData.name,
          phone: practiceData.phone,
          infoEmail: `info-${practiceData.email}`,
          email: practiceData.email,
          password: "Vetilib123!",
          website: `https://www.tierarzt-${practiceData.city.toLowerCase().replace(/\s/g, "-")}.de`,
          info: "Moderne Tierarztpraxis mit umfassendem Leistungsspektrum.",
          address: {
            create: {
              street: `Hauptstraße 1`,
              cityCode: practiceData.cityCode,
              city: practiceData.city,
              fk_country: germany.id,
              longitude: practiceData.longitude,
              latitude: practiceData.latitude,
            },
          },
        },
      });

      await prisma.veterinarypractices_has_confirmation_code.create({
        data: {
          code: "222222",
          dateofcreation: new Date(),
          verified: true,
          fk_veterinarypracticeid: practice.id,
        },
      });

      practiceMap.set(practiceData.email, { id: practice.id, email: practiceData.email });
      practicesCreated++;
    }

    console.log(`✅ ${practicesCreated} practices created`);

    // ============================
    // Phase 3: 6 Fixed Test Accounts
    // ============================
    console.log("👥 Creating 6 fixed persons...");

    let personsCreated = 0;
    const personMap = new Map<string, number>();

    for (const personData of FIXED_PERSONS) {
      const existing = await prisma.person.findUnique({
        where: { email: personData.email },
        select: { id: true },
      });

      if (existing) {
        personMap.set(personData.email, existing.id);
        continue;
      }

      const person = await prisma.person.create({
        data: {
          firstName: personData.firstName,
          lastName: personData.lastName,
          sex: "male",
          dateOfBirth: new Date("1990-01-01"),
          phone: "+49 30 000000",
          email: personData.email,
          password: "Vetilib123!",
          address: {
            create: {
              street: `Hauptstraße 1`,
              cityCode: personData.cityCode,
              city: personData.city,
              fk_country: germany.id,
              longitude: 13.0,
              latitude: 52.0,
            },
          },
        },
      });

      await prisma.person_has_confirmation_code.create({
        data: {
          code: "222222",
          dateofcreation: new Date().toISOString(),
          verified: true,
          fk_personid: person.id,
        },
      });

      personMap.set(personData.email, person.id);
      personsCreated++;
    }

    console.log(`✅ ${personsCreated} persons created`);

    // ============================
    // Phase 4: 3 Fixed Veterinarians
    // ============================
    console.log("👨‍⚕️ Creating 3 fixed veterinarians...");

    let vetsCreated = 0;

    for (const vetData of FIXED_VETS) {
      const existing = await prisma.person.findUnique({
        where: { email: vetData.email },
        select: { id: true },
      });

      if (existing) {
        continue;
      }

      const practice = practiceMap.get(vetData.practiceEmail);
      if (!practice) {
        console.log(`⚠️  Practice ${vetData.practiceEmail} not found`);
        continue;
      }

      const person = await prisma.person.create({
        data: {
          firstName: vetData.firstName,
          lastName: vetData.lastName,
          sex: "male",
          dateOfBirth: new Date("1985-01-01"),
          phone: "+49 30 111111",
          email: vetData.email,
          password: "Vetilib123!",
          address: {
            create: {
              street: `Hauptstraße 1`,
              cityCode: vetData.cityCode,
              city: vetData.city,
              fk_country: germany.id,
              longitude: 13.0,
              latitude: 52.0,
            },
          },
        },
      });

      await prisma.veterinarian.create({
        data: {
          id: person.id,
          infoEmail: vetData.email,
          fk_veterinarypracticeid: practice.id,
        },
      });

      await prisma.person_has_confirmation_code.create({
        data: {
          code: "222222",
          dateofcreation: new Date().toISOString(),
          verified: true,
          fk_personid: person.id,
        },
      });

      vetsCreated++;
    }

    console.log(`✅ ${vetsCreated} veterinarians created`);

    // ============================
    // Phase 5: 24 Fixed Animals (1 per race + variation)
    // ============================
    console.log("🐾 Creating 24 fixed animals...");

    let animalsCreated = 0;

    for (const animalData of FIXED_ANIMALS) {
      const ownerPersonId = personMap.get(animalData.ownerEmail);
      if (!ownerPersonId) {
        console.log(`⚠️  Owner ${animalData.ownerEmail} not found, skipping animal ${animalData.name}`);
        continue;
      }

      const existingAnimal = await prisma.animal.findFirst({
        where: {
          name: animalData.name,
          personHasAnimals: {
            some: { personId: ownerPersonId },
          },
        },
      });

      if (existingAnimal) {
        continue;
      }

      const animal = await prisma.animal.create({
        data: {
          name: animalData.name,
          dateOfBirth: new Date("2021-01-13"),
          dateOfBirthIsExact: true,
          weightInGram: 4000,
          isCastrated: true,
          lifestyle: "indoor",
          sex: "female",
          animalTypeId: animalData.animalTypeId,
        },
      });

      await prisma.personHasAnimal.create({
        data: {
          personId: ownerPersonId,
          animalId: animal.id,
        },
      });

      animalsCreated++;
    }

    console.log(`✅ ${animalsCreated} animals created`);

    // ============================
    // Phase 6: Link Veterinarians to Services & Animal Types
    // ============================
    console.log("🔗 Linking veterinarians to services and animal types...");

    const allVets = await prisma.veterinarian.findMany({ select: { id: true } });

    for (const vet of allVets) {
      const existingServices = await prisma.veterinaryHasService.findFirst({
        where: { veterinaryId: vet.id },
      });

      if (!existingServices && services.length > 0) {
        const serviceIds = [services[0].id, services[1].id, services[2].id];
        await prisma.veterinaryHasService.createMany({
          data: serviceIds.map((serviceId) => ({
            veterinaryId: vet.id,
            serviceId,
          })),
          skipDuplicates: true,
        });
      }

      const existingTypes = await prisma.veterinaryCanTreatAnimalType.findFirst({
        where: { veterinaryId: vet.id },
      });

      if (!existingTypes && animalTypes.length > 0) {
        const typeIds = [animalTypes[0].id, animalTypes[1].id];
        await prisma.veterinaryCanTreatAnimalType.createMany({
          data: typeIds.map((typeId) => ({
            veterinaryId: vet.id,
            animalTypeId: typeId,
          })),
          skipDuplicates: true,
        });
      }
    }

    console.log("✓ Linked veterinarians");

    // ============================
    // Summary
    // ============================
    const totalPractices = await prisma.veterinaryPractice.count();
    const totalPersons = await prisma.person.count();
    const totalAnimals = await prisma.animal.count();
    const totalVets = await prisma.veterinarian.count();

    console.log("\n✅ Static seeding complete!");
    console.log(`   🏥 Total Practices: ${totalPractices}`);
    console.log(`   👨‍⚕️ Total Veterinarians: ${totalVets}`);
    console.log(`   👥 Total Persons: ${totalPersons}`);
    console.log(`   🐾 Total Animals: ${totalAnimals}`);
  } catch (error) {
    console.error("❌ Error seeding static data:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

seedStatic();
