import { sexes } from "../generated/prisma";
import { prisma } from "../testConfig/integrationConfig";

test("should create address and person", async () => {
  const createdAddress = await prisma.addresses.create({
    data: {
      street: "Lesser-Ury-Weg 27",
      citycode: "10557",
      city: "Berlin",
      country: "Germany",
      latitude: 0.0,
      longitude: 0.0,
    },
  });

  expect(createdAddress.street).toBe("Lesser-Ury-Weg 27");

  const createdPerson = await prisma.persons.create({
    data: {
      firstname: "Aziz",
      lastname: "Erol",
      sex: sexes.male,
      dateofbirth: new Date("December 17, 1995 03:24:00"),
      phone: "015759712682",
      email: "beba3606@bht-berlin.de",
      password: "123",
      fk_address: createdAddress.id,
    },
  });

  expect(createdPerson.firstname).toBe("Aziz");
  expect(createdPerson.fk_address).toBe(createdAddress.id);
});

test("should find person by id", async () => {
  const address = await prisma.addresses.create({
    data: {
      street: "Test Street",
      citycode: "12345",
      city: "Berlin",
      country: "Germany",
      latitude: 0.0,
      longitude: 0.0,
    },
  });

  const createdPerson = await prisma.persons.create({
    data: {
      firstname: "Aziz",
      lastname: "Erol",
      sex: sexes.male,
      dateofbirth: new Date("December 17, 1995 03:24:00"),
      phone: "015759712682",
      email: "test@bht-berlin.de",
      password: "123",
      fk_address: address.id,
    },
  });

  const persons = await prisma.persons.findMany({
    where: { id: createdPerson.id },
  });

  expect(persons.length).toBe(1);
  expect(persons[0].firstname).toBe("Aziz");
});

test("should delete person by id", async () => {
  const address = await prisma.addresses.create({
    data: {
      street: "Delete Street",
      citycode: "54321",
      city: "Berlin",
      country: "Germany",
      latitude: 0.0,
      longitude: 0.0,
    },
  });

  const createdPerson = await prisma.persons.create({
    data: {
      firstname: "Aziz",
      lastname: "Erol",
      sex: sexes.male,
      dateofbirth: new Date("December 17, 1995 03:24:00"),
      phone: "015759712682",
      email: "delete@bht-berlin.de",
      password: "123",
      fk_address: address.id,
    },
  });

  const deletedPerson = await prisma.persons.delete({
    where: { id: createdPerson.id },
  });

  expect(deletedPerson.id).toBe(createdPerson.id);

  const found = await prisma.persons.findUnique({ where: { id: createdPerson.id } });
  expect(found).toBeNull();
});

test("should find all tieraerzte", async () => {
  const address = await prisma.addresses.create({
    data: {
      street: "Vet Street",
      citycode: "11111",
      city: "Berlin",
      country: "Germany",
      latitude: 0.0,
      longitude: 0.0,
    },
  });

  const practice = await prisma.veterinarypractices.create({
    data: {
      name: "Test Practice",
      phone: "030123456",
      infoemail: "info@practice.de",
      email: "practice@test.de",
      password: "hashedpass",
      website: "www.practice.de",
      info: "Test info",
      fk_addressid: address.id,
    },
  });

  await prisma.veterinarians.create({
    data: {
      infoemail: "dr.mueller@tierarzt.de",
      fk_veterinarypractice: practice.id,
    },
  });

  const tierAerzte = await prisma.veterinarians.findMany();

  expect(tierAerzte.length).toBeGreaterThanOrEqual(1);
  expect(tierAerzte.some(v => v.infoemail === "dr.mueller@tierarzt.de")).toBe(true);
});

test("should create tierarztpraxis", async () => {
  const address = await prisma.addresses.create({
    data: {
      street: "Practice Street",
      citycode: "22222",
      city: "Berlin",
      country: "Germany",
      latitude: 0.0,
      longitude: 0.0,
    },
  });

  const tierarztpraxis = await prisma.veterinarypractices.create({
    data: {
      name: "Tierarztpraxis Mitte",
      phone: "030123456",
      infoemail: "info@praxis.de",
      email: "kontakt@praxis.de",
      password: "hashedpassword",
      website: "www.praxis.de",
      info: "Beste Praxis in Berlin",
      fk_addressid: address.id,
    },
  });

  expect(tierarztpraxis.name).toBe("Tierarztpraxis Mitte");
  expect(tierarztpraxis.fk_addressid).toBe(address.id);
});

test("should create tier", async () => {
  const animalType = await prisma.animaltypes.create({
    data: { name: "Hund" },
  });

  const tier = await prisma.animals.create({
    data: {
      name: "Bello",
      dateofbirth: new Date("2020-05-15"),
      fk_animaltypeid: animalType.id,
    },
  });

  expect(tier.name).toBe("Bello");
  expect(tier.fk_animaltypeid).toBe(animalType.id);
});
