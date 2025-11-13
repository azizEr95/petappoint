// WICHTIG: Zuerst den singleton importieren, damit das Mocking funktioniert
import { prismaMock } from "../../testConfig/mockConfig";
// Danach die Types importieren
import { invoices, paymentstatus } from "../../generated/prisma";
// Dann den Service importieren
import { invoiceService } from "../../src/service/invoicesService";

describe("invoiceService", () => {
  // Test-Datenvorbereitung
  const mockInvoice: invoices = {
    id: 1,
    status: paymentstatus.unpaid,
    priceincents: 5000, // 50.00 EUR
    discount: 0.0,
    fk_appointmentid: 1,
  };

  describe("create", () => {
    it("sollte eine neue Rechnung erstellen", async () => {
      prismaMock.invoices.create.mockResolvedValue(mockInvoice);

      const result = await invoiceService.create(mockInvoice);

      expect(result).toEqual(mockInvoice);
      expect(prismaMock.invoices.create).toHaveBeenCalledWith({
        data: mockInvoice,
      });
      expect(prismaMock.invoices.create).toHaveBeenCalledTimes(1);
    });

    it("sollte einen Fehler werfen, wenn die Erstellung fehlschlägt", async () => {
      const error = new Error("Database error");
      prismaMock.invoices.create.mockRejectedValue(error);

      await expect(invoiceService.create(mockInvoice)).rejects.toThrow("Database error");
    });
  });

  describe("getById", () => {
    it("sollte eine Rechnung anhand der ID finden", async () => {
      prismaMock.invoices.findUnique.mockResolvedValue(mockInvoice);

      const result = await invoiceService.getById(1);

      expect(result).toEqual(mockInvoice);
      expect(prismaMock.invoices.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
      });
    });

    it("sollte einen Fehler werfen, wenn die Rechnung nicht gefunden wird", async () => {
      prismaMock.invoices.findUnique.mockResolvedValue(null);

      await expect(invoiceService.getById(999)).rejects.toThrow("Invoice with id 999 does not exist");
    });
  });

  describe("getByAppointmentId", () => {
    it("sollte alle Rechnungen eines Termins finden", async () => {
      const mockInvoices = [
        mockInvoice,
        {
          id: 2,
          status: paymentstatus.paid,
          priceincents: 3500, // 35.00 EUR
          discount: 0.1, // 10% Rabatt
          fk_appointmentid: 1,
        },
      ];

      prismaMock.invoices.findMany.mockResolvedValue(mockInvoices);

      const result = await invoiceService.getByAppointmentId(1);

      expect(result).toEqual(mockInvoices);
      expect(prismaMock.invoices.findMany).toHaveBeenCalledWith({
        where: { fk_appointmentid: 1 },
      });
      expect(result.length).toBe(2);
    });

    it("sollte ein leeres Array zurückgeben, wenn keine Rechnungen für den Termin existieren", async () => {
      prismaMock.invoices.findMany.mockResolvedValue([]);

      const result = await invoiceService.getByAppointmentId(999);

      expect(result).toEqual([]);
      expect(result.length).toBe(0);
    });
  });

  describe("getAll", () => {
    it("sollte alle Rechnungen finden", async () => {
      const mockInvoices = [
        mockInvoice,
        {
          id: 2,
          status: paymentstatus.paid,
          priceincents: 7500, // 75.00 EUR
          discount: 0.0,
          fk_appointmentid: 2,
        },
        {
          id: 3,
          status: paymentstatus.cancelled,
          priceincents: 4000, // 40.00 EUR
          discount: 0.05, // 5% Rabatt
          fk_appointmentid: 3,
        },
      ];

      prismaMock.invoices.findMany.mockResolvedValue(mockInvoices);

      const result = await invoiceService.getAll();

      expect(result).toEqual(mockInvoices);
      expect(prismaMock.invoices.findMany).toHaveBeenCalledWith();
      expect(result.length).toBe(3);
    });

    it("sollte ein leeres Array zurückgeben, wenn keine Rechnungen existieren", async () => {
      prismaMock.invoices.findMany.mockResolvedValue([]);

      const result = await invoiceService.getAll();

      expect(result).toEqual([]);
      expect(result.length).toBe(0);
    });
  });

  describe("update", () => {
    it("sollte eine Rechnung aktualisieren", async () => {
      const updatedInvoice = {
        ...mockInvoice,
        status: paymentstatus.paid,
        discount: 0.1, // 10% Rabatt hinzugefügt
      };

      prismaMock.invoices.update.mockResolvedValue(updatedInvoice);

      const result = await invoiceService.update(updatedInvoice);

      expect(result).toEqual(updatedInvoice);
      expect(prismaMock.invoices.update).toHaveBeenCalledWith({
        where: { id: updatedInvoice.id },
        data: updatedInvoice,
      });
    });

    it("sollte einen Fehler werfen, wenn keine ID für das Update angegeben wird", async () => {
      const invoiceWithoutId = { ...mockInvoice, id: undefined } as any;

      await expect(invoiceService.update(invoiceWithoutId)).rejects.toThrow("ID is required for update");
    });

    it("sollte einen Fehler werfen, wenn die zu aktualisierende Rechnung nicht existiert", async () => {
      const error = new Error("Record to update not found");
      prismaMock.invoices.update.mockRejectedValue(error);

      await expect(invoiceService.update({ ...mockInvoice, id: 999 })).rejects.toThrow("Record to update not found");
    });
  });

  describe("delete", () => {
    it("sollte eine Rechnung löschen", async () => {
      prismaMock.invoices.delete.mockResolvedValue(mockInvoice);

      await invoiceService.delete(1);

      expect(prismaMock.invoices.delete).toHaveBeenCalledWith({
        where: { id: 1 },
      });
      expect(prismaMock.invoices.delete).toHaveBeenCalledTimes(1);
    });

    it("sollte einen Fehler werfen, wenn die zu löschende Rechnung nicht existiert", async () => {
      const error = new Error("Record to delete does not exist");
      prismaMock.invoices.delete.mockRejectedValue(error);

      await expect(invoiceService.delete(999)).rejects.toThrow("Record to delete does not exist");
    });
  });
});
