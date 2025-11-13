// WICHTIG: Zuerst den singleton importieren, damit das Mocking funktioniert
import { prismaMock } from "../../testConfig/mockConfig";
// Danach die Types importieren
import { animal_has_vaccination } from "../../generated/prisma";
// Dann den Service importieren
import { animalHasVaccinationService } from "../../src/service/animalHasVaccinationService";

describe("animalHasVaccinationService", () => {
  // Test-Datenvorbereitung
  const mockAnimalHasVaccination: animal_has_vaccination = {
    id: 1,
    dateofvaccination: new Date("2024-01-15"),
    fk_animalid: 1,
    fk_vaccinationid: 1,
  };

  const mockAnimalHasVaccinationWithRelations = {
    id: 1,
    dateofvaccination: new Date("2024-01-15"),
    fk_animalid: 1,
    fk_vaccinationid: 1,
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
    vaccinations: {
      id: 1,
      name: "Tollwut",
    },
  };

  describe("create", () => {
    it("sollte eine neue Tier-Impfung-Verbindung erstellen", async () => {
      prismaMock.animal_has_vaccination.create.mockResolvedValue(mockAnimalHasVaccination);

      const result = await animalHasVaccinationService.create(mockAnimalHasVaccination);

      expect(result).toEqual(mockAnimalHasVaccination);
      expect(prismaMock.animal_has_vaccination.create).toHaveBeenCalledWith({
        data: mockAnimalHasVaccination,
      });
      expect(prismaMock.animal_has_vaccination.create).toHaveBeenCalledTimes(1);
    });

    it("sollte einen Fehler werfen, wenn die Erstellung fehlschlägt", async () => {
      const error = new Error("Database error");
      prismaMock.animal_has_vaccination.create.mockRejectedValue(error);

      await expect(animalHasVaccinationService.create(mockAnimalHasVaccination)).rejects.toThrow("Database error");
    });
  });

  describe("getAnimalByVacinationId", () => {
    it("sollte alle Tiere mit einer bestimmten Impfung finden", async () => {
      const mockAnimalVaccinations = [
        mockAnimalHasVaccinationWithRelations,
        {
          id: 2,
          dateofvaccination: new Date("2024-02-20"),
          fk_animalid: 2,
          fk_vaccinationid: 1,
          animals: {
            id: 2,
            name: "Mieze",
            dateofbirth: new Date("2021-03-20"),
            dateofbirthisexact: true,
            weightingram: 4500,
            heightincm: 25,
            timeofdeath: null,
            iscastrated: true,
            lifestyle: "indoor",
            fk_animaltypeid: 2,
            fk_animalgroupid: 1,
          },
          vaccinations: {
            id: 1,
            name: "Tollwut",
          },
        },
      ];

      prismaMock.animal_has_vaccination.findMany.mockResolvedValue(mockAnimalVaccinations as any);

      const result = await animalHasVaccinationService.getAnimalByVacinationId(1);

      expect(result).toEqual([
        {
          animal: mockAnimalVaccinations[0].animals,
          vaccinations: mockAnimalVaccinations[0].vaccinations,
        },
        {
          animal: mockAnimalVaccinations[1].animals,
          vaccinations: mockAnimalVaccinations[1].vaccinations,
        },
      ]);
      expect(prismaMock.animal_has_vaccination.findMany).toHaveBeenCalledWith({
        where: { fk_vaccinationid: 1 },
        include: {
          animals: true,
          vaccinations: true,
        },
      });
    });

    it("sollte ein leeres Array zurückgeben, wenn keine Tiere mit dieser Impfung existieren", async () => {
      prismaMock.animal_has_vaccination.findMany.mockResolvedValue([]);

      const result = await animalHasVaccinationService.getAnimalByVacinationId(999);

      expect(result).toEqual([]);
      expect(result.length).toBe(0);
    });
  });

  describe("getVaccinationByAnimalId", () => {
    it("sollte alle Impfungen eines Tieres finden", async () => {
      const mockVaccinationAnimals = [
        mockAnimalHasVaccinationWithRelations,
        {
          id: 2,
          dateofvaccination: new Date("2024-03-10"),
          fk_animalid: 1,
          fk_vaccinationid: 2,
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
          vaccinations: {
            id: 2,
            name: "Staupe",
          },
        },
      ];

      prismaMock.animal_has_vaccination.findMany.mockResolvedValue(mockVaccinationAnimals as any);

      const result = await animalHasVaccinationService.getVaccinationByAnimalId(1);

      expect(result).toEqual([
        {
          animal: mockVaccinationAnimals[0].animals,
          vaccinations: mockVaccinationAnimals[0].vaccinations,
        },
        {
          animal: mockVaccinationAnimals[1].animals,
          vaccinations: mockVaccinationAnimals[1].vaccinations,
        },
      ]);
      expect(prismaMock.animal_has_vaccination.findMany).toHaveBeenCalledWith({
        where: { fk_animalid: 1 },
        include: {
          animals: true,
          vaccinations: true,
        },
      });
    });

    it("sollte ein leeres Array zurückgeben, wenn das Tier keine Impfungen hat", async () => {
      prismaMock.animal_has_vaccination.findMany.mockResolvedValue([]);

      const result = await animalHasVaccinationService.getVaccinationByAnimalId(999);

      expect(result).toEqual([]);
      expect(result.length).toBe(0);
    });
  });

  describe("delete", () => {
    it("sollte eine Tier-Impfung-Verbindung löschen", async () => {
      prismaMock.animal_has_vaccination.delete.mockResolvedValue(mockAnimalHasVaccination);

      await animalHasVaccinationService.delete(mockAnimalHasVaccination);

      expect(prismaMock.animal_has_vaccination.delete).toHaveBeenCalledWith({
        where: { id: mockAnimalHasVaccination.id },
      });
      expect(prismaMock.animal_has_vaccination.delete).toHaveBeenCalledTimes(1);
    });

    it("sollte einen Fehler werfen, wenn die zu löschende Verbindung nicht existiert", async () => {
      const error = new Error("Record to delete does not exist");
      prismaMock.animal_has_vaccination.delete.mockRejectedValue(error);

      const nonExistentRelation: animal_has_vaccination = {
        id: 999,
        dateofvaccination: new Date(),
        fk_animalid: 999,
        fk_vaccinationid: 999,
      };

      await expect(animalHasVaccinationService.delete(nonExistentRelation)).rejects.toThrow(
        "Record to delete does not exist"
      );
    });
  });

  describe("exists", () => {
    it("sollte true zurückgeben, wenn die Verbindung existiert", async () => {
      prismaMock.animal_has_vaccination.findUnique.mockResolvedValue(mockAnimalHasVaccination);

      const result = await animalHasVaccinationService.exists(mockAnimalHasVaccination);

      expect(result).toBe(true);
      expect(prismaMock.animal_has_vaccination.findUnique).toHaveBeenCalledWith({
        where: { id: mockAnimalHasVaccination.id },
      });
    });

    it("sollte false zurückgeben, wenn die Verbindung nicht existiert", async () => {
      prismaMock.animal_has_vaccination.findUnique.mockResolvedValue(null);

      const nonExistentRelation: animal_has_vaccination = {
        id: 999,
        dateofvaccination: new Date(),
        fk_animalid: 999,
        fk_vaccinationid: 999,
      };

      const result = await animalHasVaccinationService.exists(nonExistentRelation);

      expect(result).toBe(false);
    });
  });
});
