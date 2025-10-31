// WICHTIG: Zuerst den singleton importieren, damit das Mocking funktioniert
import { prismaMock } from "../../testConfig/singleton";
// Danach die Types importieren
import { recipes } from "../../generated/prisma";
// Dann den Service importieren
import { recipeService } from "../../src/service/recipesService";

describe("recipeService", () => {
  // Test-Datenvorbereitung
  const mockRecipe: recipes = {
    id: 1,
    fk_animalid: 1,
    fk_medicationid: 1,
    starting: new Date("2025-01-15"),
    enddate: new Date("2025-01-22"),
    instructions: "2x täglich 1 Tablette mit Futter geben",
  };

  describe("create", () => {
    it("sollte ein neues Rezept erstellen", async () => {
      prismaMock.recipes.create.mockResolvedValue(mockRecipe);

      const result = await recipeService.create(mockRecipe);

      expect(result).toEqual(mockRecipe);
      expect(prismaMock.recipes.create).toHaveBeenCalledWith({
        data: mockRecipe,
      });
      expect(prismaMock.recipes.create).toHaveBeenCalledTimes(1);
    });

    it("sollte einen Fehler werfen, wenn die Erstellung fehlschlägt", async () => {
      const error = new Error("Database error");
      prismaMock.recipes.create.mockRejectedValue(error);

      await expect(recipeService.create(mockRecipe)).rejects.toThrow("Database error");
    });
  });

  describe("getById", () => {
    it("sollte ein Rezept anhand der ID finden", async () => {
      prismaMock.recipes.findUnique.mockResolvedValue(mockRecipe);

      const result = await recipeService.getById(1);

      expect(result).toEqual(mockRecipe);
      expect(prismaMock.recipes.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
      });
    });

    it("sollte einen Fehler werfen, wenn das Rezept nicht gefunden wird", async () => {
      prismaMock.recipes.findUnique.mockResolvedValue(null);

      await expect(recipeService.getById(999)).rejects.toThrow("Recipe does not exist with id 999");
    });
  });

  describe("getAll", () => {
    it("sollte alle Rezepte finden", async () => {
      const mockRecipes = [
        mockRecipe,
        {
          id: 2,
          fk_animalid: 2,
          fk_medicationid: 2,
          starting: new Date("2025-01-20"),
          enddate: new Date("2025-01-25"),
          instructions: "1x täglich nach Bedarf bei Schmerzen",
        },
        {
          id: 3,
          fk_animalid: 1,
          fk_medicationid: 3,
          starting: new Date("2025-02-01"),
          enddate: new Date("2025-02-11"),
          instructions: "3x täglich mit Futter, nach Mahlzeiten",
        },
      ];

      prismaMock.recipes.findMany.mockResolvedValue(mockRecipes);

      const result = await recipeService.getAll();

      expect(result).toEqual(mockRecipes);
      expect(prismaMock.recipes.findMany).toHaveBeenCalledWith();
      expect(result.length).toBe(3);
    });

    it("sollte ein leeres Array zurückgeben, wenn keine Rezepte existieren", async () => {
      prismaMock.recipes.findMany.mockResolvedValue([]);

      const result = await recipeService.getAll();

      expect(result).toEqual([]);
      expect(result.length).toBe(0);
    });
  });

  describe("update", () => {
    it("sollte ein Rezept aktualisieren", async () => {
      const updatedRecipe = {
        ...mockRecipe,
        enddate: new Date("2025-01-29"),
        instructions: "3x täglich 1 Tablette mit Futter geben - Dosierung erhöht",
      };

      prismaMock.recipes.update.mockResolvedValue(updatedRecipe);

      const result = await recipeService.update(updatedRecipe);

      expect(result).toEqual(updatedRecipe);
      expect(prismaMock.recipes.update).toHaveBeenCalledWith({
        where: { id: updatedRecipe.id },
        data: updatedRecipe,
      });
    });

    it("sollte einen Fehler werfen, wenn keine ID für das Update angegeben wird", async () => {
      const recipeWithoutId = { ...mockRecipe, id: undefined } as any;

      await expect(recipeService.update(recipeWithoutId)).rejects.toThrow("ID is required for update");
    });

    it("sollte einen Fehler werfen, wenn das zu aktualisierende Rezept nicht existiert", async () => {
      const error = new Error("Record to update not found");
      prismaMock.recipes.update.mockRejectedValue(error);

      await expect(recipeService.update({ ...mockRecipe, id: 999 })).rejects.toThrow("Record to update not found");
    });
  });

  describe("delete", () => {
    it("sollte ein Rezept löschen", async () => {
      prismaMock.recipes.delete.mockResolvedValue(mockRecipe);

      await recipeService.delete(1);

      expect(prismaMock.recipes.delete).toHaveBeenCalledWith({
        where: { id: 1 },
      });
      expect(prismaMock.recipes.delete).toHaveBeenCalledTimes(1);
    });

    it("sollte einen Fehler werfen, wenn das zu löschende Rezept nicht existiert", async () => {
      const error = new Error("Record to delete does not exist");
      prismaMock.recipes.delete.mockRejectedValue(error);

      await expect(recipeService.delete(999)).rejects.toThrow("Record to delete does not exist");
    });
  });
});
