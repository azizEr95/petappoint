// WICHTIG: Zuerst den singleton importieren, damit das Mocking funktioniert
import { prismaMock } from "../../testConfig/mockConfig";
// Danach die Types importieren
import { animals } from "../../generated/prisma";
// Dann den Service importieren
import { animalService } from "../../src/service/animalService";

describe("animalService", () => {
  // Test-Datenvorbereitung
  const mockAnimal: animals = {
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
  };

  describe("create", () => {
    it("sollte ein neues Tier erstellen", async () => {
      prismaMock.animals.create.mockResolvedValue(mockAnimal);

      const result = await animalService.create(mockAnimal);

      expect(result).toEqual(mockAnimal);
      expect(prismaMock.animals.create).toHaveBeenCalledWith({
        data: {
          name: mockAnimal.name,
          dateofbirth: mockAnimal.dateofbirth,
          dateofbirthisexact: mockAnimal.dateofbirthisexact,
          weightingram: mockAnimal.weightingram,
          heightincm: mockAnimal.heightincm,
          timeofdeath: mockAnimal.timeofdeath,
          iscastrated: mockAnimal.iscastrated,
          lifestyle: mockAnimal.lifestyle,
          animalgroup: { connect: { id: mockAnimal.fk_animalgroupid } },
          animaltypes: { connect: { id: mockAnimal.fk_animaltypeid } },
        },
      });
      expect(prismaMock.animals.create).toHaveBeenCalledTimes(1);
    });

    it("sollte einen Fehler werfen, wenn die Erstellung fehlschlägt", async () => {
      const error = new Error("Database error");
      prismaMock.animals.create.mockRejectedValue(error);

      await expect(animalService.create(mockAnimal)).rejects.toThrow("Database error");
    });
  });

  describe("getById", () => {
    it("sollte ein Tier anhand der ID finden", async () => {
      prismaMock.animals.findUnique.mockResolvedValue(mockAnimal);

      const result = await animalService.getById(1);

      expect(result).toEqual(mockAnimal);
      expect(prismaMock.animals.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
      });
    });

    it("sollte einen Fehler werfen, wenn das Tier nicht gefunden wird", async () => {
      prismaMock.animals.findUnique.mockResolvedValue(null);

      await expect(animalService.getById(999)).rejects.toThrow("Animal not found with id: 999");
    });
  });

  describe("getByName", () => {
    it("sollte ein Tier anhand des Namens finden", async () => {
      prismaMock.animals.findFirst.mockResolvedValue(mockAnimal);

      const result = await animalService.getByName("Bello");

      expect(result).toEqual(mockAnimal);
      expect(prismaMock.animals.findFirst).toHaveBeenCalledWith({
        where: { name: "Bello" },
      });
    });

    it("sollte einen Fehler werfen, wenn kein Tier mit dem Namen gefunden wird", async () => {
      prismaMock.animals.findFirst.mockResolvedValue(null);

      await expect(animalService.getByName("Nichtexistent")).rejects.toThrow(
        "Animal not found with name: Nichtexistent"
      );
    });
  });

  describe("getAll", () => {
    it("sollte alle Tiere finden", async () => {
      const mockAnimals = [
        mockAnimal,
        {
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
        {
          id: 3,
          name: "Hoppel",
          dateofbirth: new Date("2022-01-10"),
          dateofbirthisexact: false,
          weightingram: 1200,
          heightincm: 15,
          timeofdeath: null,
          iscastrated: false,
          lifestyle: "indoor",
          fk_animaltypeid: 3,
          fk_animalgroupid: 1,
        },
      ];

      prismaMock.animals.findMany.mockResolvedValue(mockAnimals);

      const result = await animalService.getAll();

      expect(result).toEqual(mockAnimals);
      expect(prismaMock.animals.findMany).toHaveBeenCalledWith();
      expect(result.length).toBe(3);
    });

    it("sollte ein leeres Array zurückgeben, wenn keine Tiere existieren", async () => {
      prismaMock.animals.findMany.mockResolvedValue([]);

      const result = await animalService.getAll();

      expect(result).toEqual([]);
      expect(result.length).toBe(0);
    });
  });

  describe("update", () => {
    it("sollte ein Tier aktualisieren", async () => {
      const updatedAnimal = {
        ...mockAnimal,
        name: "Bello Junior",
        weightingram: 18000,
      };

      prismaMock.animals.update.mockResolvedValue(updatedAnimal);

      const result = await animalService.update(updatedAnimal);

      expect(result).toEqual(updatedAnimal);
      expect(prismaMock.animals.update).toHaveBeenCalledWith({
        where: { id: updatedAnimal.id },
        data: updatedAnimal,
      });
    });

    it("sollte einen Fehler werfen, wenn keine ID für das Update angegeben wird", async () => {
      const animalWithoutId = { ...mockAnimal, id: undefined } as any;

      await expect(animalService.update(animalWithoutId)).rejects.toThrow("ID is required for update");
    });

    it("sollte einen Fehler werfen, wenn das zu aktualisierende Tier nicht existiert", async () => {
      const error = new Error("Record to update not found");
      prismaMock.animals.update.mockRejectedValue(error);

      await expect(animalService.update({ ...mockAnimal, id: 999 })).rejects.toThrow("Record to update not found");
    });
  });

  describe("delete", () => {
    it("sollte ein Tier löschen", async () => {
      prismaMock.animals.delete.mockResolvedValue(mockAnimal);

      await animalService.delete(1);

      expect(prismaMock.animals.delete).toHaveBeenCalledWith({
        where: { id: 1 },
      });
      expect(prismaMock.animals.delete).toHaveBeenCalledTimes(1);
    });

    it("sollte einen Fehler werfen, wenn das zu löschende Tier nicht existiert", async () => {
      const error = new Error("Record to delete does not exist");
      prismaMock.animals.delete.mockRejectedValue(error);

      await expect(animalService.delete(999)).rejects.toThrow("Record to delete does not exist");
    });
  });
});
