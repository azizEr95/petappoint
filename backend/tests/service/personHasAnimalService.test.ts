// WICHTIG: Zuerst den singleton importieren, damit das Mocking funktioniert
import { prismaMock } from "../../testConfig/singleton";
// Danach die Types importieren
import { person_has_animal, sexes } from "../../generated/prisma";
// Dann den Service importieren
import { personHasAnimalService } from "../../src/service/personHasAnimalService";

describe("personHasAnimalService", () => {
  // Test-Datenvorbereitung
  const mockPersonHasAnimal: person_has_animal = {
    fk_personid: 1,
    fk_animalid: 1,
  };

  const mockPersonHasAnimalWithRelations = {
    fk_personid: 1,
    fk_animalid: 1,
    animals: {
      id: 1,
      name: "Bello",
      dateofbirth: new Date("2020-05-15"),
      fk_animaltypeid: 1,
    },
    persons: {
      id: 1,
      firstname: "Max",
      lastname: "Mustermann",
      sex: sexes.male,
      dateofbirth: new Date("1990-05-15"),
      fk_address: 1,
      phone: "015712345678",
      email: "max.mustermann@example.com",
      password: "hashedpassword123",
    },
  };

  describe("create", () => {
    it("sollte eine neue Person-Tier-Verbindung erstellen", async () => {
      prismaMock.person_has_animal.create.mockResolvedValue(mockPersonHasAnimal);

      const result = await personHasAnimalService.create(mockPersonHasAnimal);

      expect(result).toEqual(mockPersonHasAnimal);
      expect(prismaMock.person_has_animal.create).toHaveBeenCalledWith({
        data: mockPersonHasAnimal,
      });
      expect(prismaMock.person_has_animal.create).toHaveBeenCalledTimes(1);
    });

    it("sollte einen Fehler werfen, wenn die Erstellung fehlschlägt", async () => {
      const error = new Error("Database error");
      prismaMock.person_has_animal.create.mockRejectedValue(error);

      await expect(personHasAnimalService.create(mockPersonHasAnimal)).rejects.toThrow("Database error");
    });
  });

  describe("getAnimalsByPersonId", () => {
    it("sollte alle Tiere einer Person finden", async () => {
      const mockPersonAnimals = [
        mockPersonHasAnimalWithRelations,
        {
          fk_personid: 1,
          fk_animalid: 2,
          animals: {
            id: 2,
            name: "Mieze",
            dateofbirth: new Date("2021-03-20"),
            fk_animaltypeid: 2,
          },
          persons: {
            id: 1,
            firstname: "Max",
            lastname: "Mustermann",
            sex: sexes.male,
            dateofbirth: new Date("1990-05-15"),
            fk_address: 1,
            phone: "015712345678",
            email: "max.mustermann@example.com",
            password: "hashedpassword123",
          },
        },
      ];

      prismaMock.person_has_animal.findMany.mockResolvedValue(mockPersonAnimals as any);

      const result = await personHasAnimalService.getAnimalsByPersonId(1);

      expect(result).toEqual([
        {
          animal: mockPersonAnimals[0].animals,
          person: mockPersonAnimals[0].persons,
        },
        {
          animal: mockPersonAnimals[1].animals,
          person: mockPersonAnimals[1].persons,
        },
      ]);
      expect(prismaMock.person_has_animal.findMany).toHaveBeenCalledWith({
        where: { fk_personid: 1 },
        include: {
          animals: true,
          persons: true,
        },
      });
    });

    it("sollte ein leeres Array zurückgeben, wenn die Person keine Tiere hat", async () => {
      prismaMock.person_has_animal.findMany.mockResolvedValue([]);

      const result = await personHasAnimalService.getAnimalsByPersonId(999);

      expect(result).toEqual([]);
      expect(result.length).toBe(0);
    });
  });

  describe("getPersonsByAnimalId", () => {
    it("sollte alle Personen finden, die ein bestimmtes Tier besitzen", async () => {
      const mockAnimalPersons = [
        mockPersonHasAnimalWithRelations,
        {
          fk_personid: 2,
          fk_animalid: 1,
          animals: {
            id: 1,
            name: "Bello",
            dateofbirth: new Date("2020-05-15"),
            fk_animaltypeid: 1,
          },
          persons: {
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
        },
      ];

      prismaMock.person_has_animal.findMany.mockResolvedValue(mockAnimalPersons as any);

      const result = await personHasAnimalService.getPersonsByAnimalId(1);

      expect(result).toEqual([
        {
          animal: mockAnimalPersons[0].animals,
          person: mockAnimalPersons[0].persons,
        },
        {
          animal: mockAnimalPersons[1].animals,
          person: mockAnimalPersons[1].persons,
        },
      ]);
      expect(prismaMock.person_has_animal.findMany).toHaveBeenCalledWith({
        where: { fk_animalid: 1 },
        include: {
          animals: true,
          persons: true,
        },
      });
    });

    it("sollte ein leeres Array zurückgeben, wenn das Tier keine Besitzer hat", async () => {
      prismaMock.person_has_animal.findMany.mockResolvedValue([]);

      const result = await personHasAnimalService.getPersonsByAnimalId(999);

      expect(result).toEqual([]);
      expect(result.length).toBe(0);
    });
  });

  describe("delete", () => {
    it("sollte eine Person-Tier-Verbindung löschen", async () => {
      prismaMock.person_has_animal.delete.mockResolvedValue(mockPersonHasAnimal);

      await personHasAnimalService.delete(mockPersonHasAnimal);

      expect(prismaMock.person_has_animal.delete).toHaveBeenCalledWith({
        where: {
          fk_personid_fk_animalid: {
            fk_personid: mockPersonHasAnimal.fk_personid,
            fk_animalid: mockPersonHasAnimal.fk_animalid,
          },
        },
      });
      expect(prismaMock.person_has_animal.delete).toHaveBeenCalledTimes(1);
    });

    it("sollte einen Fehler werfen, wenn die zu löschende Verbindung nicht existiert", async () => {
      const error = new Error("Record to delete does not exist");
      prismaMock.person_has_animal.delete.mockRejectedValue(error);

      const nonExistentRelation: person_has_animal = {
        fk_personid: 999,
        fk_animalid: 999,
      };

      await expect(personHasAnimalService.delete(nonExistentRelation)).rejects.toThrow(
        "Record to delete does not exist"
      );
    });
  });

  describe("exists", () => {
    it("sollte true zurückgeben, wenn die Verbindung existiert", async () => {
      prismaMock.person_has_animal.findUnique.mockResolvedValue(mockPersonHasAnimal);

      const result = await personHasAnimalService.exists(mockPersonHasAnimal);

      expect(result).toBe(true);
      expect(prismaMock.person_has_animal.findUnique).toHaveBeenCalledWith({
        where: {
          fk_personid_fk_animalid: {
            fk_personid: mockPersonHasAnimal.fk_personid,
            fk_animalid: mockPersonHasAnimal.fk_animalid,
          },
        },
      });
    });

    it("sollte false zurückgeben, wenn die Verbindung nicht existiert", async () => {
      prismaMock.person_has_animal.findUnique.mockResolvedValue(null);

      const nonExistentRelation: person_has_animal = {
        fk_personid: 999,
        fk_animalid: 999,
      };

      const result = await personHasAnimalService.exists(nonExistentRelation);

      expect(result).toBe(false);
    });
  });
});
