// WICHTIG: Zuerst den singleton importieren, damit das Mocking funktioniert
import { prismaMock } from "../../testConfig/mockConfig";
// Danach die Types importieren
import { medications } from "../../generated/prisma";
// Dann den Service importieren
import { medicationService } from "../../src/service/medicationsService";

describe("medicationService", () => {
  // Test-Datenvorbereitung
  const mockMedication: medications = {
    id: 1,
    name: "Amoxicillin",
  };

  describe("create", () => {
    it("sollte ein neues Medikament erstellen", async () => {
      prismaMock.medications.create.mockResolvedValue(mockMedication);

      const result = await medicationService.create(mockMedication);

      expect(result).toEqual(mockMedication);
      expect(prismaMock.medications.create).toHaveBeenCalledWith({
        data: mockMedication,
      });
      expect(prismaMock.medications.create).toHaveBeenCalledTimes(1);
    });

    it("sollte einen Fehler werfen, wenn die Erstellung fehlschlägt", async () => {
      const error = new Error("Database error");
      prismaMock.medications.create.mockRejectedValue(error);

      await expect(medicationService.create(mockMedication)).rejects.toThrow("Database error");
    });
  });

  describe("getById", () => {
    it("sollte ein Medikament anhand der ID finden", async () => {
      prismaMock.medications.findUnique.mockResolvedValue(mockMedication);

      const result = await medicationService.getById(1);

      expect(result).toEqual(mockMedication);
      expect(prismaMock.medications.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
      });
    });

    it("sollte einen Fehler werfen, wenn das Medikament nicht gefunden wird", async () => {
      prismaMock.medications.findUnique.mockResolvedValue(null);

      await expect(medicationService.getById(999)).rejects.toThrow("Medication with id 999 does not exist");
    });
  });

  describe("getAll", () => {
    it("sollte alle Medikamente finden", async () => {
      const mockMedications = [
        mockMedication,
        {
          id: 2,
          name: "Metacam",
        },
        {
          id: 3,
          name: "Frontline",
        },
        {
          id: 4,
          name: "Prednison",
        },
      ];

      prismaMock.medications.findMany.mockResolvedValue(mockMedications);

      const result = await medicationService.getAll();

      expect(result).toEqual(mockMedications);
      expect(prismaMock.medications.findMany).toHaveBeenCalledWith();
      expect(result.length).toBe(4);
    });

    it("sollte ein leeres Array zurückgeben, wenn keine Medikamente existieren", async () => {
      prismaMock.medications.findMany.mockResolvedValue([]);

      const result = await medicationService.getAll();

      expect(result).toEqual([]);
      expect(result.length).toBe(0);
    });
  });

  describe("update", () => {
    it("sollte ein Medikament aktualisieren", async () => {
      const updatedMedication = {
        ...mockMedication,
        name: "Amoxicillin 500mg",
      };

      prismaMock.medications.update.mockResolvedValue(updatedMedication);

      const result = await medicationService.update(updatedMedication);

      expect(result).toEqual(updatedMedication);
      expect(prismaMock.medications.update).toHaveBeenCalledWith({
        where: { id: updatedMedication.id },
        data: updatedMedication,
      });
    });

    it("sollte einen Fehler werfen, wenn keine ID für das Update angegeben wird", async () => {
      const medicationWithoutId = { ...mockMedication, id: undefined } as any;

      await expect(medicationService.update(medicationWithoutId)).rejects.toThrow("ID is required for update");
    });

    it("sollte einen Fehler werfen, wenn das zu aktualisierende Medikament nicht existiert", async () => {
      const error = new Error("Record to update not found");
      prismaMock.medications.update.mockRejectedValue(error);

      await expect(medicationService.update({ ...mockMedication, id: 999 })).rejects.toThrow(
        "Record to update not found"
      );
    });
  });

  describe("delete", () => {
    it("sollte ein Medikament löschen", async () => {
      prismaMock.medications.delete.mockResolvedValue(mockMedication);

      await medicationService.delete(1);

      expect(prismaMock.medications.delete).toHaveBeenCalledWith({
        where: { id: 1 },
      });
      expect(prismaMock.medications.delete).toHaveBeenCalledTimes(1);
    });

    it("sollte einen Fehler werfen, wenn das zu löschende Medikament nicht existiert", async () => {
      const error = new Error("Record to delete does not exist");
      prismaMock.medications.delete.mockRejectedValue(error);

      await expect(medicationService.delete(999)).rejects.toThrow("Record to delete does not exist");
    });
  });
});
