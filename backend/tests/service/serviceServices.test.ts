import { prisma } from "../../testConfig/integrationConfig";
import { serviceService } from "../../src/service/serviceService";

describe("serviceService", () => {
  const serviceData = {
    name: "Allgemeine Untersuchung",
    priceincents: 50.0,
    fk_veterinarypracticeid: null,
  };

  describe("create", () => {
    it("sollte einen neuen Service erstellen", async () => {
      const result = await serviceService.create(serviceData);

      expect(result.name).toBe(serviceData.name);
      expect(result.priceincents).toBe(serviceData.priceincents);

      const dbService = await prisma.services.findUnique({ where: { id: result.id } });
      expect(dbService).not.toBeNull();
      expect(dbService?.name).toBe(serviceData.name);
    });

    it("sollte einen Fehler werfen, wenn die Erstellung fehlschlägt", async () => {
      const invalidData = { name: null } as any;

      await expect(serviceService.create(invalidData)).rejects.toThrow();
    });
  });

  describe("getById", () => {
    it("sollte einen Service anhand der ID finden", async () => {
      const created = await prisma.services.create({ data: serviceData });

      const result = await serviceService.getById(created.id);

      expect(result.id).toBe(created.id);
      expect(result.name).toBe(serviceData.name);
    });

    it("sollte einen Fehler werfen, wenn der Service nicht gefunden wird", async () => {
      await expect(serviceService.getById(999999)).rejects.toThrow("Service does not exist with id 999999");
    });
  });

  describe("getAll", () => {
    it("sollte alle Services finden", async () => {
      await prisma.services.create({ data: serviceData });
      await prisma.services.create({ data: { name: "Impfung", priceincents: 35.0, fk_veterinarypracticeid: null } });
      await prisma.services.create({ data: { name: "Zahnreinigung", priceincents: 75.0, fk_veterinarypracticeid: null } });

      const result = await serviceService.getAll();

      expect(result.length).toBe(3);
      expect(result.some(s => s.name === "Allgemeine Untersuchung")).toBe(true);
      expect(result.some(s => s.name === "Impfung")).toBe(true);
      expect(result.some(s => s.name === "Zahnreinigung")).toBe(true);
    });

    it("sollte ein leeres Array zurückgeben, wenn keine Services existieren", async () => {
      const result = await serviceService.getAll();

      expect(result).toEqual([]);
      expect(result.length).toBe(0);
    });
  });

  describe("update", () => {
    it("sollte einen Service aktualisieren", async () => {
      const created = await prisma.services.create({ data: serviceData });
      const updatedData = {
        ...created,
        name: "Allgemeine Untersuchung - Erweitert",
        priceincents: 60.0,
      };

      const result = await serviceService.update(updatedData);

      expect(result.name).toBe("Allgemeine Untersuchung - Erweitert");
      expect(result.priceincents).toBe(60.0);

      const dbService = await prisma.services.findUnique({ where: { id: created.id } });
      expect(dbService?.name).toBe("Allgemeine Untersuchung - Erweitert");
    });

    it("sollte einen Fehler werfen, wenn keine ID für das Update angegeben wird", async () => {
      const serviceWithoutId = { ...serviceData, id: undefined } as any;

      await expect(serviceService.update(serviceWithoutId)).rejects.toThrow("ID is required for update");
    });

    it("sollte einen Fehler werfen, wenn der zu aktualisierende Service nicht existiert", async () => {
      const nonExistentService = { ...serviceData, id: 999999 };

      await expect(serviceService.update(nonExistentService)).rejects.toThrow();
    });
  });

  describe("delete", () => {
    it("sollte einen Service löschen", async () => {
      const created = await prisma.services.create({ data: serviceData });

      await serviceService.delete(created.id);

      const dbService = await prisma.services.findUnique({ where: { id: created.id } });
      expect(dbService).toBeNull();
    });

    it("sollte einen Fehler werfen, wenn der zu löschende Service nicht existiert", async () => {
      await expect(serviceService.delete(999999)).rejects.toThrow();
    });
  });
});
