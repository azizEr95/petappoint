import { prisma } from "../../testConfig/integrationConfig";
import { animalHasVaccinationService } from "../../src/service/animalHasVaccinationService";

describe("animalHasVaccinationService", () => {
  let animalId: number;
  let vaccinationId: number;

  beforeEach(async () => {
    const animalType = await prisma.animaltypes.create({ data: { name: "Hund" } });
    const animal = await prisma.animals.create({
      data: {
        name: "Bello",
        dateofbirth: new Date("2020-05-15"),
        fk_animaltypeid: animalType.id,
      },
    });
    animalId = animal.id;

    const vaccination = await prisma.vaccinations.create({ data: { name: "Tollwut" } });
    vaccinationId = vaccination.id;
  });

  describe("create", () => {
    it("sollte eine neue Tier-Impfung-Verbindung erstellen", async () => {
      const data = {
        dateofvaccination: new Date("2024-01-15"),
        fk_animalid: animalId,
        fk_vaccinationid: vaccinationId,
      };

      const result = await animalHasVaccinationService.create(data);

      expect(result.fk_animalid).toBe(animalId);
      expect(result.fk_vaccinationid).toBe(vaccinationId);

      const dbRelation = await prisma.animal_has_vaccination.findUnique({
        where: { id: result.id },
      });
      expect(dbRelation).not.toBeNull();
    });

    it("sollte einen Fehler werfen, wenn die Erstellung fehlschlägt", async () => {
      const invalidData = {
        dateofvaccination: new Date(),
        fk_animalid: 999999,
        fk_vaccinationid: 999999,
      };

      await expect(animalHasVaccinationService.create(invalidData)).rejects.toThrow();
    });
  });

  describe("getAnimalByVacinationId", () => {
    it("sollte alle Tiere mit einer bestimmten Impfung finden", async () => {
      await prisma.animal_has_vaccination.create({
        data: {
          dateofvaccination: new Date("2024-01-15"),
          fk_animalid: animalId,
          fk_vaccinationid: vaccinationId,
        },
      });

      const result = await animalHasVaccinationService.getAnimalByVacinationId(vaccinationId);

      expect(result.length).toBe(1);
      expect(result[0].animal.id).toBe(animalId);
      expect(result[0].vaccinations.id).toBe(vaccinationId);
    });

    it("sollte ein leeres Array zurückgeben, wenn keine Tiere mit dieser Impfung existieren", async () => {
      const result = await animalHasVaccinationService.getAnimalByVacinationId(999999);

      expect(result).toEqual([]);
    });
  });

  describe("getVaccinationByAnimalId", () => {
    it("sollte alle Impfungen eines Tieres finden", async () => {
      await prisma.animal_has_vaccination.create({
        data: {
          dateofvaccination: new Date("2024-01-15"),
          fk_animalid: animalId,
          fk_vaccinationid: vaccinationId,
        },
      });

      const result = await animalHasVaccinationService.getVaccinationByAnimalId(animalId);

      expect(result.length).toBe(1);
      expect(result[0].animal.id).toBe(animalId);
      expect(result[0].vaccinations.id).toBe(vaccinationId);
    });

    it("sollte ein leeres Array zurückgeben, wenn das Tier keine Impfungen hat", async () => {
      const result = await animalHasVaccinationService.getVaccinationByAnimalId(999999);

      expect(result).toEqual([]);
    });
  });

  describe("delete", () => {
    it("sollte eine Tier-Impfung-Verbindung löschen", async () => {
      const created = await prisma.animal_has_vaccination.create({
        data: {
          dateofvaccination: new Date("2024-01-15"),
          fk_animalid: animalId,
          fk_vaccinationid: vaccinationId,
        },
      });

      await animalHasVaccinationService.delete(created);

      const dbRelation = await prisma.animal_has_vaccination.findUnique({
        where: { id: created.id },
      });
      expect(dbRelation).toBeNull();
    });

    it("sollte einen Fehler werfen, wenn die zu löschende Verbindung nicht existiert", async () => {
      const nonExistent = {
        id: 999999,
        dateofvaccination: new Date(),
        fk_animalid: 999999,
        fk_vaccinationid: 999999,
      };

      await expect(animalHasVaccinationService.delete(nonExistent)).rejects.toThrow();
    });
  });

  describe("exists", () => {
    it("sollte true zurückgeben, wenn die Verbindung existiert", async () => {
      const created = await prisma.animal_has_vaccination.create({
        data: {
          dateofvaccination: new Date("2024-01-15"),
          fk_animalid: animalId,
          fk_vaccinationid: vaccinationId,
        },
      });

      const result = await animalHasVaccinationService.exists(created);

      expect(result).toBe(true);
    });

    it("sollte false zurückgeben, wenn die Verbindung nicht existiert", async () => {
      const nonExistent = {
        id: 999999,
        dateofvaccination: new Date(),
        fk_animalid: 999999,
        fk_vaccinationid: 999999,
      };

      const result = await animalHasVaccinationService.exists(nonExistent);

      expect(result).toBe(false);
    });
  });
});
