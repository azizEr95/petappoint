import { prisma } from "../src/singletonPC";
import { Sexes } from "../generated/prisma";

// ============================
// HELPER FUNCTIONS
// ============================

interface City {
  name: string;
  citycode: string;
  longitude: number;
  latitude: number;
}

const GERMAN_CITIES: City[] = [
  { name: "Berlin", citycode: "10115", longitude: 13.405, latitude: 52.52 },
  { name: "Hamburg", citycode: "20095", longitude: 10.0, latitude: 53.55 },
  { name: "München", citycode: "80331", longitude: 11.5755, latitude: 48.1374 },
  { name: "Köln", citycode: "50667", longitude: 6.9603, latitude: 50.9375 },
  { name: "Frankfurt am Main", citycode: "60311", longitude: 8.6821, latitude: 50.1109 },
  { name: "Stuttgart", citycode: "70173", longitude: 9.1829, latitude: 48.7758 },
  { name: "Düsseldorf", citycode: "40210", longitude: 6.7735, latitude: 51.2277 },
  { name: "Leipzig", citycode: "04103", longitude: 12.3731, latitude: 51.3397 },
  { name: "Dresden", citycode: "01067", longitude: 13.7372, latitude: 51.0504 },
  { name: "Hannover", citycode: "30159", longitude: 9.732, latitude: 52.3759 },
  { name: "Nürnberg", citycode: "90402", longitude: 11.0767, latitude: 49.4521 },
  { name: "Bremen", citycode: "28195", longitude: 8.8017, latitude: 53.0793 },
  { name: "Essen", citycode: "45127", longitude: 7.0116, latitude: 51.4556 },
  { name: "Dortmund", citycode: "44135", longitude: 7.4653, latitude: 51.5136 },
  { name: "Bonn", citycode: "53111", longitude: 7.0982, latitude: 50.7374 },
];

const STREET_NAMES = [
  "Hauptstraße",
  "Bahnhofstraße",
  "Marktplatz",
  "Kirchstraße",
  "Schulstraße",
  "Lindenstraße",
  "Gartenstraße",
  "Bergstraße",
  "Waldstraße",
  "Parkstraße",
  "Königstraße",
  "Rheinstraße",
  "Kaiserstraße",
  "Friedrichstraße",
  "Bismarckstraße",
];

const FIRST_NAMES = [
  "Michael",
  "Sarah",
  "Thomas",
  "Julia",
  "Andreas",
  "Laura",
  "Matthias",
  "Anna",
  "Christian",
  "Lisa",
  "Sebastian",
  "Maria",
  "Stefan",
  "Katharina",
  "Daniel",
  "Sophie",
  "Jan",
  "Emma",
  "Felix",
  "Hannah",
  "Lukas",
  "Lena",
  "Tobias",
  "Mia",
];

const LAST_NAMES = [
  "Müller",
  "Schmidt",
  "Schneider",
  "Fischer",
  "Weber",
  "Meyer",
  "Wagner",
  "Becker",
  "Schulz",
  "Hoffmann",
  "Schäfer",
  "Koch",
  "Bauer",
  "Richter",
  "Klein",
  "Wolf",
  "Schröder",
  "Neumann",
  "Schwarz",
  "Zimmermann",
  "Braun",
];

const PRACTICE_TYPES = [
  "Tierarztpraxis",
  "Tierklinik",
  "Tiermedizinisches Zentrum",
  "VetCenter",
  "Kleintierpraxis",
  "Tiergesundheitszentrum",
];

const PRACTICE_SUFFIXES = [
  "Mitte",
  "Nord",
  "Süd",
  "Ost",
  "West",
  "City",
  "Zentrum",
  "am Park",
  "am Stadtpark",
  "am Bahnhof",
];

function generateRandomCity(): City {
  return GERMAN_CITIES[Math.floor(Math.random() * GERMAN_CITIES.length)];
}

function generateRandomStreet(): string {
  const street = STREET_NAMES[Math.floor(Math.random() * STREET_NAMES.length)];
  const number = Math.floor(Math.random() * 200) + 1;
  return `${street} ${number}`;
}

function generateRandomEmail(prefix: string): string {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 10000);
  const sanitized = prefix
    .toLowerCase()
    .replace(/\s/g, "")
    .replace(/ä/g, "ae")
    .replace(/ö/g, "oe")
    .replace(/ü/g, "ue")
    .replace(/ß/g, "ss")
    .replace(/[^a-z0-9.-]/g, ""); // remove all non-ASCII chars
  return `${sanitized}-${timestamp}-${random}@example.de`;
}

function generateRandomPhone(): string {
  const areaCode = Math.floor(Math.random() * 900) + 100;
  const number = Math.floor(Math.random() * 9000000) + 1000000;
  return `+49 ${areaCode} ${number}`;
}

function generatePracticeName(city: string): string {
  const type = PRACTICE_TYPES[Math.floor(Math.random() * PRACTICE_TYPES.length)];
  const suffix =
    Math.random() > 0.5
      ? ` ${city}`
      : ` ${city} ${PRACTICE_SUFFIXES[Math.floor(Math.random() * PRACTICE_SUFFIXES.length)]}`;
  return `${type}${suffix}`;
}

function getRandomName(): { firstName: string; lastName: string } {
  return {
    firstName: FIRST_NAMES[Math.floor(Math.random() * FIRST_NAMES.length)],
    lastName: LAST_NAMES[Math.floor(Math.random() * LAST_NAMES.length)],
  };
}

function getRandomSex(): Sexes {
  const sexValues: Sexes[] = ["male", "female", "not_known"];
  return sexValues[Math.floor(Math.random() * sexValues.length)];
}

function getRandomDateOfBirth(minAge: number, maxAge: number): Date {
  const now = new Date();
  const age = Math.floor(Math.random() * (maxAge - minAge + 1)) + minAge;
  const birthYear = now.getFullYear() - age;
  const month = Math.floor(Math.random() * 12);
  const day = Math.floor(Math.random() * 28) + 1;
  return new Date(birthYear, month, day);
}

function getRandomSubset<T>(array: T[], min: number, max: number): T[] {
  const count = Math.floor(Math.random() * (max - min + 1)) + min;
  const shuffled = [...array].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.min(count, array.length));
}

function getRandomDateInLastMonths(months: number): Date {
  const now = new Date();
  const daysAgo = Math.floor(Math.random() * months * 30);
  const date = new Date(now);
  date.setDate(date.getDate() - daysAgo);
  return date;
}

// ============================
// MAIN SEEDING FUNCTION
// ============================

async function seedPractices() {
  console.log("🌱 Seeding veterinary practices...");

  try {
    const germany = await prisma.countries.findFirst({
      where: {
        name: "Deutschland"
      }
    });
    if (!germany) {
      throw new Error("Germany not found");
    }

    // ============================
    // Phase 1: Load existing data
    // ============================
    console.log("📋 Loading existing services and animal types...");

    const services = await prisma.service.findMany({
      select: { id: true },
    });

    const animalTypes = await prisma.animalType.findMany({
      select: { id: true },
    });

    if (services.length === 0 || animalTypes.length === 0) {
      console.log("❌ No services or animal types found. Run testdaten.sql first.");
      return;
    }

    console.log(`✓ Found ${services.length} services and ${animalTypes.length} animal types`);

    // ============================
    // Phase 2: Generate practices
    // ============================
    console.log("🏥 Creating 20-30 veterinary practices...");

    const practiceCount = Math.floor(Math.random() * 11) + 20; // 20-30
    const createdPractices: Array<{ id: number; city: string }> = [];

    for (let i = 0; i < practiceCount; i++) {
      const city = generateRandomCity();
      const practiceName = generatePracticeName(city.name);

      const practice = await prisma.veterinaryPractice.create({
        data: {
          name: practiceName,
          phone: generateRandomPhone(),
          infoEmail: generateRandomEmail(`info-${practiceName}`),
          email: generateRandomEmail(`kontakt-${practiceName}`),
          password: "VetPractice123!",
          website: Math.random() > 0.5 ? `https://www.${practiceName.toLowerCase().replace(/\s/g, "")}.de` : null,
          info: Math.random() > 0.5 ? "Moderne Tierarztpraxis mit umfassendem Leistungsspektrum." : null,
          address: {
            create: {
              street: generateRandomStreet(),
              cityCode: city.citycode,
              city: city.name,
              fk_country: germany.id,
              longitude: city.longitude + (Math.random() - 0.5) * 0.1,
              latitude: city.latitude + (Math.random() - 0.5) * 0.1,
            },
          },
        },
      });

      await prisma.veterinarypractices_has_confirmation_code.create({
        data: {
          code: "222222",
          dateofcreation: new Date(),
          verified: true,
          fk_veterinarypracticeid: practice.id
        }
      });

      createdPractices.push({ id: practice.id, city: city.name });
    }
    // add one more practice
    const practice = await prisma.veterinaryPractice.create({
        data: {
          name: "Katzentierarztpraxis",
          phone: generateRandomPhone(),
          infoEmail: "info@katzentierarztpraxis.de",
          email: "info@katzentierarztpraxis.de",
          password: "VetPractice123!",
          website: `https://www.katzentierarztpraxis.de`,
          info: "Moderne Tierarztpraxis mit umfassendem Leistungsspektrum fuer Katzen.",
          address: {
            create: {
              street: "Katzenstr. 10",
              cityCode: "12345",
              city: "Berlin",
              fk_country: germany.id,
              longitude: 0.0,
              latitude: 0.0,
            },
          },
        },
      });

      await prisma.veterinarypractices_has_confirmation_code.create({
        data: {
          code: "222222",
          dateofcreation: new Date(),
          verified: true,
          fk_veterinarypracticeid: practice.id
        }
      });

      createdPractices.push({ id: practice.id, city: "Berlin" });

    console.log(`✅ Created ${createdPractices.length} practices`);

    // ============================
    // Phase 3: Generate veterinarians
    // ============================
    console.log("👨‍⚕️ Creating veterinarians (2-5 per practice)...");

    const allVeterinarians: Array<{ id: number; practiceId: number; city: string }> = [];

    for (const practice of createdPractices) {
      const vetCount = Math.floor(Math.random() * 4) + 2; // 2-5 per practice

      for (let i = 0; i < vetCount; i++) {
        const name = getRandomName();
        const city = generateRandomCity();

        // Create person first
        const person = await prisma.person.create({
          data: {
            firstName: name.firstName,
            lastName: name.lastName,
            sex: getRandomSex(),
            dateOfBirth: getRandomDateOfBirth(25, 65),
            phone: generateRandomPhone(),
            email: generateRandomEmail(`${name.firstName}.${name.lastName}`),
            password: "Vet123!",
            address: {
              create: {
                street: generateRandomStreet(),
                cityCode: city.citycode,
                city: city.name,
                fk_country: germany.id,
                longitude: city.longitude + (Math.random() - 0.5) * 0.1,
                latitude: city.latitude + (Math.random() - 0.5) * 0.1,
              },
            },
          },
        });

        // Create veterinary with person id
        await prisma.veterinarian.create({
          data: {
            id: person.id,
            infoEmail: Math.random() > 0.5 ? generateRandomEmail(`dr.${name.lastName}`) : null,
            fk_veterinarypracticeid: practice.id,
          },
        });

        allVeterinarians.push({
          id: person.id,
          practiceId: practice.id,
          city: practice.city,
        });
      }
    }

    console.log(`✅ Created ${allVeterinarians.length} veterinarians`);

    // ============================
    // Phase 4: Junction tables
    // ============================
    console.log("🔗 Filling junction tables...");

    // veterinary_can_treat_animaltype
    const treatableTypes: Array<{ veterinaryId: number; animalTypeId: number }> = [];

    for (const vet of allVeterinarians) {
      const randomTypes = getRandomSubset(animalTypes, 1, 4);
      randomTypes.forEach((type) => {
        treatableTypes.push({
          veterinaryId: vet.id,
          animalTypeId: type.id,
        });
      });
    }

    await prisma.veterinaryCanTreatAnimalType.createMany({
      data: treatableTypes,
      skipDuplicates: true,
    });

    console.log(`✓ Added ${treatableTypes.length} animal type assignments`);

    // veterinary_has_service
    const vetServices: Array<{ veterinaryId: number; serviceId: number }> = [];

    for (const vet of allVeterinarians) {
      const randomServices = getRandomSubset(services, 2, 6);
      randomServices.forEach((service) => {
        vetServices.push({
          veterinaryId: vet.id,
          serviceId: service.id,
        });
      });
    }

    await prisma.veterinaryHasService.createMany({
      data: vetServices,
      skipDuplicates: true,
    });

    console.log(`✓ Added ${vetServices.length} service assignments`);

    // ============================
    // Summary
    // ============================
    console.log("\n✅ Seeding complete!");
    console.log(`   🏥 Practices: ${createdPractices.length}`);
    console.log(`   👨‍⚕️ veterinarians: ${allVeterinarians.length}`);
    console.log(`   🐾 Animal type assignments: ${treatableTypes.length}`);
    console.log(`   💉 Service assignments: ${vetServices.length}`);
  } catch (error) {
    console.error("❌ Error seeding practices:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

seedPractices();
