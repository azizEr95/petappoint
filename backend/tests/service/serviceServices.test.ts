// WICHTIG: Zuerst den singleton importieren, damit das Mocking funktioniert
import { prismaMock } from "../../testConfig/mockConfig";
// Danach die Types importieren
import { services } from "../../generated/prisma";
// Dann den Service importieren
import { serviceService } from "../../src/service/serviceService";

describe("serviceService", () => {
  // Test-Datenvorbereitung
  const mockService: services = {
    id: 1,
    name: "Allgemeine Untersuchung",
    priceincents: 50.0,
    fk_veterinarypracticeid: null,
  };

  describe("create", () => {
    it("sollte einen neuen Service erstellen", async () => {
      prismaMock.services.create.mockResolvedValue(mockService);

      const result = await serviceService.create(mockService);

      expect(result).toEqual(mockService);
      expect(prismaMock.services.create).toHaveBeenCalledWith({
        data: mockService,
      });
      expect(prismaMock.services.create).toHaveBeenCalledTimes(1);
    });

    it("sollte einen Fehler werfen, wenn die Erstellung fehlschlägt", async () => {
      const error = new Error("Database error");
      prismaMock.services.create.mockRejectedValue(error);

      await expect(serviceService.create(mockService)).rejects.toThrow("Database error");
    });
  });

  describe("getById", () => {
    it("sollte einen Service anhand der ID finden", async () => {
      prismaMock.services.findUnique.mockResolvedValue(mockService);

      const result = await serviceService.getById(1);

      expect(result).toEqual(mockService);
      expect(prismaMock.services.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
      });
    });

    it("sollte einen Fehler werfen, wenn der Service nicht gefunden wird", async () => {
      prismaMock.services.findUnique.mockResolvedValue(null);

      await expect(serviceService.getById(999)).rejects.toThrow("Service does not exist with id 999");
    });
  });

  describe("getAll", () => {
    it("sollte alle Services finden", async () => {
      const mockServices = [
        mockService,
        {
          id: 2,
          name: "Impfung",
          price: 35.0,
        },
        {
          id: 3,
          name: "Zahnreinigung",
          price: 75.0,
        },
      ];

      prismaMock.services.findMany.mockResolvedValue(mockServices);

      const result = await serviceService.getAll();

      expect(result).toEqual(mockServices);
      expect(prismaMock.services.findMany).toHaveBeenCalledWith();
      expect(result.length).toBe(3);
    });

    it("sollte ein leeres Array zurückgeben, wenn keine Services existieren", async () => {
      prismaMock.services.findMany.mockResolvedValue([]);

      const result = await serviceService.getAll();

      expect(result).toEqual([]);
      expect(result.length).toBe(0);
    });
  });

  describe("update", () => {
    it("sollte einen Service aktualisieren", async () => {
      const updatedService = {
        ...mockService,
        name: "Allgemeine Untersuchung - Erweitert",
        price: 60.0,
      };

      prismaMock.services.update.mockResolvedValue(updatedService);

      const result = await serviceService.update(updatedService);

      expect(result).toEqual(updatedService);
      expect(prismaMock.services.update).toHaveBeenCalledWith({
        where: { id: updatedService.id },
        data: updatedService,
      });
    });

    it("sollte einen Fehler werfen, wenn keine ID für das Update angegeben wird", async () => {
      const serviceWithoutId = { ...mockService, id: undefined } as any;

      await expect(serviceService.update(serviceWithoutId)).rejects.toThrow("ID is required for update");
    });

    it("sollte einen Fehler werfen, wenn der zu aktualisierende Service nicht existiert", async () => {
      const error = new Error("Record to update not found");
      prismaMock.services.update.mockRejectedValue(error);

      await expect(serviceService.update({ ...mockService, id: 999 })).rejects.toThrow("Record to update not found");
    });
  });

  describe("delete", () => {
    it("sollte einen Service löschen", async () => {
      prismaMock.services.delete.mockResolvedValue(mockService);

      await serviceService.delete(1);

      expect(prismaMock.services.delete).toHaveBeenCalledWith({
        where: { id: 1 },
      });
      expect(prismaMock.services.delete).toHaveBeenCalledTimes(1);
    });

    it("sollte einen Fehler werfen, wenn der zu löschende Service nicht existiert", async () => {
      const error = new Error("Record to delete does not exist");
      prismaMock.services.delete.mockRejectedValue(error);

      await expect(serviceService.delete(999)).rejects.toThrow("Record to delete does not exist");
    });
  });
});
