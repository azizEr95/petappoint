// WICHTIG: Zuerst den singleton importieren, damit das Mocking funktioniert
import { prismaMock } from "../../testConfig/singleton";
// Danach die Types importieren
import { vaccinations } from "../../generated/prisma";
// Dann den Service importieren
import { vaccinationService } from "../../src/service/vaccinationsService";

describe("vaccinationService", () => {
  const mockVaccination: vaccinations = {
    id: 1,
    name: "Tollwut",
  };

  describe("create", () => {
    it("sollte eine neue Impfung erstellen", async () => {
      prismaMock.vaccinations.create.mockResolvedValue(mockVaccination);

      const result = await vaccinationService.create(mockVaccination);

      expect(result).toEqual(mockVaccination);
      expect(prismaMock.vaccinations.create).toHaveBeenCalledWith({
        data: mockVaccination,
      });
      expect(prismaMock.vaccinations.create).toHaveBeenCalledTimes(1);
    });

    it("sollte einen Fehler werfen, wenn die Erstellung fehlschlägt", async () => {
      const error = new Error("Database error");
      prismaMock.vaccinations.create.mockRejectedValue(error);

      await expect(vaccinationService.create(mockVaccination)).rejects.toThrow("Database error");
    });
  });

  describe("getById", () => {
    it("sollte eine Impfung anhand der ID finden", async () => {
      prismaMock.vaccinations.findUnique.mockResolvedValue(mockVaccination);

      const result = await vaccinationService.getById(1);

      expect(result).toEqual(mockVaccination);
      expect(prismaMock.vaccinations.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
      });
    });

    it("sollte einen Fehler werfen, wenn die Impfung nicht gefunden wird", async () => {
      prismaMock.vaccinations.findUnique.mockResolvedValue(null);

      await expect(vaccinationService.getById(999)).rejects.toThrow("Vaccination does not exist with id 999");
    });
  });

  describe("getAll", () => {
    it("sollte alle Impfungen finden", async () => {
      const mockVaccinations = [
        mockVaccination,
        {
          id: 2,
          name: "Staupe",
        },
        {
          id: 3,
          name: "Parvovirose",
        },
      ];

      prismaMock.vaccinations.findMany.mockResolvedValue(mockVaccinations);

      const result = await vaccinationService.getAll();

      expect(result).toEqual(mockVaccinations);
      expect(prismaMock.vaccinations.findMany).toHaveBeenCalledWith();
      expect(result.length).toBe(3);
    });

    it("sollte ein leeres Array zurückgeben, wenn keine Impfungen existieren", async () => {
      prismaMock.vaccinations.findMany.mockResolvedValue([]);

      const result = await vaccinationService.getAll();

      expect(result).toEqual([]);
      expect(result.length).toBe(0);
    });
  });

  describe("update", () => {
    it("sollte eine Impfung aktualisieren", async () => {
      const updatedVaccination = {
        ...mockVaccination,
        name: "Tollwut - Neu",
      };

      prismaMock.vaccinations.update.mockResolvedValue(updatedVaccination);

      const result = await vaccinationService.update(updatedVaccination);

      expect(result).toEqual(updatedVaccination);
      expect(prismaMock.vaccinations.update).toHaveBeenCalledWith({
        where: { id: updatedVaccination.id },
        data: updatedVaccination,
      });
    });

    it("sollte einen Fehler werfen, wenn keine ID für das Update angegeben wird", async () => {
      const vaccinationWithoutId = { ...mockVaccination, id: undefined } as any;

      await expect(vaccinationService.update(vaccinationWithoutId)).rejects.toThrow("ID is required for update");
    });

    it("sollte einen Fehler werfen, wenn die zu aktualisierende Impfung nicht existiert", async () => {
      const error = new Error("Record to update not found");
      prismaMock.vaccinations.update.mockRejectedValue(error);

      await expect(vaccinationService.update({ ...mockVaccination, id: 999 })).rejects.toThrow(
        "Record to update not found"
      );
    });
  });

  describe("delete", () => {
    it("sollte eine Impfung löschen", async () => {
      prismaMock.vaccinations.delete.mockResolvedValue(mockVaccination);

      await vaccinationService.delete(1);

      expect(prismaMock.vaccinations.delete).toHaveBeenCalledWith({
        where: { id: 1 },
      });
      expect(prismaMock.vaccinations.delete).toHaveBeenCalledTimes(1);
    });

    it("sollte einen Fehler werfen, wenn die zu löschende Impfung nicht existiert", async () => {
      const error = new Error("Record to delete does not exist");
      prismaMock.vaccinations.delete.mockRejectedValue(error);

      await expect(vaccinationService.delete(999)).rejects.toThrow("Record to delete does not exist");
    });
  });
});
