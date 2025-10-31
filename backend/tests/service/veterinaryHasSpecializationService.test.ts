// WICHTIG: Zuerst den singleton importieren, damit das Mocking funktioniert
import { prismaMock } from "../../testConfig/singleton";
// Danach die Types importieren
import { veterinary_has_specialization } from "../../generated/prisma";
// Dann den Service importieren
import { veterinaryHasSpecializationService } from "../../src/service/veterinaryHasSpecializationService";

describe("veterinaryHasSpecializationService", () => {
  // Test-Datenvorbereitung
  const mockVetHasSpec: veterinary_has_specialization = {
    fk_veterinaryid: 1,
    fk_specializationid: 1,
  };

  const mockVetHasSpecWithRelations = {
    fk_veterinaryid: 1,
    fk_specializationid: 1,
    specializations: {
      id: 1,
      name: "Chirurgie",
    },
    veterinaries: {
      id: 1,
      infoemail: "dr.mueller@tierarzt.de",
      fk_veterinarypractice: 1,
    },
  };

  describe("create", () => {
    it("sollte eine neue Veterinär-Spezialisierung-Verbindung erstellen", async () => {
      prismaMock.veterinary_has_specialization.create.mockResolvedValue(mockVetHasSpec);

      const result = await veterinaryHasSpecializationService.create(mockVetHasSpec);

      expect(result).toEqual(mockVetHasSpec);
      expect(prismaMock.veterinary_has_specialization.create).toHaveBeenCalledWith({
        data: mockVetHasSpec,
      });
      expect(prismaMock.veterinary_has_specialization.create).toHaveBeenCalledTimes(1);
    });

    it("sollte einen Fehler werfen, wenn die Erstellung fehlschlägt", async () => {
      const error = new Error("Database error");
      prismaMock.veterinary_has_specialization.create.mockRejectedValue(error);

      await expect(veterinaryHasSpecializationService.create(mockVetHasSpec)).rejects.toThrow("Database error");
    });
  });

  describe("getSpecializationsByVeterinary", () => {
    it("sollte alle Spezialisierungen eines Tierarztes finden", async () => {
      const mockVetSpecializations = [
        mockVetHasSpecWithRelations,
        {
          fk_veterinaryid: 1,
          fk_specializationid: 2,
          specializations: {
            id: 2,
            name: "Orthopädie",
          },
          veterinaries: {
            id: 1,
            infoemail: "dr.mueller@tierarzt.de",
            fk_veterinarypractice: 1,
          },
        },
      ];

      prismaMock.veterinary_has_specialization.findMany.mockResolvedValue(mockVetSpecializations as any);

      const result = await veterinaryHasSpecializationService.getSpecializationsByVeterinary(1);

      expect(result).toEqual([
        {
          specialization: mockVetSpecializations[0].specializations,
          veterinary: mockVetSpecializations[0].veterinaries,
        },
        {
          specialization: mockVetSpecializations[1].specializations,
          veterinary: mockVetSpecializations[1].veterinaries,
        },
      ]);
      expect(prismaMock.veterinary_has_specialization.findMany).toHaveBeenCalledWith({
        where: { fk_veterinaryid: 1 },
        include: {
          specializations: true,
          veterinaries: true,
        },
      });
    });

    it("sollte ein leeres Array zurückgeben, wenn der Tierarzt keine Spezialisierungen hat", async () => {
      prismaMock.veterinary_has_specialization.findMany.mockResolvedValue([]);

      const result = await veterinaryHasSpecializationService.getSpecializationsByVeterinary(999);

      expect(result).toEqual([]);
      expect(result.length).toBe(0);
    });
  });

  describe("getVeterinariesBySpecialization", () => {
    it("sollte alle Tierärzte mit einer bestimmten Spezialisierung finden", async () => {
      const mockVetSpecializations = [
        mockVetHasSpecWithRelations,
        {
          fk_veterinaryid: 2,
          fk_specializationid: 1,
          specializations: {
            id: 1,
            name: "Chirurgie",
          },
          veterinaries: {
            id: 2,
            infoemail: "dr.schmidt@tierarzt.de",
            fk_veterinarypractice: 1,
          },
        },
      ];

      prismaMock.veterinary_has_specialization.findMany.mockResolvedValue(mockVetSpecializations as any);

      const result = await veterinaryHasSpecializationService.getVeterinariesBySpecialization(1);

      expect(result).toEqual([
        {
          specialization: mockVetSpecializations[0].specializations,
          veterinary: mockVetSpecializations[0].veterinaries,
        },
        {
          specialization: mockVetSpecializations[1].specializations,
          veterinary: mockVetSpecializations[1].veterinaries,
        },
      ]);
      expect(prismaMock.veterinary_has_specialization.findMany).toHaveBeenCalledWith({
        where: { fk_specializationid: 1 },
        include: {
          specializations: true,
          veterinaries: true,
        },
      });
    });

    it("sollte ein leeres Array zurückgeben, wenn keine Tierärzte die Spezialisierung haben", async () => {
      prismaMock.veterinary_has_specialization.findMany.mockResolvedValue([]);

      const result = await veterinaryHasSpecializationService.getVeterinariesBySpecialization(999);

      expect(result).toEqual([]);
      expect(result.length).toBe(0);
    });
  });

  describe("delete", () => {
    it("sollte eine Veterinär-Spezialisierung-Verbindung löschen", async () => {
      prismaMock.veterinary_has_specialization.delete.mockResolvedValue(mockVetHasSpec);

      await veterinaryHasSpecializationService.delete(mockVetHasSpec);

      expect(prismaMock.veterinary_has_specialization.delete).toHaveBeenCalledWith({
        where: {
          fk_veterinaryid_fk_specializationid: {
            fk_veterinaryid: mockVetHasSpec.fk_veterinaryid,
            fk_specializationid: mockVetHasSpec.fk_specializationid,
          },
        },
      });
      expect(prismaMock.veterinary_has_specialization.delete).toHaveBeenCalledTimes(1);
    });

    it("sollte einen Fehler werfen, wenn die zu löschende Verbindung nicht existiert", async () => {
      const error = new Error("Record to delete does not exist");
      prismaMock.veterinary_has_specialization.delete.mockRejectedValue(error);

      const nonExistentVetHasSpec: veterinary_has_specialization = {
        fk_veterinaryid: 999,
        fk_specializationid: 999,
      };

      await expect(veterinaryHasSpecializationService.delete(nonExistentVetHasSpec)).rejects.toThrow(
        "Record to delete does not exist"
      );
    });
  });

  describe("exists", () => {
    it("sollte true zurückgeben, wenn die Verbindung existiert", async () => {
      prismaMock.veterinary_has_specialization.findUnique.mockResolvedValue(mockVetHasSpec);

      const result = await veterinaryHasSpecializationService.exists(mockVetHasSpec);

      expect(result).toBe(true);
      expect(prismaMock.veterinary_has_specialization.findUnique).toHaveBeenCalledWith({
        where: {
          fk_veterinaryid_fk_specializationid: {
            fk_veterinaryid: mockVetHasSpec.fk_veterinaryid,
            fk_specializationid: mockVetHasSpec.fk_specializationid,
          },
        },
      });
    });

    it("sollte false zurückgeben, wenn die Verbindung nicht existiert", async () => {
      prismaMock.veterinary_has_specialization.findUnique.mockResolvedValue(null);

      const nonExistentVetHasSpec: veterinary_has_specialization = {
        fk_veterinaryid: 999,
        fk_specializationid: 999,
      };

      const result = await veterinaryHasSpecializationService.exists(nonExistentVetHasSpec);

      expect(result).toBe(false);
    });
  });
});
