import { prisma } from "../../testConfig/integrationConfig";
import { sexes } from "../../generated/prisma";
import { personService } from "../../src/service/personService";

describe("personService", () => {
  let addressId: number;

  beforeEach(async () => {
    const address = await prisma.addresses.create({
      data: {
        street: "Teststraße 1",
        citycode: "12345",
        city: "Berlin",
        country: "Germany",
        longitude: 0.0,
        latitude: 0.0,
      },
    });
    addressId = address.id;
  });

  const getPersonData = () => ({
    firstname: "Max",
    lastname: "Mustermann",
    sex: sexes.male,
    dateofbirth: new Date("1990-05-15"),
    fk_address: addressId,
    phone: "015712345678",
    email: `max.mustermann.${Date.now()}@example.com`,
    password: "plainpassword123",
  });

  describe("create", () => {
    it("sollte eine neue Person erstellen", async () => {
      const result = await personService.create(getPersonData());

      expect(result.firstname).toBe("Max");
      expect(result.fk_address).toBe(addressId);
      expect(result.password).not.toBe("plainpassword123"); // Should be hashed

      const dbPerson = await prisma.persons.findUnique({ where: { id: result.id } });
      expect(dbPerson).not.toBeNull();
      expect(dbPerson?.firstname).toBe("Max");
    });

    it("sollte einen Fehler werfen, wenn die Erstellung fehlschlägt", async () => {
      const invalidData = { ...getPersonData(), email: null } as any;

      await expect(personService.create(invalidData)).rejects.toThrow();
    });
  });

  describe("getById", () => {
    it("sollte eine Person anhand der ID finden", async () => {
      const created = await prisma.persons.create({ data: getPersonData() });

      const result = await personService.getById(created.id);

      expect(result.id).toBe(created.id);
      expect(result.firstname).toBe("Max");
    });

    it("sollte einen Fehler werfen, wenn die Person nicht gefunden wird", async () => {
      await expect(personService.getById(999999)).rejects.toThrow("Person not found with id: 999999");
    });
  });

  describe("getByEmail", () => {
    it("sollte eine Person anhand der E-Mail finden", async () => {
      const personData = getPersonData();
      await prisma.persons.create({ data: personData });

      const result = await personService.getByEmail(personData.email);

      expect(result.email).toBe(personData.email);
      expect(result.firstname).toBe("Max");
    });

    it("sollte einen Fehler werfen, wenn keine Person mit der E-Mail gefunden wird", async () => {
      await expect(personService.getByEmail("nichtexistent@example.com")).rejects.toThrow(
        "Person not found with the email nichtexistent@example.com"
      );
    });
  });

  describe("getAll", () => {
    it("sollte alle Personen finden", async () => {
      await prisma.persons.create({ data: getPersonData() });
      await prisma.persons.create({
        data: {
          ...getPersonData(),
          firstname: "Anna",
          lastname: "Schmidt",
          sex: sexes.female,
          email: `anna.schmidt.${Date.now()}@example.com`,
        },
      });

      const result = await personService.getAll();

      expect(result.length).toBeGreaterThanOrEqual(2);
      expect(result.some(p => p.firstname === "Max")).toBe(true);
      expect(result.some(p => p.firstname === "Anna")).toBe(true);
    });

    it("sollte ein leeres Array zurückgeben, wenn keine Personen existieren", async () => {
      const result = await personService.getAll();

      expect(result).toEqual([]);
      expect(result.length).toBe(0);
    });
  });

  describe("update", () => {
    it("sollte eine Person aktualisieren", async () => {
      const created = await prisma.persons.create({ data: getPersonData() });
      const updatedData = {
        ...created,
        firstname: "Maximilian",
        phone: "015799999999",
      };

      const result = await personService.update(updatedData);

      expect(result.firstname).toBe("Maximilian");
      expect(result.phone).toBe("015799999999");

      const dbPerson = await prisma.persons.findUnique({ where: { id: created.id } });
      expect(dbPerson?.firstname).toBe("Maximilian");
    });

    it("sollte einen Fehler werfen, wenn keine ID für das Update angegeben wird", async () => {
      const personWithoutId = { ...getPersonData(), id: undefined } as any;

      await expect(personService.update(personWithoutId)).rejects.toThrow("ID is required for update");
    });

    it("sollte einen Fehler werfen, wenn die zu aktualisierende Person nicht existiert", async () => {
      const nonExistentPerson = { ...getPersonData(), id: 999999 };

      await expect(personService.update(nonExistentPerson)).rejects.toThrow();
    });
  });

  describe("delete", () => {
    it("sollte eine Person löschen", async () => {
      const created = await prisma.persons.create({ data: getPersonData() });

      await personService.delete(created.id);

      const dbPerson = await prisma.persons.findUnique({ where: { id: created.id } });
      expect(dbPerson).toBeNull();
    });

    it("sollte einen Fehler werfen, wenn die zu löschende Person nicht existiert", async () => {
      await expect(personService.delete(999999)).rejects.toThrow();
    });
  });
});
