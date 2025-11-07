// WICHTIG: Zuerst den singleton importieren, damit das Mocking funktioniert
import { prismaMock } from "../../testConfig/singleton";
// Danach die Types importieren
import { veterinarypractices } from "../../generated/prisma";
// Dann den Service importieren
import { veterinaryPracticeService } from "../../src/service/veterinaryPracticeService";

describe("veterinaryPracticeService", () => {
  // Test-Datenvorbereitung
  const mockPractice: veterinarypractices = {
    id: 1,
    name: "Tierarztpraxis Mitte",
    phone: "030123456",
    infoemail: "info@praxis.de",
    email: "kontakt@praxis.de",
    password: "hashedpassword",
    website: "www.praxis.de",
    info: "Beste Praxis in Berlin",
    fk_addressid: 1,
  };

  describe("create", () => {
    it("sollte eine neue Tierarztpraxis erstellen", async () => {
      prismaMock.veterinarypractices.create.mockResolvedValue(mockPractice);

      const result = await veterinaryPracticeService.create(mockPractice);

      expect(result).toEqual(mockPractice);
      expect(prismaMock.veterinarypractices.create).toHaveBeenCalledWith({
        data: mockPractice,
      });
      expect(prismaMock.veterinarypractices.create).toHaveBeenCalledTimes(1);
    });

    it("sollte einen Fehler werfen, wenn die Erstellung fehlschlägt", async () => {
      const error = new Error("Database error");
      prismaMock.veterinarypractices.create.mockRejectedValue(error);

      await expect(veterinaryPracticeService.create(mockPractice)).rejects.toThrow("Database error");
    });
  });

  describe("getById", () => {
    it("sollte eine Tierarztpraxis anhand der ID finden", async () => {
      prismaMock.veterinarypractices.findUnique.mockResolvedValue(mockPractice);

      const result = await veterinaryPracticeService.getById(1);

      expect(result).toEqual(mockPractice);
      expect(prismaMock.veterinarypractices.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
      });
    });

    it("sollte einen Fehler werfen, wenn die Tierarztpraxis nicht gefunden wird", async () => {
      prismaMock.veterinarypractices.findUnique.mockResolvedValue(null);

      await expect(veterinaryPracticeService.getById(999)).rejects.toThrow(
        "Veterinary Practice not found with id: 999"
      );
    });
  });

  describe("getByEmail", () => {
    it("sollte eine Tierarztpraxis anhand der E-Mail finden", async () => {
      prismaMock.veterinarypractices.findFirst.mockResolvedValue(mockPractice);

      const result = await veterinaryPracticeService.getByEmail("kontakt@praxis.de");

      expect(result).toEqual(mockPractice);
      expect(prismaMock.veterinarypractices.findFirst).toHaveBeenCalledWith({
        where: { email: "kontakt@praxis.de" },
      });
    });

    it("sollte null zurückgeben, wenn keine Tierarztpraxis mit der E-Mail existiert", async () => {
      prismaMock.veterinarypractices.findFirst.mockResolvedValue(null);

      const result = await veterinaryPracticeService.getByEmail("nichtexistent@praxis.de");

      expect(result).toBeNull();
    });
  });

  describe("getByAddress", () => {
    it("sollte alle Tierarztpraxen einer Adresse finden", async () => {
      const mockPractices = [
        mockPractice,
        { ...mockPractice, id: 2, name: "Tierarztpraxis Nord", email: "nord@praxis.de" },
      ];

      prismaMock.veterinarypractices.findMany.mockResolvedValue(mockPractices);

      const result = await veterinaryPracticeService.getByNameOrAdress("Tierarztpraxis Mitte");

      expect(result).toEqual(mockPractices);
    });

    it("sollte ein leeres Array zurückgeben, wenn keine Tierarztpraxen an der Adresse gefunden werden", async () => {
      prismaMock.veterinarypractices.findMany.mockResolvedValue([]);

      const result = await veterinaryPracticeService.getByNameOrAdress("miau");

      expect(result).toEqual([]);
      expect(result.length).toBe(0);
    });
  });

  describe("getAll", () => {
    it("sollte alle Tierarztpraxen finden", async () => {
      const mockPractices = [
        mockPractice,
        {
          id: 2,
          name: "Tierarztpraxis Nord",
          phone: "030789012",
          infoemail: "info@nord.de",
          email: "kontakt@nord.de",
          password: "hashedpassword2",
          website: "www.nord.de",
          info: "Praxis im Norden",
          fk_addressid: 2,
        },
      ];

      prismaMock.veterinarypractices.findMany.mockResolvedValue(mockPractices);

      const result = await veterinaryPracticeService.getAll();

      expect(result).toEqual(mockPractices);
      expect(prismaMock.veterinarypractices.findMany).toHaveBeenCalledWith();
      expect(result.length).toBe(2);
    });

    it("sollte ein leeres Array zurückgeben, wenn keine Tierarztpraxen existieren", async () => {
      prismaMock.veterinarypractices.findMany.mockResolvedValue([]);

      const result = await veterinaryPracticeService.getAll();

      expect(result).toEqual([]);
      expect(result.length).toBe(0);
    });
  });

  describe("update", () => {
    it("sollte eine Tierarztpraxis aktualisieren", async () => {
      const updatedPractice = {
        ...mockPractice,
        name: "Tierarztpraxis Mitte - Neu",
        phone: "030999999",
      };

      prismaMock.veterinarypractices.update.mockResolvedValue(updatedPractice);

      const result = await veterinaryPracticeService.update(updatedPractice);

      expect(result).toEqual(updatedPractice);
      expect(prismaMock.veterinarypractices.update).toHaveBeenCalledWith({
        where: { id: updatedPractice.id },
        data: updatedPractice,
      });
    });

    it("sollte einen Fehler werfen, wenn keine ID für das Update angegeben wird", async () => {
      const practiceWithoutId = { ...mockPractice, id: undefined } as any;

      await expect(veterinaryPracticeService.update(practiceWithoutId)).rejects.toThrow("ID is required for update");
    });

    it("sollte einen Fehler werfen, wenn die zu aktualisierende Tierarztpraxis nicht existiert", async () => {
      const error = new Error("Record to update not found");
      prismaMock.veterinarypractices.update.mockRejectedValue(error);

      await expect(veterinaryPracticeService.update({ ...mockPractice, id: 999 })).rejects.toThrow(
        "Record to update not found"
      );
    });
  });

  describe("delete", () => {
    it("sollte eine Tierarztpraxis löschen", async () => {
      prismaMock.veterinarypractices.delete.mockResolvedValue(mockPractice);

      await veterinaryPracticeService.delete(1);

      expect(prismaMock.veterinarypractices.delete).toHaveBeenCalledWith({
        where: { id: 1 },
      });
      expect(prismaMock.veterinarypractices.delete).toHaveBeenCalledTimes(1);
    });

    it("sollte einen Fehler werfen, wenn die zu löschende Tierarztpraxis nicht existiert", async () => {
      const error = new Error("Record to delete does not exist");
      prismaMock.veterinarypractices.delete.mockRejectedValue(error);

      await expect(veterinaryPracticeService.delete(999)).rejects.toThrow("Record to delete does not exist");
    });
  });
});
