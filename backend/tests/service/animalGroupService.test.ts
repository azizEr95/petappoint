import { prisma } from "../../testConfig/integrationConfig";
import { animalGroupService } from "../../src/service/animalGroupService";

describe("animalGroupService", () => {
  const animalGroupData = {
    name: "Haustiere",
  };

  describe("create", () => {
    it("sollte eine neue Tiergruppe erstellen", async () => {
      const result = await animalGroupService.create(animalGroupData);

      expect(result.name).toBe(animalGroupData.name);

      const dbGroup = await prisma.animalgroup.findUnique({ where: { id: result.id } });
      expect(dbGroup).not.toBeNull();
      expect(dbGroup?.name).toBe(animalGroupData.name);
    });

    it("sollte einen Fehler werfen, wenn die Erstellung fehlschlägt", async () => {
      const invalidData = { name: null } as any;

      await expect(animalGroupService.create(invalidData)).rejects.toThrow();
    });
  });

  describe("getById", () => {
    it("sollte eine Tiergruppe anhand der ID finden", async () => {
      const created = await prisma.animalgroup.create({ data: animalGroupData });

      const result = await animalGroupService.getById(created.id);

      expect(result.id).toBe(created.id);
      expect(result.name).toBe(animalGroupData.name);
    });

    it("sollte einen Fehler werfen, wenn die Tiergruppe nicht gefunden wird", async () => {
      await expect(animalGroupService.getById(999999)).rejects.toThrow("Animal group with ID 999999 does not exist");
    });
  });

  describe("getAll", () => {
    it("sollte alle Tiergruppen finden", async () => {
      await prisma.animalgroup.create({ data: animalGroupData });
      await prisma.animalgroup.create({ data: { name: "Nutztiere" } });
      await prisma.animalgroup.create({ data: { name: "Wildtiere" } });

      const result = await animalGroupService.getAll();

      expect(result.length).toBe(3);
      expect(result.some(g => g.name === "Haustiere")).toBe(true);
      expect(result.some(g => g.name === "Nutztiere")).toBe(true);
      expect(result.some(g => g.name === "Wildtiere")).toBe(true);
    });

    it("sollte ein leeres Array zurückgeben, wenn keine Tiergruppen existieren", async () => {
      const result = await animalGroupService.getAll();

      expect(result).toEqual([]);
      expect(result.length).toBe(0);
    });
  });

  describe("update", () => {
    it("sollte eine Tiergruppe aktualisieren", async () => {
      const created = await prisma.animalgroup.create({ data: animalGroupData });
      const updatedData = {
        ...created,
        name: "Heimtiere",
      };

      const result = await animalGroupService.update(updatedData);

      expect(result.name).toBe("Heimtiere");

      const dbGroup = await prisma.animalgroup.findUnique({ where: { id: created.id } });
      expect(dbGroup?.name).toBe("Heimtiere");
    });

    it("sollte einen Fehler werfen, wenn keine ID für das Update angegeben wird", async () => {
      const groupWithoutId = { ...animalGroupData, id: undefined } as any;

      await expect(animalGroupService.update(groupWithoutId)).rejects.toThrow("ID is required for update");
    });

    it("sollte einen Fehler werfen, wenn die zu aktualisierende Tiergruppe nicht existiert", async () => {
      const nonExistentGroup = { ...animalGroupData, id: 999999 };

      await expect(animalGroupService.update(nonExistentGroup)).rejects.toThrow();
    });
  });

  describe("delete", () => {
    it("sollte eine Tiergruppe löschen", async () => {
      const created = await prisma.animalgroup.create({ data: animalGroupData });

      await animalGroupService.delete(created.id);

      const dbGroup = await prisma.animalgroup.findUnique({ where: { id: created.id } });
      expect(dbGroup).toBeNull();
    });

    it("sollte einen Fehler werfen, wenn die zu löschende Tiergruppe nicht existiert", async () => {
      await expect(animalGroupService.delete(999999)).rejects.toThrow();
    });
  });
});
