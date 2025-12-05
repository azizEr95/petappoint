import { prisma } from "../../testConfig/integrationConfig";
import { animalRaceService } from "../../src/service/animalRaceService";

describe("animalRaceService", () => {
  let animalTypeId: number;

  beforeEach(async () => {
    const animalType = await prisma.animaltypes.create({ data: { name: "Hund" } });
    animalTypeId = animalType.id;
  });

  const getAnimalRaceData = () => ({
    name: "Golden Retriever",
    fk_animaltypeid: animalTypeId,
  });

  describe("create", () => {
    it("sollte eine neue Tierrasse erstellen", async () => {
      const result = await animalRaceService.create(getAnimalRaceData());

      expect(result.name).toBe("Golden Retriever");
      expect(result.fk_animaltypeid).toBe(animalTypeId);

      const dbRace = await prisma.animalraces.findUnique({ where: { id: result.id } });
      expect(dbRace).not.toBeNull();
      expect(dbRace?.name).toBe("Golden Retriever");
    });

    it("sollte einen Fehler werfen, wenn die Erstellung fehlschlägt", async () => {
      const invalidData = { name: "Test", fk_animaltypeid: 999999 };

      await expect(animalRaceService.create(invalidData)).rejects.toThrow();
    });
  });

  describe("getById", () => {
    it("sollte eine Tierrasse anhand der ID finden", async () => {
      const created = await prisma.animalraces.create({ data: getAnimalRaceData() });

      const result = await animalRaceService.getById(created.id);

      expect(result.id).toBe(created.id);
      expect(result.name).toBe("Golden Retriever");
    });

    it("sollte einen Fehler werfen, wenn die Tierrasse nicht gefunden wird", async () => {
      await expect(animalRaceService.getById(999999)).rejects.toThrow("Animal Kind not found with id: 999999");
    });
  });

  describe("getByName", () => {
    it("sollte eine Tierrasse anhand des Namens finden", async () => {
      await prisma.animalraces.create({ data: getAnimalRaceData() });

      const result = await animalRaceService.getByName("Golden Retriever");

      expect(result.name).toBe("Golden Retriever");
    });

    it("sollte einen Fehler werfen, wenn keine Tierrasse mit dem Namen gefunden wird", async () => {
      await expect(animalRaceService.getByName("Nichtexistent")).rejects.toThrow(
        "Animal Race not found with name: Nichtexistent"
      );
    });
  });

  describe("getAll", () => {
    it("sollte alle Tierrassen finden", async () => {
      await prisma.animalraces.create({ data: getAnimalRaceData() });
      await prisma.animalraces.create({ data: { name: "Labrador", fk_animaltypeid: animalTypeId } });

      const catType = await prisma.animaltypes.create({ data: { name: "Katze" } });
      await prisma.animalraces.create({ data: { name: "Perserkatze", fk_animaltypeid: catType.id } });

      const result = await animalRaceService.getAll();

      expect(result.length).toBe(3);
      expect(result.some(r => r.name === "Golden Retriever")).toBe(true);
      expect(result.some(r => r.name === "Labrador")).toBe(true);
      expect(result.some(r => r.name === "Perserkatze")).toBe(true);
    });

    it("sollte ein leeres Array zurückgeben, wenn keine Tierrassen existieren", async () => {
      const result = await animalRaceService.getAll();

      expect(result).toEqual([]);
      expect(result.length).toBe(0);
    });
  });

  describe("update", () => {
    it("sollte eine Tierrasse aktualisieren", async () => {
      const created = await prisma.animalraces.create({ data: getAnimalRaceData() });
      const updatedData = {
        ...created,
        name: "Golden Retriever (Standard)",
      };

      const result = await animalRaceService.update(updatedData);

      expect(result.name).toBe("Golden Retriever (Standard)");

      const dbRace = await prisma.animalraces.findUnique({ where: { id: created.id } });
      expect(dbRace?.name).toBe("Golden Retriever (Standard)");
    });

    it("sollte einen Fehler werfen, wenn keine ID für das Update angegeben wird", async () => {
      const raceWithoutId = { ...getAnimalRaceData(), id: undefined } as any;

      await expect(animalRaceService.update(raceWithoutId)).rejects.toThrow("ID is required for update");
    });

    it("sollte einen Fehler werfen, wenn die zu aktualisierende Tierrasse nicht existiert", async () => {
      const nonExistentRace = { ...getAnimalRaceData(), id: 999999 };

      await expect(animalRaceService.update(nonExistentRace)).rejects.toThrow();
    });
  });

  describe("delete", () => {
    it("sollte eine Tierrasse löschen", async () => {
      const created = await prisma.animalraces.create({ data: getAnimalRaceData() });

      await animalRaceService.delete(created.id);

      const dbRace = await prisma.animalraces.findUnique({ where: { id: created.id } });
      expect(dbRace).toBeNull();
    });

    it("sollte einen Fehler werfen, wenn die zu löschende Tierrasse nicht existiert", async () => {
      await expect(animalRaceService.delete(999999)).rejects.toThrow();
    });
  });
});
