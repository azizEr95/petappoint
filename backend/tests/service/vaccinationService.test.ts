import { prisma } from "../../testConfig/integrationConfig";
import { vaccinationService } from "../../src/service/vaccinationsService";

describe("vaccinationService", () => {
  const vaccinationData = {
    name: "Tollwut",
  };

  describe("create", () => {
    it("sollte eine neue Impfung erstellen", async () => {
      const result = await vaccinationService.create(vaccinationData);

      expect(result.name).toBe(vaccinationData.name);

      const dbVaccination = await prisma.vaccinations.findUnique({ where: { id: result.id } });
      expect(dbVaccination).not.toBeNull();
      expect(dbVaccination?.name).toBe(vaccinationData.name);
    });

    it("sollte einen Fehler werfen, wenn die Erstellung fehlschlägt", async () => {
      const invalidData = { name: null } as any;

      await expect(vaccinationService.create(invalidData)).rejects.toThrow();
    });
  });

  describe("getById", () => {
    it("sollte eine Impfung anhand der ID finden", async () => {
      const created = await prisma.vaccinations.create({ data: vaccinationData });

      const result = await vaccinationService.getById(created.id);

      expect(result.id).toBe(created.id);
      expect(result.name).toBe(vaccinationData.name);
    });

    it("sollte einen Fehler werfen, wenn die Impfung nicht gefunden wird", async () => {
      await expect(vaccinationService.getById(999999)).rejects.toThrow("Vaccination does not exist with id 999999");
    });
  });

  describe("getAll", () => {
    it("sollte alle Impfungen finden", async () => {
      await prisma.vaccinations.create({ data: vaccinationData });
      await prisma.vaccinations.create({ data: { name: "Staupe" } });
      await prisma.vaccinations.create({ data: { name: "Parvovirose" } });

      const result = await vaccinationService.getAll();

      expect(result.length).toBe(3);
      expect(result.some(v => v.name === "Tollwut")).toBe(true);
      expect(result.some(v => v.name === "Staupe")).toBe(true);
      expect(result.some(v => v.name === "Parvovirose")).toBe(true);
    });

    it("sollte ein leeres Array zurückgeben, wenn keine Impfungen existieren", async () => {
      const result = await vaccinationService.getAll();

      expect(result).toEqual([]);
      expect(result.length).toBe(0);
    });
  });

  describe("update", () => {
    it("sollte eine Impfung aktualisieren", async () => {
      const created = await prisma.vaccinations.create({ data: vaccinationData });
      const updatedData = {
        ...created,
        name: "Tollwut - Neu",
      };

      const result = await vaccinationService.update(updatedData);

      expect(result.name).toBe("Tollwut - Neu");

      const dbVaccination = await prisma.vaccinations.findUnique({ where: { id: created.id } });
      expect(dbVaccination?.name).toBe("Tollwut - Neu");
    });

    it("sollte einen Fehler werfen, wenn keine ID für das Update angegeben wird", async () => {
      const vaccinationWithoutId = { ...vaccinationData, id: undefined } as any;

      await expect(vaccinationService.update(vaccinationWithoutId)).rejects.toThrow("ID is required for update");
    });

    it("sollte einen Fehler werfen, wenn die zu aktualisierende Impfung nicht existiert", async () => {
      const nonExistentVaccination = { ...vaccinationData, id: 999999 };

      await expect(vaccinationService.update(nonExistentVaccination)).rejects.toThrow();
    });
  });

  describe("delete", () => {
    it("sollte eine Impfung löschen", async () => {
      const created = await prisma.vaccinations.create({ data: vaccinationData });

      await vaccinationService.delete(created.id);

      const dbVaccination = await prisma.vaccinations.findUnique({ where: { id: created.id } });
      expect(dbVaccination).toBeNull();
    });

    it("sollte einen Fehler werfen, wenn die zu löschende Impfung nicht existiert", async () => {
      await expect(vaccinationService.delete(999999)).rejects.toThrow();
    });
  });
});
