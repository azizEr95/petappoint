// WICHTIG: Zuerst den singleton importieren, damit das Mocking funktioniert
import { prismaMock } from "../../testConfig/mockConfig";
// Danach die Types importieren
import { specializations } from "../../generated/prisma";
// Dann den Service importieren
import { specializationService } from "../../src/service/specializationService";

describe("specializationService", () => {
  // Test-Datenvorbereitung
  const mockSpecialization: specializations = {
    id: 1,
    name: "Chirurgie",
  };

  const mockSpecializationWithRelations = {
    ...mockSpecialization,
    veterinary_has_specialization: [
      {
        fk_veterinaryid: 1,
        fk_specializationid: 1,
      },
      {
        fk_veterinaryid: 2,
        fk_specializationid: 1,
      },
    ],
  };

  describe("create", () => {
    it("sollte eine neue Spezialisierung erstellen", async () => {
      prismaMock.specializations.create.mockResolvedValue(mockSpecialization);

      const result = await specializationService.create(mockSpecialization);

      expect(result).toEqual(mockSpecialization);
      expect(prismaMock.specializations.create).toHaveBeenCalledWith({
        data: mockSpecialization,
      });
      expect(prismaMock.specializations.create).toHaveBeenCalledTimes(1);
    });

    it("sollte einen Fehler werfen, wenn die Erstellung fehlschlägt", async () => {
      const error = new Error("Database error");
      prismaMock.specializations.create.mockRejectedValue(error);

      await expect(specializationService.create(mockSpecialization)).rejects.toThrow("Database error");
    });
  });

  describe("getById", () => {
    it("sollte eine Spezialisierung anhand der ID finden", async () => {
      prismaMock.specializations.findUnique.mockResolvedValue(mockSpecialization);

      const result = await specializationService.getById(1);

      expect(result).toEqual(mockSpecialization);
      expect(prismaMock.specializations.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
      });
    });

    it("sollte einen Fehler werfen, wenn die Spezialisierung nicht gefunden wird", async () => {
      prismaMock.specializations.findUnique.mockResolvedValue(null);

      await expect(specializationService.getById(999)).rejects.toThrow("Specialization not found with id: 999");
    });
  });

  describe("getByName", () => {
    it("sollte eine Spezialisierung anhand des Namens finden", async () => {
      prismaMock.specializations.findFirst.mockResolvedValue(mockSpecialization);

      const result = await specializationService.getByName("Chirurgie");

      expect(result).toEqual(mockSpecialization);
      expect(prismaMock.specializations.findFirst).toHaveBeenCalledWith({
        where: { name: "Chirurgie" },
      });
    });

    it("sollte einen Fehler werfen, wenn keine Spezialisierung mit dem Namen gefunden wird", async () => {
      prismaMock.specializations.findFirst.mockResolvedValue(null);

      await expect(specializationService.getByName("NichtExistent")).rejects.toThrow(
        "Specialization not found with name: NichtExistent"
      );
    });
  });

  describe("getAll", () => {
    it("sollte alle Spezialisierungen mit Relationen finden", async () => {
      const mockSpecializations = [
        mockSpecializationWithRelations,
        {
          id: 2,
          name: "Orthopädie",
          veterinary_has_specialization: [
            {
              fk_veterinaryid: 3,
              fk_specializationid: 2,
            },
          ],
        },
      ];

      prismaMock.specializations.findMany.mockResolvedValue(mockSpecializations as any);

      const result = await specializationService.getAll();

      expect(result).toEqual(mockSpecializations);
      expect(prismaMock.specializations.findMany).toHaveBeenCalledWith({
        include: {
          veterinary_has_specialization: true,
        },
      });
      expect(result.length).toBe(2);
    });

    it("sollte ein leeres Array zurückgeben, wenn keine Spezialisierungen existieren", async () => {
      prismaMock.specializations.findMany.mockResolvedValue([]);

      const result = await specializationService.getAll();

      expect(result).toEqual([]);
      expect(result.length).toBe(0);
    });
  });

  describe("update", () => {
    it("sollte eine Spezialisierung aktualisieren", async () => {
      const updatedSpecialization = {
        ...mockSpecialization,
        name: "Chirurgie - Erweitert",
      };

      prismaMock.specializations.update.mockResolvedValue(updatedSpecialization);

      const result = await specializationService.update(updatedSpecialization);

      expect(result).toEqual(updatedSpecialization);
      expect(prismaMock.specializations.update).toHaveBeenCalledWith({
        where: { id: updatedSpecialization.id },
        data: updatedSpecialization,
      });
    });

    it("sollte einen Fehler werfen, wenn keine ID für das Update angegeben wird", async () => {
      const specializationWithoutId = { ...mockSpecialization, id: undefined } as any;

      await expect(specializationService.update(specializationWithoutId)).rejects.toThrow("ID is required for update");
    });

    it("sollte einen Fehler werfen, wenn die zu aktualisierende Spezialisierung nicht existiert", async () => {
      const error = new Error("Record to update not found");
      prismaMock.specializations.update.mockRejectedValue(error);

      await expect(specializationService.update({ ...mockSpecialization, id: 999 })).rejects.toThrow(
        "Record to update not found"
      );
    });
  });

  describe("delete", () => {
    it("sollte eine Spezialisierung löschen", async () => {
      prismaMock.specializations.delete.mockResolvedValue(mockSpecialization);

      await specializationService.delete(1);

      expect(prismaMock.specializations.delete).toHaveBeenCalledWith({
        where: { id: 1 },
      });
      expect(prismaMock.specializations.delete).toHaveBeenCalledTimes(1);
    });

    it("sollte einen Fehler werfen, wenn die zu löschende Spezialisierung nicht existiert", async () => {
      const error = new Error("Record to delete does not exist");
      prismaMock.specializations.delete.mockRejectedValue(error);

      await expect(specializationService.delete(999)).rejects.toThrow("Record to delete does not exist");
    });
  });
});
