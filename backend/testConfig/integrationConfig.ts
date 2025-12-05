import { prisma } from "../src/singletonPC";

const tables = [
  'recipes', 'medications', 'animal_has_vaccination',
  'appointment_has_review', 'reviews', 'appointment_has_service',
  'appointments', 'veterinary_has_invitation', 'veterinarians',
  'veterinarypractices', 'person_has_animal', 'animal_has_races',
  'animals', 'vaccinations', 'services', 'animal_groups',
  'animal_races', 'animal_types', 'persons', 'addresses'
];

afterEach(async () => {
  await prisma.$executeRawUnsafe(
    `TRUNCATE ${tables.map(t => `"${t}"`).join(', ')} RESTART IDENTITY CASCADE`
  );
});

afterAll(async () => {
  await prisma.$disconnect();
});

export { prisma };
