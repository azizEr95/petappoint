// WICHTIG: Zuerst den singleton importieren, damit das Mocking funktioniert
import { prismaMock } from "../../testConfig/singleton";
// Danach die Types importieren
import { persons, sexes } from "../../generated/prisma";
// Dann den Service importieren
import { personService } from "../../src/service/personService";

describe("personService", () => {
  // Test-Datenvorbereitung
  const mockPerson: persons = {
    id: 1,
    firstname: "Max",
    lastname: "Mustermann",
    sex: sexes.male,
    dateofbirth: new Date("1990-05-15"),
    fk_address: 1,
    phone: "015712345678",
    email: "max.mustermann@example.com",
    password: "hashedpassword123",
  };

  describe("create", () => {
    it("sollte eine neue Person erstellen", async () => {
      prismaMock.persons.create.mockResolvedValue(mockPerson);

      const result = await personService.create(mockPerson);

      expect(result).toEqual(mockPerson);
      expect(prismaMock.persons.create).toHaveBeenCalledWith({
        data: mockPerson,
      });
      expect(prismaMock.persons.create).toHaveBeenCalledTimes(1);
    });

    it("sollte einen Fehler werfen, wenn die Erstellung fehlschlägt", async () => {
      const error = new Error("Database error");
      prismaMock.persons.create.mockRejectedValue(error);

      await expect(personService.create(mockPerson)).rejects.toThrow("Database error");
    });
  });

  describe("getById", () => {
    it("sollte eine Person anhand der ID finden", async () => {
      prismaMock.persons.findUnique.mockResolvedValue(mockPerson);

      const result = await personService.getById(1);

      expect(result).toEqual(mockPerson);
      expect(prismaMock.persons.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
      });
    });

    it("sollte einen Fehler werfen, wenn die Person nicht gefunden wird", async () => {
      prismaMock.persons.findUnique.mockResolvedValue(null);

      await expect(personService.getById(999)).rejects.toThrow("Person not found with id: 999");
    });
  });

  describe("getByEmail", () => {
    it("sollte eine Person anhand der E-Mail finden", async () => {
      prismaMock.persons.findUnique.mockResolvedValue(mockPerson);

      const result = await personService.getByEmail("max.mustermann@example.com");

      expect(result).toEqual(mockPerson);
      expect(prismaMock.persons.findUnique).toHaveBeenCalledWith({
        where: { email: "max.mustermann@example.com" },
      });
    });

    it("sollte einen Fehler werfen, wenn keine Person mit der E-Mail gefunden wird", async () => {
      prismaMock.persons.findUnique.mockResolvedValue(null);

      await expect(personService.getByEmail("nichtexistent@example.com")).rejects.toThrow(
        "Person not found with the email nichtexistent@example.com"
      );
    });
  });

  describe("getAll", () => {
    it("sollte alle Personen finden", async () => {
      const mockPersons = [
        mockPerson,
        {
          id: 2,
          firstname: "Anna",
          lastname: "Schmidt",
          sex: sexes.female,
          dateofbirth: new Date("1985-08-20"),
          fk_address: 2,
          phone: "015798765432",
          email: "anna.schmidt@example.com",
          password: "hashedpassword456",
        },
        {
          id: 3,
          firstname: "Thomas",
          lastname: "Müller",
          sex: sexes.male,
          dateofbirth: new Date("1978-03-10"),
          fk_address: 3,
          phone: "015755555555",
          email: "thomas.mueller@example.com",
          password: "hashedpassword789",
        },
      ];

      prismaMock.persons.findMany.mockResolvedValue(mockPersons);

      const result = await personService.getAll();

      expect(result).toEqual(mockPersons);
      expect(prismaMock.persons.findMany).toHaveBeenCalledWith();
      expect(result.length).toBe(3);
    });

    it("sollte ein leeres Array zurückgeben, wenn keine Personen existieren", async () => {
      prismaMock.persons.findMany.mockResolvedValue([]);

      const result = await personService.getAll();

      expect(result).toEqual([]);
      expect(result.length).toBe(0);
    });
  });

  describe("update", () => {
    it("sollte eine Person aktualisieren", async () => {
      const updatedPerson = {
        ...mockPerson,
        firstname: "Maximilian",
        phone: "015799999999",
        email: "maximilian.mustermann@example.com",
      };

      prismaMock.persons.update.mockResolvedValue(updatedPerson);

      const result = await personService.update(updatedPerson);

      expect(result).toEqual(updatedPerson);
      expect(prismaMock.persons.update).toHaveBeenCalledWith({
        where: { id: updatedPerson.id },
        data: updatedPerson,
      });
    });

    it("sollte einen Fehler werfen, wenn keine ID für das Update angegeben wird", async () => {
      const personWithoutId = { ...mockPerson, id: undefined } as any;

      await expect(personService.update(personWithoutId)).rejects.toThrow("ID is required for update");
    });

    it("sollte einen Fehler werfen, wenn die zu aktualisierende Person nicht existiert", async () => {
      const error = new Error("Record to update not found");
      prismaMock.persons.update.mockRejectedValue(error);

      await expect(personService.update({ ...mockPerson, id: 999 })).rejects.toThrow("Record to update not found");
    });
  });

  describe("delete", () => {
    it("sollte eine Person löschen", async () => {
      prismaMock.persons.delete.mockResolvedValue(mockPerson);

      await personService.delete(1);

      expect(prismaMock.persons.delete).toHaveBeenCalledWith({
        where: { id: 1 },
      });
      expect(prismaMock.persons.delete).toHaveBeenCalledTimes(1);
    });

    it("sollte einen Fehler werfen, wenn die zu löschende Person nicht existiert", async () => {
      const error = new Error("Record to delete does not exist");
      prismaMock.persons.delete.mockRejectedValue(error);

      await expect(personService.delete(999)).rejects.toThrow("Record to delete does not exist");
    });
  });
});
