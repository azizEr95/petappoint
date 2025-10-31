// WICHTIG: Zuerst den singleton importieren, damit das Mocking funktioniert
import { prismaMock } from "../../testConfig/singleton";
// Danach die Types importieren
import { veterinaries } from "../../generated/prisma";
// Dann den Service importieren
import { veterinaryService } from "../../src/service/veterinaryService";

describe("veterinaryService", () => {
  // Test-Datenvorbereitung
  const mockVeterinary: veterinaries = {
    id: 1,
    infoemail: "dr.mueller@tierarzt.de",
    fk_veterinarypractice: 1,
  };

  const mockVeterinaryWithRelations = {
    ...mockVeterinary,
    appointments: [],
    veterinarypractices: {
      id: 1,
      name: "Tierarztpraxis Mitte",
      phone: "030123456",
      infoemail: "info@praxis.de",
      email: "kontakt@praxis.de",
      password: "hashedpassword",
      website: "www.praxis.de",
      info: "Beste Praxis in Berlin",
      fk_addressid: 1,
    },
    persons: {
      id: 1,
      firstname: "Hans",
      lastname: "Mueller",
      sex: "male",
      dateofbirth: new Date("1980-01-01"),
      phone: "015759712682",
      email: "dr.mueller@tierarzt.de",
      password: "hashedpassword",
      fk_address: 1,
    },
    veterinary_has_specialization: [
      {
        fk_veterinaryid: 1,
        fk_specializationid: 1,
        specializations: {
          id: 1,
          name: "Chirurgie",
        },
      },
    ],
  };

  describe("create", () => {
    it("sollte einen neuen Tierarzt erstellen", async () => {
      prismaMock.veterinaries.create.mockResolvedValue(mockVeterinary);

      const result = await veterinaryService.create(mockVeterinary);

      expect(result).toEqual(mockVeterinary);
      expect(prismaMock.veterinaries.create).toHaveBeenCalledWith({
        data: mockVeterinary,
      });
      expect(prismaMock.veterinaries.create).toHaveBeenCalledTimes(1);
    });

    it("sollte einen Fehler werfen, wenn die Erstellung fehlschlägt", async () => {
      const error = new Error("Database error");
      prismaMock.veterinaries.create.mockRejectedValue(error);

      await expect(veterinaryService.create(mockVeterinary)).rejects.toThrow("Database error");
    });
  });

  describe("getById", () => {
    it("sollte einen Tierarzt mit allen Relationen finden", async () => {
      prismaMock.veterinaries.findUnique.mockResolvedValue(mockVeterinaryWithRelations as any);

      const result = await veterinaryService.getById(1);

      expect(result).toEqual(mockVeterinaryWithRelations);
      expect(prismaMock.veterinaries.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
        include: {
          appointments: true,
          veterinarypractices: true,
          persons: true,
          veterinary_has_specialization: {
            include: {
              specializations: true,
            },
          },
        },
      });
    });

    it("sollte einen Fehler werfen, wenn der Tierarzt nicht gefunden wird", async () => {
      prismaMock.veterinaries.findUnique.mockResolvedValue(null);

      await expect(veterinaryService.getById(999)).rejects.toThrow("Veterinary not found with id: 999");
    });
  });

  describe("getByPractice", () => {
    it("sollte alle Tierärzte einer Praxis finden", async () => {
      const mockVeterinaries = [mockVeterinary, { ...mockVeterinary, id: 2, infoemail: "dr.schmidt@tierarzt.de" }];

      prismaMock.veterinaries.findMany.mockResolvedValue(mockVeterinaries);

      const result = await veterinaryService.getByPractice(1);

      expect(result).toEqual(mockVeterinaries);
      expect(prismaMock.veterinaries.findMany).toHaveBeenCalledWith({
        where: { fk_veterinarypractice: 1 },
      });
    });

    it("sollte ein leeres Array zurückgeben, wenn keine Tierärzte gefunden werden", async () => {
      prismaMock.veterinaries.findMany.mockResolvedValue([]);

      const result = await veterinaryService.getByPractice(999);

      expect(result).toEqual([]);
      expect(result.length).toBe(0);
    });
  });

  describe("getAll", () => {
    it("sollte alle Tierärzte finden", async () => {
      const mockVeterinaries = [
        mockVeterinary,
        {
          id: 2,
          infoemail: "dr.schmidt@tierarzt.de",
          fk_veterinarypractice: 2,
        },
      ];

      prismaMock.veterinaries.findMany.mockResolvedValue(mockVeterinaries);

      const result = await veterinaryService.getAll();

      expect(result).toEqual(mockVeterinaries);
      expect(prismaMock.veterinaries.findMany).toHaveBeenCalledWith();
      expect(result.length).toBe(2);
    });

    it("sollte ein leeres Array zurückgeben, wenn keine Tierärzte existieren", async () => {
      prismaMock.veterinaries.findMany.mockResolvedValue([]);

      const result = await veterinaryService.getAll();

      expect(result).toEqual([]);
      expect(result.length).toBe(0);
    });
  });

  describe("update", () => {
    it("sollte einen Tierarzt aktualisieren", async () => {
      const updatedVeterinary = {
        ...mockVeterinary,
        infoemail: "dr.mueller.neu@tierarzt.de",
      };

      prismaMock.veterinaries.update.mockResolvedValue(updatedVeterinary);

      const result = await veterinaryService.update(updatedVeterinary);

      expect(result).toEqual(updatedVeterinary);
      expect(prismaMock.veterinaries.update).toHaveBeenCalledWith({
        where: { id: updatedVeterinary.id },
        data: updatedVeterinary,
      });
    });

    it("sollte einen Fehler werfen, wenn der zu aktualisierende Tierarzt nicht existiert", async () => {
      const error = new Error("Record to update not found");
      prismaMock.veterinaries.update.mockRejectedValue(error);

      await expect(veterinaryService.update({ ...mockVeterinary, id: 999 })).rejects.toThrow(
        "Record to update not found"
      );
    });
  });

  describe("delete", () => {
    it("sollte einen Tierarzt löschen", async () => {
      prismaMock.veterinaries.delete.mockResolvedValue(mockVeterinary);

      await veterinaryService.delete(1);

      expect(prismaMock.veterinaries.delete).toHaveBeenCalledWith({
        where: { id: 1 },
      });
      expect(prismaMock.veterinaries.delete).toHaveBeenCalledTimes(1);
    });

    it("sollte einen Fehler werfen, wenn der zu löschende Tierarzt nicht existiert", async () => {
      const error = new Error("Record to delete does not exist");
      prismaMock.veterinaries.delete.mockRejectedValue(error);

      await expect(veterinaryService.delete(999)).rejects.toThrow("Record to delete does not exist");
    });
  });
});
