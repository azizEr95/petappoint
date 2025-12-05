import { prisma } from "../../testConfig/integrationConfig";
import { addressService } from "../../src/service/addressService";

describe("addressService", () => {
  const addressData = {
    street: "Musterstraße 123",
    citycode: "10115",
    city: "Berlin",
    country: "Deutschland",
    longitude: 13.404954,
    latitude: 52.520008,
  };

  describe("create", () => {
    it("sollte eine neue Adresse erstellen", async () => {
      const result = await addressService.create(addressData);

      expect(result.street).toBe(addressData.street);
      expect(result.city).toBe(addressData.city);

      const dbAddress = await prisma.addresses.findUnique({ where: { id: result.id } });
      expect(dbAddress).not.toBeNull();
      expect(dbAddress?.street).toBe(addressData.street);
    });

    it("sollte einen Fehler werfen, wenn die Erstellung fehlschlägt", async () => {
      const invalidData = { ...addressData, street: null } as any;

      await expect(addressService.create(invalidData)).rejects.toThrow();
    });
  });

  describe("getById", () => {
    it("sollte eine Adresse anhand der ID finden", async () => {
      const created = await prisma.addresses.create({ data: addressData });

      const result = await addressService.getById(created.id);

      expect(result.id).toBe(created.id);
      expect(result.street).toBe(addressData.street);
    });

    it("sollte einen Fehler werfen, wenn die Adresse nicht gefunden wird", async () => {
      await expect(addressService.getById(999999)).rejects.toThrow("Address with 999999 does not exist");
    });
  });

  describe("getAll", () => {
    it("sollte alle Adressen finden", async () => {
      await prisma.addresses.create({ data: addressData });
      await prisma.addresses.create({
        data: {
          street: "Alexanderplatz 1",
          citycode: "10178",
          city: "Berlin",
          country: "Deutschland",
          longitude: 13.413215,
          latitude: 52.521918,
        },
      });
      await prisma.addresses.create({
        data: {
          street: "Kurfürstendamm 234",
          citycode: "10719",
          city: "Berlin",
          country: "Deutschland",
          longitude: 13.285034,
          latitude: 52.502314,
        },
      });

      const result = await addressService.getAll();

      expect(result.length).toBe(3);
      expect(result.some(a => a.street === addressData.street)).toBe(true);
    });

    it("sollte ein leeres Array zurückgeben, wenn keine Adressen existieren", async () => {
      const result = await addressService.getAll();

      expect(result).toEqual([]);
      expect(result.length).toBe(0);
    });
  });

  describe("update", () => {
    it("sollte eine Adresse aktualisieren", async () => {
      const created = await prisma.addresses.create({ data: addressData });
      const updatedData = {
        ...created,
        street: "Neue Straße 456",
        citycode: "10117",
      };

      const result = await addressService.update(updatedData);

      expect(result.street).toBe("Neue Straße 456");
      expect(result.citycode).toBe("10117");

      const dbAddress = await prisma.addresses.findUnique({ where: { id: created.id } });
      expect(dbAddress?.street).toBe("Neue Straße 456");
    });

    it("sollte einen Fehler werfen, wenn keine ID für das Update angegeben wird", async () => {
      const addressWithoutId = { ...addressData, id: undefined } as any;

      await expect(addressService.update(addressWithoutId)).rejects.toThrow("ID is required for update");
    });

    it("sollte einen Fehler werfen, wenn die zu aktualisierende Adresse nicht existiert", async () => {
      const nonExistentAddress = { ...addressData, id: 999999 };

      await expect(addressService.update(nonExistentAddress)).rejects.toThrow();
    });
  });

  describe("delete", () => {
    it("sollte eine Adresse löschen", async () => {
      const created = await prisma.addresses.create({ data: addressData });

      await addressService.delete(created.id);

      const dbAddress = await prisma.addresses.findUnique({ where: { id: created.id } });
      expect(dbAddress).toBeNull();
    });

    it("sollte einen Fehler werfen, wenn die zu löschende Adresse nicht existiert", async () => {
      await expect(addressService.delete(999999)).rejects.toThrow();
    });
  });
});
