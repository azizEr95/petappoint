// WICHTIG: Zuerst den singleton importieren, damit das Mocking funktioniert
import { prismaMock } from "../../testConfig/mockConfig";
// Danach die Types importieren
import { addresses } from "../../generated/prisma";
// Dann den Service importieren
import { addressService } from "../../src/service/addressService";

describe("addressService", () => {
  // Test-Datenvorbereitung
  const mockAddress: addresses = {
    id: 1,
    street: "Musterstraße 123",
    citycode: "10115",
    city: "Berlin",
    country: "Deutschland",
    longitude: 13.404954,
    latitude: 52.520008,
  };

  describe("create", () => {
    it("sollte eine neue Adresse erstellen", async () => {
      prismaMock.addresses.create.mockResolvedValue(mockAddress);

      const result = await addressService.create(mockAddress);

      expect(result).toEqual(mockAddress);
      expect(prismaMock.addresses.create).toHaveBeenCalledWith({
        data: mockAddress,
      });
      expect(prismaMock.addresses.create).toHaveBeenCalledTimes(1);
    });

    it("sollte einen Fehler werfen, wenn die Erstellung fehlschlägt", async () => {
      const error = new Error("Database error");
      prismaMock.addresses.create.mockRejectedValue(error);

      await expect(addressService.create(mockAddress)).rejects.toThrow("Database error");
    });
  });

  describe("getById", () => {
    it("sollte eine Adresse anhand der ID finden", async () => {
      prismaMock.addresses.findUnique.mockResolvedValue(mockAddress);

      const result = await addressService.getById(1);

      expect(result).toEqual(mockAddress);
      expect(prismaMock.addresses.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
      });
    });

    it("sollte einen Fehler werfen, wenn die Adresse nicht gefunden wird", async () => {
      prismaMock.addresses.findUnique.mockResolvedValue(null);

      await expect(addressService.getById(999)).rejects.toThrow("Address with 999 does not exist");
    });
  });

  describe("getAll", () => {
    it("sollte alle Adressen finden", async () => {
      const mockAddresses = [
        mockAddress,
        {
          id: 2,
          street: "Alexanderplatz 1",
          citycode: "10178",
          city: "Berlin",
          country: "Deutschland",
          longitude: 13.413215,
          latitude: 52.521918,
        },
        {
          id: 3,
          street: "Kurfürstendamm 234",
          citycode: "10719",
          city: "Berlin",
          country: "Deutschland",
          longitude: 13.285034,
          latitude: 52.502314,
        },
      ];

      prismaMock.addresses.findMany.mockResolvedValue(mockAddresses);

      const result = await addressService.getAll();

      expect(result).toEqual(mockAddresses);
      expect(prismaMock.addresses.findMany).toHaveBeenCalledWith();
      expect(result.length).toBe(3);
    });

    it("sollte ein leeres Array zurückgeben, wenn keine Adressen existieren", async () => {
      prismaMock.addresses.findMany.mockResolvedValue([]);

      const result = await addressService.getAll();

      expect(result).toEqual([]);
      expect(result.length).toBe(0);
    });
  });

  describe("update", () => {
    it("sollte eine Adresse aktualisieren", async () => {
      const updatedAddress = {
        ...mockAddress,
        street: "Neue Straße 456",
        citycode: "10117",
      };

      prismaMock.addresses.update.mockResolvedValue(updatedAddress);

      const result = await addressService.update(updatedAddress);

      expect(result).toEqual(updatedAddress);
      expect(prismaMock.addresses.update).toHaveBeenCalledWith({
        where: { id: updatedAddress.id },
        data: updatedAddress,
      });
    });

    it("sollte einen Fehler werfen, wenn keine ID für das Update angegeben wird", async () => {
      const addressWithoutId = { ...mockAddress, id: undefined } as any;

      await expect(addressService.update(addressWithoutId)).rejects.toThrow("ID is required for update");
    });

    it("sollte einen Fehler werfen, wenn die zu aktualisierende Adresse nicht existiert", async () => {
      const error = new Error("Record to update not found");
      prismaMock.addresses.update.mockRejectedValue(error);

      await expect(addressService.update({ ...mockAddress, id: 999 })).rejects.toThrow("Record to update not found");
    });
  });

  describe("delete", () => {
    it("sollte eine Adresse löschen", async () => {
      prismaMock.addresses.delete.mockResolvedValue(mockAddress);

      await addressService.delete(1);

      expect(prismaMock.addresses.delete).toHaveBeenCalledWith({
        where: { id: 1 },
      });
      expect(prismaMock.addresses.delete).toHaveBeenCalledTimes(1);
    });

    it("sollte einen Fehler werfen, wenn die zu löschende Adresse nicht existiert", async () => {
      const error = new Error("Record to delete does not exist");
      prismaMock.addresses.delete.mockRejectedValue(error);

      await expect(addressService.delete(999)).rejects.toThrow("Record to delete does not exist");
    });
  });
});
