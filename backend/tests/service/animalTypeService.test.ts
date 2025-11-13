// WICHTIG: Zuerst den singleton importieren, damit das Mocking funktioniert
import { prismaMock } from "../../testConfig/mockConfig";
// Danach die Types importieren
import { animaltypes } from "../../generated/prisma";
// Dann den Service importieren
import { animalTypeService } from "../../src/service/animalTypeService";

describe("animalTypeService", () => {
  // Test-Datenvorbereitung
  const mockAnimalType: animaltypes = {
    id: 1,
    name: "Hund",
  };

  describe("create", () => {
    it("sollte einen neuen Tiertyp erstellen", async () => {
      prismaMock.animaltypes.create.mockResolvedValue(mockAnimalType);

      const result = await animalTypeService.create(mockAnimalType);

      expect(result).toEqual(mockAnimalType);
      expect(prismaMock.animaltypes.create).toHaveBeenCalledWith({
        data: mockAnimalType,
      });
      expect(prismaMock.animaltypes.create).toHaveBeenCalledTimes(1);
    });

    it("sollte einen Fehler werfen, wenn die Erstellung fehlschlägt", async () => {
      const error = new Error("Database error");
      prismaMock.animaltypes.create.mockRejectedValue(error);

      await expect(animalTypeService.create(mockAnimalType)).rejects.toThrow("Database error");
    });
  });

  describe("getById", () => {
    it("sollte einen Tiertyp anhand der ID finden", async () => {
      prismaMock.animaltypes.findUnique.mockResolvedValue(mockAnimalType);

      const result = await animalTypeService.getById(1);

      expect(result).toEqual(mockAnimalType);
      expect(prismaMock.animaltypes.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
      });
    });

    it("sollte einen Fehler werfen, wenn der Tiertyp nicht gefunden wird", async () => {
      prismaMock.animaltypes.findUnique.mockResolvedValue(null);

      await expect(animalTypeService.getById(999)).rejects.toThrow("Animal Type not found with id: 999");
    });
  });

  describe("getByName", () => {
    it("sollte einen Tiertyp anhand des Namens finden", async () => {
      prismaMock.animals.findFirst.mockResolvedValue(mockAnimalType as any);

      const result = await animalTypeService.getByName("Hund");

      expect(result).toEqual(mockAnimalType);
      expect(prismaMock.animals.findFirst).toHaveBeenCalledWith({
        where: { name: "Hund" },
      });
    });

    it("sollte einen Fehler werfen, wenn kein Tiertyp mit dem Namen gefunden wird", async () => {
      prismaMock.animals.findFirst.mockResolvedValue(null);

      await expect(animalTypeService.getByName("Nichtexistent")).rejects.toThrow(
        "Animal Type not found with name: Nichtexistent"
      );
    });
  });

  describe("getAll", () => {
    it("sollte alle Tiertypen finden", async () => {
      const mockAnimalTypes = [
        mockAnimalType,
        {
          id: 2,
          name: "Katze",
        },
        {
          id: 3,
          name: "Hase",
        },
      ];

      prismaMock.animaltypes.findMany.mockResolvedValue(mockAnimalTypes);

      const result = await animalTypeService.getAll();

      expect(result).toEqual(mockAnimalTypes);
      expect(prismaMock.animaltypes.findMany).toHaveBeenCalledWith();
      expect(result.length).toBe(3);
    });

    it("sollte ein leeres Array zurückgeben, wenn keine Tiertypen existieren", async () => {
      prismaMock.animaltypes.findMany.mockResolvedValue([]);

      const result = await animalTypeService.getAll();

      expect(result).toEqual([]);
      expect(result.length).toBe(0);
    });
  });

  describe("update", () => {
    it("sollte einen Tiertyp aktualisieren", async () => {
      const updatedAnimalType = {
        ...mockAnimalType,
        name: "Hundeartiger",
      };

      prismaMock.animaltypes.update.mockResolvedValue(updatedAnimalType);

      const result = await animalTypeService.update(updatedAnimalType);

      expect(result).toEqual(updatedAnimalType);
      expect(prismaMock.animaltypes.update).toHaveBeenCalledWith({
        where: { id: updatedAnimalType.id },
        data: updatedAnimalType.name,
      });
    });

    it("sollte einen Fehler werfen, wenn keine ID für das Update angegeben wird", async () => {
      const typeWithoutId = { ...mockAnimalType, id: undefined } as any;

      await expect(animalTypeService.update(typeWithoutId)).rejects.toThrow("ID is required for update");
    });

    it("sollte einen Fehler werfen, wenn der zu aktualisierende Tiertyp nicht existiert", async () => {
      const error = new Error("Record to update not found");
      prismaMock.animaltypes.update.mockRejectedValue(error);

      await expect(animalTypeService.update({ ...mockAnimalType, id: 999 })).rejects.toThrow(
        "Record to update not found"
      );
    });
  });

  describe("delete", () => {
    it("sollte einen Tiertyp löschen", async () => {
      prismaMock.animaltypes.delete.mockResolvedValue(mockAnimalType);

      await animalTypeService.delete(1);

      expect(prismaMock.animaltypes.delete).toHaveBeenCalledWith({
        where: { id: 1 },
      });
      expect(prismaMock.animaltypes.delete).toHaveBeenCalledTimes(1);
    });

    it("sollte einen Fehler werfen, wenn der zu löschende Tiertyp nicht existiert", async () => {
      const error = new Error("Record to delete does not exist");
      prismaMock.animaltypes.delete.mockRejectedValue(error);

      await expect(animalTypeService.delete(999)).rejects.toThrow("Record to delete does not exist");
    });
  });
});
