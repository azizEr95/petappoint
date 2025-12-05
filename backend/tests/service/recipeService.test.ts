import { prisma } from "../../testConfig/integrationConfig";
import { recipeService } from "../../src/service/recipesService";

describe("recipeService", () => {
  let animalId: number;
  let medicationId: number;

  beforeEach(async () => {
    const animalType = await prisma.animaltypes.create({ data: { name: "Hund" } });
    const animal = await prisma.animals.create({
      data: {
        name: "Bello",
        dateofbirth: new Date("2020-01-01"),
        fk_animaltypeid: animalType.id,
      },
    });
    animalId = animal.id;

    const medication = await prisma.medications.create({ data: { name: "Amoxicillin" } });
    medicationId = medication.id;
  });

  const getRecipeData = () => ({
    fk_animalid: animalId,
    fk_medicationid: medicationId,
    starting: new Date("2025-01-15"),
    enddate: new Date("2025-01-22"),
    instructions: "2x täglich 1 Tablette mit Futter geben",
  });

  describe("create", () => {
    it("sollte ein neues Rezept erstellen", async () => {
      const result = await recipeService.create(getRecipeData());

      expect(result.fk_animalid).toBe(animalId);
      expect(result.fk_medicationid).toBe(medicationId);
      expect(result.instructions).toBe("2x täglich 1 Tablette mit Futter geben");

      const dbRecipe = await prisma.recipes.findUnique({ where: { id: result.id } });
      expect(dbRecipe).not.toBeNull();
      expect(dbRecipe?.instructions).toBe("2x täglich 1 Tablette mit Futter geben");
    });

    it("sollte einen Fehler werfen, wenn die Erstellung fehlschlägt", async () => {
      const invalidData = { fk_animalid: 999999, fk_medicationid: medicationId } as any;

      await expect(recipeService.create(invalidData)).rejects.toThrow();
    });
  });

  describe("getById", () => {
    it("sollte ein Rezept anhand der ID finden", async () => {
      const created = await prisma.recipes.create({ data: getRecipeData() });

      const result = await recipeService.getById(created.id);

      expect(result.id).toBe(created.id);
      expect(result.fk_animalid).toBe(animalId);
    });

    it("sollte einen Fehler werfen, wenn das Rezept nicht gefunden wird", async () => {
      await expect(recipeService.getById(999999)).rejects.toThrow("Recipe does not exist with id 999999");
    });
  });

  describe("getAll", () => {
    it("sollte alle Rezepte finden", async () => {
      await prisma.recipes.create({ data: getRecipeData() });
      await prisma.recipes.create({
        data: {
          fk_animalid: animalId,
          fk_medicationid: medicationId,
          starting: new Date("2025-01-20"),
          enddate: new Date("2025-01-25"),
          instructions: "1x täglich nach Bedarf bei Schmerzen",
        },
      });

      const result = await recipeService.getAll();

      expect(result.length).toBe(2);
      expect(result.some(r => r.instructions === "2x täglich 1 Tablette mit Futter geben")).toBe(true);
      expect(result.some(r => r.instructions === "1x täglich nach Bedarf bei Schmerzen")).toBe(true);
    });

    it("sollte ein leeres Array zurückgeben, wenn keine Rezepte existieren", async () => {
      const result = await recipeService.getAll();

      expect(result).toEqual([]);
      expect(result.length).toBe(0);
    });
  });

  describe("update", () => {
    it("sollte ein Rezept aktualisieren", async () => {
      const created = await prisma.recipes.create({ data: getRecipeData() });
      const updatedData = {
        ...created,
        enddate: new Date("2025-01-29"),
        instructions: "3x täglich 1 Tablette mit Futter geben - Dosierung erhöht",
      };

      const result = await recipeService.update(updatedData);

      expect(result.instructions).toBe("3x täglich 1 Tablette mit Futter geben - Dosierung erhöht");

      const dbRecipe = await prisma.recipes.findUnique({ where: { id: created.id } });
      expect(dbRecipe?.instructions).toBe("3x täglich 1 Tablette mit Futter geben - Dosierung erhöht");
    });

    it("sollte einen Fehler werfen, wenn keine ID für das Update angegeben wird", async () => {
      const recipeWithoutId = { ...getRecipeData(), id: undefined } as any;

      await expect(recipeService.update(recipeWithoutId)).rejects.toThrow("ID is required for update");
    });

    it("sollte einen Fehler werfen, wenn das zu aktualisierende Rezept nicht existiert", async () => {
      const nonExistentRecipe = { ...getRecipeData(), id: 999999 };

      await expect(recipeService.update(nonExistentRecipe)).rejects.toThrow();
    });
  });

  describe("delete", () => {
    it("sollte ein Rezept löschen", async () => {
      const created = await prisma.recipes.create({ data: getRecipeData() });

      await recipeService.delete(created.id);

      const dbRecipe = await prisma.recipes.findUnique({ where: { id: created.id } });
      expect(dbRecipe).toBeNull();
    });

    it("sollte einen Fehler werfen, wenn das zu löschende Rezept nicht existiert", async () => {
      await expect(recipeService.delete(999999)).rejects.toThrow();
    });
  });
});
