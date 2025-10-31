// WICHTIG: Zuerst den singleton importieren, damit das Mocking funktioniert
import { prismaMock } from "../../testConfig/singleton";
// Danach die Types importieren
import { animalgroup } from "../../generated/prisma";
// Dann den Service importieren
import { animalGroupService } from "../../src/service/animalGroupService";

describe("animalGroupService", () => {
  // Test-Datenvorbereitung
  const mockAnimalGroup: animalgroup = {
    id: 1,
    name: "Haustiere",
  };

  describe("create", () => {
    it("sollte eine neue Tiergruppe erstellen", async () => {
      prismaMock.animalgroup.create.mockResolvedValue(mockAnimalGroup);

      const result = await animalGroupService.create(mockAnimalGroup);

      expect(result).toEqual(mockAnimalGroup);
      expect(prismaMock.animalgroup.create).toHaveBeenCalledWith({
        data: mockAnimalGroup,
      });
      expect(prismaMock.animalgroup.create).toHaveBeenCalledTimes(1);
    });

    it("sollte einen Fehler werfen, wenn die Erstellung fehlschlägt", async () => {
      const error = new Error("Database error");
      prismaMock.animalgroup.create.mockRejectedValue(error);

      await expect(animalGroupService.create(mockAnimalGroup)).rejects.toThrow("Database error");
    });
  });

  describe("getById", () => {
    it("sollte eine Tiergruppe anhand der ID finden", async () => {
      prismaMock.animalgroup.findUnique.mockResolvedValue(mockAnimalGroup);

      const result = await animalGroupService.getById(1);

      expect(result).toEqual(mockAnimalGroup);
      expect(prismaMock.animalgroup.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
      });
    });

    it("sollte einen Fehler werfen, wenn die Tiergruppe nicht gefunden wird", async () => {
      prismaMock.animalgroup.findUnique.mockResolvedValue(null);

      await expect(animalGroupService.getById(999)).rejects.toThrow("Animal group with ID 999 does not exist");
    });
  });

  describe("getAll", () => {
    it("sollte alle Tiergruppen finden", async () => {
      const mockAnimalGroups = [
        mockAnimalGroup,
        {
          id: 2,
          name: "Nutztiere",
        },
        {
          id: 3,
          name: "Wildtiere",
        },
      ];

      prismaMock.animalgroup.findMany.mockResolvedValue(mockAnimalGroups);

      const result = await animalGroupService.getAll();

      expect(result).toEqual(mockAnimalGroups);
      expect(prismaMock.animalgroup.findMany).toHaveBeenCalledWith();
      expect(result.length).toBe(3);
    });

    it("sollte ein leeres Array zurückgeben, wenn keine Tiergruppen existieren", async () => {
      prismaMock.animalgroup.findMany.mockResolvedValue([]);

      const result = await animalGroupService.getAll();

      expect(result).toEqual([]);
      expect(result.length).toBe(0);
    });
  });

  describe("update", () => {
    it("sollte eine Tiergruppe aktualisieren", async () => {
      const updatedAnimalGroup = {
        ...mockAnimalGroup,
        name: "Heimtiere",
      };

      prismaMock.animalgroup.update.mockResolvedValue(updatedAnimalGroup);

      const result = await animalGroupService.update(updatedAnimalGroup);

      expect(result).toEqual(updatedAnimalGroup);
      expect(prismaMock.animalgroup.update).toHaveBeenCalledWith({
        where: { id: updatedAnimalGroup.id },
        data: updatedAnimalGroup,
      });
    });

    it("sollte einen Fehler werfen, wenn keine ID für das Update angegeben wird", async () => {
      const groupWithoutId = { ...mockAnimalGroup, id: undefined } as any;

      await expect(animalGroupService.update(groupWithoutId)).rejects.toThrow("ID is required for update");
    });

    it("sollte einen Fehler werfen, wenn die zu aktualisierende Tiergruppe nicht existiert", async () => {
      const error = new Error("Record to update not found");
      prismaMock.animalgroup.update.mockRejectedValue(error);

      await expect(animalGroupService.update({ ...mockAnimalGroup, id: 999 })).rejects.toThrow(
        "Record to update not found"
      );
    });
  });

  describe("delete", () => {
    it("sollte eine Tiergruppe löschen", async () => {
      prismaMock.animalgroup.delete.mockResolvedValue(mockAnimalGroup);

      await animalGroupService.delete(1);

      expect(prismaMock.animalgroup.delete).toHaveBeenCalledWith({
        where: { id: 1 },
      });
      expect(prismaMock.animalgroup.delete).toHaveBeenCalledTimes(1);
    });

    it("sollte einen Fehler werfen, wenn die zu löschende Tiergruppe nicht existiert", async () => {
      const error = new Error("Record to delete does not exist");
      prismaMock.animalgroup.delete.mockRejectedValue(error);

      await expect(animalGroupService.delete(999)).rejects.toThrow("Record to delete does not exist");
    });
  });
});
