import { prisma } from "../../testConfig/integrationConfig";
import { medicationService } from "../../src/service/medicationsService";

describe("medicationService", () => {
  const medicationData = {
    name: "Amoxicillin",
  };

  describe("create", () => {
    it("sollte ein neues Medikament erstellen", async () => {
      const result = await medicationService.create(medicationData);

      expect(result.name).toBe(medicationData.name);

      const dbMedication = await prisma.medications.findUnique({ where: { id: result.id } });
      expect(dbMedication).not.toBeNull();
      expect(dbMedication?.name).toBe(medicationData.name);
    });

    it("sollte einen Fehler werfen, wenn die Erstellung fehlschlägt", async () => {
      const invalidData = { name: null } as any;

      await expect(medicationService.create(invalidData)).rejects.toThrow();
    });
  });

  describe("getById", () => {
    it("sollte ein Medikament anhand der ID finden", async () => {
      const created = await prisma.medications.create({ data: medicationData });

      const result = await medicationService.getById(created.id);

      expect(result.id).toBe(created.id);
      expect(result.name).toBe(medicationData.name);
    });

    it("sollte einen Fehler werfen, wenn das Medikament nicht gefunden wird", async () => {
      await expect(medicationService.getById(999999)).rejects.toThrow("Medication with id 999999 does not exist");
    });
  });

  describe("getAll", () => {
    it("sollte alle Medikamente finden", async () => {
      await prisma.medications.create({ data: medicationData });
      await prisma.medications.create({ data: { name: "Metacam" } });
      await prisma.medications.create({ data: { name: "Frontline" } });
      await prisma.medications.create({ data: { name: "Prednison" } });

      const result = await medicationService.getAll();

      expect(result.length).toBe(4);
      expect(result.some(m => m.name === "Amoxicillin")).toBe(true);
      expect(result.some(m => m.name === "Metacam")).toBe(true);
      expect(result.some(m => m.name === "Frontline")).toBe(true);
      expect(result.some(m => m.name === "Prednison")).toBe(true);
    });

    it("sollte ein leeres Array zurückgeben, wenn keine Medikamente existieren", async () => {
      const result = await medicationService.getAll();

      expect(result).toEqual([]);
      expect(result.length).toBe(0);
    });
  });

  describe("update", () => {
    it("sollte ein Medikament aktualisieren", async () => {
      const created = await prisma.medications.create({ data: medicationData });
      const updatedData = {
        ...created,
        name: "Amoxicillin 500mg",
      };

      const result = await medicationService.update(updatedData);

      expect(result.name).toBe("Amoxicillin 500mg");

      const dbMedication = await prisma.medications.findUnique({ where: { id: created.id } });
      expect(dbMedication?.name).toBe("Amoxicillin 500mg");
    });

    it("sollte einen Fehler werfen, wenn keine ID für das Update angegeben wird", async () => {
      const medicationWithoutId = { ...medicationData, id: undefined } as any;

      await expect(medicationService.update(medicationWithoutId)).rejects.toThrow("ID is required for update");
    });

    it("sollte einen Fehler werfen, wenn das zu aktualisierende Medikament nicht existiert", async () => {
      const nonExistentMedication = { ...medicationData, id: 999999 };

      await expect(medicationService.update(nonExistentMedication)).rejects.toThrow();
    });
  });

  describe("delete", () => {
    it("sollte ein Medikament löschen", async () => {
      const created = await prisma.medications.create({ data: medicationData });

      await medicationService.delete(created.id);

      const dbMedication = await prisma.medications.findUnique({ where: { id: created.id } });
      expect(dbMedication).toBeNull();
    });

    it("sollte einen Fehler werfen, wenn das zu löschende Medikament nicht existiert", async () => {
      await expect(medicationService.delete(999999)).rejects.toThrow();
    });
  });
});
