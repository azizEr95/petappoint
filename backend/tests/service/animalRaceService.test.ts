// WICHTIG: Zuerst den singleton importieren, damit das Mocking funktioniert
import { prismaMock } from "../../testConfig/singleton";
// Danach die Types importieren
import { animalraces } from "../../generated/prisma";
// Dann den Service importieren
import { animalRaceService } from "../../src/service/animalRaceService";

describe("animalRaceService", () => {
  // Test-Datenvorbereitung
  const mockAnimalRace: animalraces = {
    id: 1,
    name: "Golden Retriever",
    fk_animaltypeid: 1,
  };

  describe("create", () => {
    it("sollte eine neue Tierrasse erstellen", async () => {
      prismaMock.animalraces.create.mockResolvedValue(mockAnimalRace);

      const result = await animalRaceService.create(mockAnimalRace);

      expect(result).toEqual(mockAnimalRace);
      expect(prismaMock.animalraces.create).toHaveBeenCalledWith({
        data: {
          name: mockAnimalRace.name,
          animaltypes: { connect: { id: mockAnimalRace.fk_animaltypeid } },
        },
      });
      expect(prismaMock.animalraces.create).toHaveBeenCalledTimes(1);
    });

    it("sollte einen Fehler werfen, wenn die Erstellung fehlschlägt", async () => {
      const error = new Error("Database error");
      prismaMock.animalraces.create.mockRejectedValue(error);

      await expect(animalRaceService.create(mockAnimalRace)).rejects.toThrow("Database error");
    });
  });

  describe("getById", () => {
    it("sollte eine Tierrasse anhand der ID finden", async () => {
      prismaMock.animalraces.findUnique.mockResolvedValue(mockAnimalRace);

      const result = await animalRaceService.getById(1);

      expect(result).toEqual(mockAnimalRace);
      expect(prismaMock.animalraces.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
      });
    });

    it("sollte einen Fehler werfen, wenn die Tierrasse nicht gefunden wird", async () => {
      prismaMock.animalraces.findUnique.mockResolvedValue(null);

      await expect(animalRaceService.getById(999)).rejects.toThrow("Animal Kind not found with id: 999");
    });
  });

  describe("getByName", () => {
    it("sollte eine Tierrasse anhand des Namens finden", async () => {
      prismaMock.animalraces.findFirst.mockResolvedValue(mockAnimalRace);

      const result = await animalRaceService.getByName("Golden Retriever");

      expect(result).toEqual(mockAnimalRace);
      expect(prismaMock.animalraces.findFirst).toHaveBeenCalledWith({
        where: { name: "Golden Retriever" },
      });
    });

    it("sollte einen Fehler werfen, wenn keine Tierrasse mit dem Namen gefunden wird", async () => {
      prismaMock.animalraces.findFirst.mockResolvedValue(null);

      await expect(animalRaceService.getByName("Nichtexistent")).rejects.toThrow(
        "Animal Race not found with name: Nichtexistent"
      );
    });
  });

  describe("getAll", () => {
    it("sollte alle Tierrassen finden", async () => {
      const mockAnimalRaces = [
        mockAnimalRace,
        {
          id: 2,
          name: "Labrador",
          fk_animaltypeid: 1,
        },
        {
          id: 3,
          name: "Perserkatze",
          fk_animaltypeid: 2,
        },
      ];

      prismaMock.animalraces.findMany.mockResolvedValue(mockAnimalRaces);

      const result = await animalRaceService.getAll();

      expect(result).toEqual(mockAnimalRaces);
      expect(prismaMock.animalraces.findMany).toHaveBeenCalledWith();
      expect(result.length).toBe(3);
    });

    it("sollte ein leeres Array zurückgeben, wenn keine Tierrassen existieren", async () => {
      prismaMock.animalraces.findMany.mockResolvedValue([]);

      const result = await animalRaceService.getAll();

      expect(result).toEqual([]);
      expect(result.length).toBe(0);
    });
  });

  describe("update", () => {
    it("sollte eine Tierrasse aktualisieren", async () => {
      const updatedAnimalRace = {
        ...mockAnimalRace,
        name: "Golden Retriever (Standard)",
      };

      prismaMock.animalraces.update.mockResolvedValue(updatedAnimalRace);

      const result = await animalRaceService.update(updatedAnimalRace);

      expect(result).toEqual(updatedAnimalRace);
      expect(prismaMock.animalraces.update).toHaveBeenCalledWith({
        where: { id: updatedAnimalRace.id },
        data: updatedAnimalRace,
      });
    });

    it("sollte einen Fehler werfen, wenn keine ID für das Update angegeben wird", async () => {
      const raceWithoutId = { ...mockAnimalRace, id: undefined } as any;

      await expect(animalRaceService.update(raceWithoutId)).rejects.toThrow("ID is required for update");
    });

    it("sollte einen Fehler werfen, wenn die zu aktualisierende Tierrasse nicht existiert", async () => {
      const error = new Error("Record to update not found");
      prismaMock.animalraces.update.mockRejectedValue(error);

      await expect(animalRaceService.update({ ...mockAnimalRace, id: 999 })).rejects.toThrow(
        "Record to update not found"
      );
    });
  });

  describe("delete", () => {
    it("sollte eine Tierrasse löschen", async () => {
      prismaMock.animalraces.delete.mockResolvedValue(mockAnimalRace);

      await animalRaceService.delete(1);

      expect(prismaMock.animalraces.delete).toHaveBeenCalledWith({
        where: { id: 1 },
      });
      expect(prismaMock.animalraces.delete).toHaveBeenCalledTimes(1);
    });

    it("sollte einen Fehler werfen, wenn die zu löschende Tierrasse nicht existiert", async () => {
      const error = new Error("Record to delete does not exist");
      prismaMock.animalraces.delete.mockRejectedValue(error);

      await expect(animalRaceService.delete(999)).rejects.toThrow("Record to delete does not exist");
    });
  });
});
