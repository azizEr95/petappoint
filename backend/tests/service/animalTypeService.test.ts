import { prisma } from "../../testConfig/integrationConfig";
import { animalTypeService } from "../../src/service/animalTypeService";

describe("animalTypeService", () => {
  const animalTypeData = {
    name: "Hund",
  };

  describe("create", () => {
    it("sollte einen neuen Tiertyp erstellen", async () => {
      const result = await animalTypeService.create(animalTypeData);

      expect(result.name).toBe(animalTypeData.name);

      const dbType = await prisma.animaltypes.findUnique({ where: { id: result.id } });
      expect(dbType).not.toBeNull();
      expect(dbType?.name).toBe(animalTypeData.name);
    });

    it("sollte einen Fehler werfen, wenn die Erstellung fehlschlägt", async () => {
      const invalidData = { name: null } as any;

      await expect(animalTypeService.create(invalidData)).rejects.toThrow();
    });
  });

  describe("getById", () => {
    it("sollte einen Tiertyp anhand der ID finden", async () => {
      const created = await prisma.animaltypes.create({ data: animalTypeData });

      const result = await animalTypeService.getById(created.id);

      expect(result.id).toBe(created.id);
      expect(result.name).toBe(animalTypeData.name);
    });

    it("sollte einen Fehler werfen, wenn der Tiertyp nicht gefunden wird", async () => {
      await expect(animalTypeService.getById(999999)).rejects.toThrow("Animal Type not found with id: 999999");
    });
  });

  describe("getByName", () => {
    it("sollte einen Tiertyp anhand des Namens finden", async () => {
      await prisma.animaltypes.create({ data: animalTypeData });

      const result = await animalTypeService.getByName("Hund");

      expect(result.name).toBe("Hund");
    });

    it("sollte einen Fehler werfen, wenn kein Tiertyp mit dem Namen gefunden wird", async () => {
      await expect(animalTypeService.getByName("Nichtexistent")).rejects.toThrow(
        "Animal Type not found with name: Nichtexistent"
      );
    });
  });

  describe("getAll", () => {
    it("sollte alle Tiertypen finden", async () => {
      await prisma.animaltypes.create({ data: animalTypeData });
      await prisma.animaltypes.create({ data: { name: "Katze" } });
      await prisma.animaltypes.create({ data: { name: "Hase" } });

      const result = await animalTypeService.getAll();

      expect(result.length).toBe(3);
      expect(result.some(t => t.name === "Hund")).toBe(true);
      expect(result.some(t => t.name === "Katze")).toBe(true);
      expect(result.some(t => t.name === "Hase")).toBe(true);
    });

    it("sollte ein leeres Array zurückgeben, wenn keine Tiertypen existieren", async () => {
      const result = await animalTypeService.getAll();

      expect(result).toEqual([]);
      expect(result.length).toBe(0);
    });
  });

  describe("update", () => {
    it("sollte einen Tiertyp aktualisieren", async () => {
      const created = await prisma.animaltypes.create({ data: animalTypeData });
      const updatedData = {
        ...created,
        name: "Hundeartiger",
      };

      const result = await animalTypeService.update(updatedData);

      expect(result.name).toBe("Hundeartiger");

      const dbType = await prisma.animaltypes.findUnique({ where: { id: created.id } });
      expect(dbType?.name).toBe("Hundeartiger");
    });

    it("sollte einen Fehler werfen, wenn keine ID für das Update angegeben wird", async () => {
      const typeWithoutId = { ...animalTypeData, id: undefined } as any;

      await expect(animalTypeService.update(typeWithoutId)).rejects.toThrow("ID is required for update");
    });

    it("sollte einen Fehler werfen, wenn der zu aktualisierende Tiertyp nicht existiert", async () => {
      const nonExistentType = { ...animalTypeData, id: 999999 };

      await expect(animalTypeService.update(nonExistentType)).rejects.toThrow();
    });
  });

  describe("delete", () => {
    it("sollte einen Tiertyp löschen", async () => {
      const created = await prisma.animaltypes.create({ data: animalTypeData });

      await animalTypeService.delete(created.id);

      const dbType = await prisma.animaltypes.findUnique({ where: { id: created.id } });
      expect(dbType).toBeNull();
    });

    it("sollte einen Fehler werfen, wenn der zu löschende Tiertyp nicht existiert", async () => {
      await expect(animalTypeService.delete(999999)).rejects.toThrow();
    });
  });
});
