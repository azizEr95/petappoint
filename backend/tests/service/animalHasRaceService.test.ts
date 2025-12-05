import { prisma } from "../../testConfig/integrationConfig";
import { animalHasRacesService } from "../../src/service/animalHasRacesService";

describe("animalHasRacesService", () => {
  let animalId: number;
  let raceId: number;

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

    const race = await prisma.animalraces.create({
      data: {
        name: "Golden Retriever",
        fk_animaltypeid: animalType.id,
      },
    });
    raceId = race.id;
  });

  describe("create", () => {
    it("sollte eine neue Tier-Rasse-Verbindung erstellen", async () => {
      const data = {
        fk_animalid: animalId,
        fk_animalraceid: raceId,
      };

      const result = await animalHasRacesService.create(data);

      expect(result.fk_animalid).toBe(animalId);
      expect(result.fk_animalraceid).toBe(raceId);

      const dbRelation = await prisma.animal_has_races.findUnique({
        where: {
          fk_animalid_fk_animalraceid: {
            fk_animalid: animalId,
            fk_animalraceid: raceId,
          },
        },
      });
      expect(dbRelation).not.toBeNull();
    });

    it("sollte einen Fehler werfen, wenn die Erstellung fehlschlägt", async () => {
      const invalidData = { fk_animalid: 999999, fk_animalraceid: 999999 };

      await expect(animalHasRacesService.create(invalidData)).rejects.toThrow();
    });
  });

  describe("getAnimalByRacesId", () => {
    it("sollte alle Tiere einer bestimmten Rasse finden", async () => {
      await prisma.animal_has_races.create({
        data: { fk_animalid: animalId, fk_animalraceid: raceId },
      });

      const result = await animalHasRacesService.getAnimalByRacesId(raceId);

      expect(result.length).toBe(1);
      expect(result[0].animal.id).toBe(animalId);
      expect(result[0].animalraces.id).toBe(raceId);
    });

    it("sollte ein leeres Array zurückgeben, wenn keine Tiere mit dieser Rasse existieren", async () => {
      const result = await animalHasRacesService.getAnimalByRacesId(999999);

      expect(result).toEqual([]);
    });
  });

  describe("getRacesByAnimalId", () => {
    it("sollte alle Rassen eines Tieres finden", async () => {
      await prisma.animal_has_races.create({
        data: { fk_animalid: animalId, fk_animalraceid: raceId },
      });

      const result = await animalHasRacesService.getRacesByAnimalId(animalId);

      expect(result.length).toBe(1);
      expect(result[0].animal.id).toBe(animalId);
      expect(result[0].animalraces.id).toBe(raceId);
    });

    it("sollte ein leeres Array zurückgeben, wenn das Tier keine Rassen hat", async () => {
      const result = await animalHasRacesService.getRacesByAnimalId(999999);

      expect(result).toEqual([]);
    });
  });

  describe("delete", () => {
    it("sollte eine Tier-Rasse-Verbindung löschen", async () => {
      await prisma.animal_has_races.create({
        data: { fk_animalid: animalId, fk_animalraceid: raceId },
      });

      await animalHasRacesService.delete({ fk_animalid: animalId, fk_animalraceid: raceId });

      const dbRelation = await prisma.animal_has_races.findUnique({
        where: {
          fk_animalid_fk_animalraceid: {
            fk_animalid: animalId,
            fk_animalraceid: raceId,
          },
        },
      });
      expect(dbRelation).toBeNull();
    });

    it("sollte einen Fehler werfen, wenn die zu löschende Verbindung nicht existiert", async () => {
      await expect(animalHasRacesService.delete({ fk_animalid: 999999, fk_animalraceid: 999999 })).rejects.toThrow();
    });
  });

  describe("exists", () => {
    it("sollte true zurückgeben, wenn die Verbindung existiert", async () => {
      await prisma.animal_has_races.create({
        data: { fk_animalid: animalId, fk_animalraceid: raceId },
      });

      const result = await animalHasRacesService.exists({ fk_animalid: animalId, fk_animalraceid: raceId });

      expect(result).toBe(true);
    });

    it("sollte false zurückgeben, wenn die Verbindung nicht existiert", async () => {
      const result = await animalHasRacesService.exists({ fk_animalid: 999999, fk_animalraceid: 999999 });

      expect(result).toBe(false);
    });
  });
});
