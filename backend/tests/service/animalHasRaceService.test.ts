// WICHTIG: Zuerst den singleton importieren, damit das Mocking funktioniert
import { prismaMock } from "../../testConfig/singleton";
// Danach die Types importieren
import { animal_has_races } from "../../generated/prisma";
// Dann den Service importieren
import { animalHasRacesService } from "../../src/service/animalHasRacesService";

describe("animalHasRacesService", () => {
  // Test-Datenvorbereitung
  const mockAnimalHasRace: animal_has_races = {
    fk_animalid: 1,
    fk_animalraceid: 1,
  };

  const mockAnimalHasRaceWithRelations = {
    fk_animalid: 1,
    fk_animalraceid: 1,
    animals: {
      id: 1,
      name: "Bello",
      dateofbirth: new Date("2020-05-15"),
      dateofbirthisexact: true,
      weightingram: 15000,
      heightincm: 45,
      timeofdeath: null,
      iscastrated: false,
      lifestyle: "indoor",
      fk_animaltypeid: 1,
      fk_animalgroupid: 1,
    },
    animalraces: {
      id: 1,
      name: "Golden Retriever",
      fk_animaltypeid: 1,
    },
  };

  describe("create", () => {
    it("sollte eine neue Tier-Rasse-Verbindung erstellen", async () => {
      prismaMock.animal_has_races.create.mockResolvedValue(mockAnimalHasRace);

      const result = await animalHasRacesService.create(mockAnimalHasRace);

      expect(result).toEqual(mockAnimalHasRace);
      expect(prismaMock.animal_has_races.create).toHaveBeenCalledWith({
        data: mockAnimalHasRace,
      });
      expect(prismaMock.animal_has_races.create).toHaveBeenCalledTimes(1);
    });

    it("sollte einen Fehler werfen, wenn die Erstellung fehlschlägt", async () => {
      const error = new Error("Database error");
      prismaMock.animal_has_races.create.mockRejectedValue(error);

      await expect(animalHasRacesService.create(mockAnimalHasRace)).rejects.toThrow("Database error");
    });
  });

  describe("getAnimalByRacesId", () => {
    it("sollte alle Tiere einer bestimmten Rasse finden", async () => {
      const mockAnimalRaces = [
        mockAnimalHasRaceWithRelations,
        {
          fk_animalid: 2,
          fk_animalraceid: 1,
          animals: {
            id: 2,
            name: "Max",
            dateofbirth: new Date("2019-03-10"),
            dateofbirthisexact: true,
            weightingram: 18000,
            heightincm: 50,
            timeofdeath: null,
            iscastrated: true,
            lifestyle: "outdoor",
            fk_animaltypeid: 1,
            fk_animalgroupid: 1,
          },
          animalraces: {
            id: 1,
            name: "Golden Retriever",
            fk_animaltypeid: 1,
          },
        },
      ];

      prismaMock.animal_has_races.findMany.mockResolvedValue(mockAnimalRaces as any);

      const result = await animalHasRacesService.getAnimalByRacesId(1);

      expect(result).toEqual([
        {
          animal: mockAnimalRaces[0].animals,
          animalraces: mockAnimalRaces[0].animalraces,
        },
        {
          animal: mockAnimalRaces[1].animals,
          animalraces: mockAnimalRaces[1].animalraces,
        },
      ]);
      expect(prismaMock.animal_has_races.findMany).toHaveBeenCalledWith({
        where: { fk_animalraceid: 1 },
        include: {
          animals: true,
          animalraces: true,
        },
      });
    });

    it("sollte ein leeres Array zurückgeben, wenn keine Tiere mit dieser Rasse existieren", async () => {
      prismaMock.animal_has_races.findMany.mockResolvedValue([]);

      const result = await animalHasRacesService.getAnimalByRacesId(999);

      expect(result).toEqual([]);
      expect(result.length).toBe(0);
    });
  });

  describe("getRacesByAnimalId", () => {
    it("sollte alle Rassen eines Tieres finden", async () => {
      const mockRacesAnimals = [
        mockAnimalHasRaceWithRelations,
        {
          fk_animalid: 1,
          fk_animalraceid: 2,
          animals: {
            id: 1,
            name: "Bello",
            dateofbirth: new Date("2020-05-15"),
            dateofbirthisexact: true,
            weightingram: 15000,
            heightincm: 45,
            timeofdeath: null,
            iscastrated: false,
            lifestyle: "indoor",
            fk_animaltypeid: 1,
            fk_animalgroupid: 1,
          },
          animalraces: {
            id: 2,
            name: "Labrador",
            fk_animaltypeid: 1,
          },
        },
      ];

      prismaMock.animal_has_races.findMany.mockResolvedValue(mockRacesAnimals as any);

      const result = await animalHasRacesService.getRacesByAnimalId(1);

      expect(result).toEqual([
        {
          animal: mockRacesAnimals[0].animals,
          animalraces: mockRacesAnimals[0].animalraces,
        },
        {
          animal: mockRacesAnimals[1].animals,
          animalraces: mockRacesAnimals[1].animalraces,
        },
      ]);
      expect(prismaMock.animal_has_races.findMany).toHaveBeenCalledWith({
        where: { fk_animalid: 1 },
        include: {
          animals: true,
          animalraces: true,
        },
      });
    });

    it("sollte ein leeres Array zurückgeben, wenn das Tier keine Rassen hat", async () => {
      prismaMock.animal_has_races.findMany.mockResolvedValue([]);

      const result = await animalHasRacesService.getRacesByAnimalId(999);

      expect(result).toEqual([]);
      expect(result.length).toBe(0);
    });
  });

  describe("delete", () => {
    it("sollte eine Tier-Rasse-Verbindung löschen", async () => {
      prismaMock.animal_has_races.delete.mockResolvedValue(mockAnimalHasRace);

      await animalHasRacesService.delete(mockAnimalHasRace);

      expect(prismaMock.animal_has_races.delete).toHaveBeenCalledWith({
        where: {
          fk_animalid_fk_animalraceid: {
            fk_animalid: mockAnimalHasRace.fk_animalid,
            fk_animalraceid: mockAnimalHasRace.fk_animalraceid,
          },
        },
      });
      expect(prismaMock.animal_has_races.delete).toHaveBeenCalledTimes(1);
    });

    it("sollte einen Fehler werfen, wenn die zu löschende Verbindung nicht existiert", async () => {
      const error = new Error("Record to delete does not exist");
      prismaMock.animal_has_races.delete.mockRejectedValue(error);

      const nonExistentRelation: animal_has_races = {
        fk_animalid: 999,
        fk_animalraceid: 999,
      };

      await expect(animalHasRacesService.delete(nonExistentRelation)).rejects.toThrow(
        "Record to delete does not exist"
      );
    });
  });

  describe("exists", () => {
    it("sollte true zurückgeben, wenn die Verbindung existiert", async () => {
      prismaMock.animal_has_races.findUnique.mockResolvedValue(mockAnimalHasRace);

      const result = await animalHasRacesService.exists(mockAnimalHasRace);

      expect(result).toBe(true);
      expect(prismaMock.animal_has_races.findUnique).toHaveBeenCalledWith({
        where: {
          fk_animalid_fk_animalraceid: {
            fk_animalid: mockAnimalHasRace.fk_animalid,
            fk_animalraceid: mockAnimalHasRace.fk_animalraceid,
          },
        },
      });
    });

    it("sollte false zurückgeben, wenn die Verbindung nicht existiert", async () => {
      prismaMock.animal_has_races.findUnique.mockResolvedValue(null);

      const nonExistentRelation: animal_has_races = {
        fk_animalid: 999,
        fk_animalraceid: 999,
      };

      const result = await animalHasRacesService.exists(nonExistentRelation);

      expect(result).toBe(false);
    });
  });
});
