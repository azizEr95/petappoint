// WICHTIG: Zuerst den singleton importieren, damit das Mocking funktioniert
import { prismaMock } from "../../testConfig/mockConfig";
// Danach die Types importieren
import { invoice_has_service, paymentstatus } from "../../generated/prisma";
// Dann den Service importieren
import { invoiceHasServiceService } from "../../src/service/invoicedHasServiceService";

describe("invoiceHasServiceService", () => {
  // Test-Datenvorbereitung
  const mockInvoiceHasService: invoice_has_service = {
    id: 1,
    fk_invoiceid: 1,
    fk_serviceid: 1,
    quantity: 1,
    discount: 0.0,
  };

  const mockInvoiceHasServiceWithRelations = {
    id: 1,
    fk_invoiceid: 1,
    fk_serviceid: 1,
    quantity: 1,
    discount: 0.0,
    invoices: {
      id: 1,
      status: paymentstatus.unpaid,
      priceincents: 5000,
      discount: 0.0,
      fk_appointmentid: 1,
    },
    services: {
      id: 1,
      name: "Allgemeine Untersuchung",
      description: "Routineuntersuchung des Tieres",
      price: 50.0,
    },
  };

  describe("create", () => {
    it("sollte eine neue Rechnung-Service-Verbindung erstellen", async () => {
      prismaMock.invoice_has_service.create.mockResolvedValue(mockInvoiceHasService);

      const result = await invoiceHasServiceService.create(mockInvoiceHasService);

      expect(result).toEqual(mockInvoiceHasService);
      expect(prismaMock.invoice_has_service.create).toHaveBeenCalledWith({
        data: mockInvoiceHasService,
      });
      expect(prismaMock.invoice_has_service.create).toHaveBeenCalledTimes(1);
    });

    it("sollte einen Fehler werfen, wenn die Erstellung fehlschlägt", async () => {
      const error = new Error("Database error");
      prismaMock.invoice_has_service.create.mockRejectedValue(error);

      await expect(invoiceHasServiceService.create(mockInvoiceHasService)).rejects.toThrow("Database error");
    });
  });

  describe("getAll", () => {
    it("sollte alle Rechnung-Service-Verbindungen mit Relationen finden", async () => {
      const mockInvoiceHasServices = [
        mockInvoiceHasServiceWithRelations,
        {
          id: 2,
          fk_invoiceid: 1,
          fk_serviceid: 2,
          quantity: 2,
          discount: 0.1,
          invoices: {
            id: 1,
            status: paymentstatus.unpaid,
            priceincents: 5000,
            discount: 0.0,
            fk_appointmentid: 1,
          },
          services: {
            id: 2,
            name: "Impfung",
            description: "Schutzimpfung für das Tier",
            price: 35.0,
          },
        },
      ];

      prismaMock.invoice_has_service.findMany.mockResolvedValue(mockInvoiceHasServices as any);

      const result = await invoiceHasServiceService.getAll();

      expect(result).toEqual(mockInvoiceHasServices);
      expect(prismaMock.invoice_has_service.findMany).toHaveBeenCalledWith({
        include: {
          invoices: true,
          services: true,
        },
      });
      expect(result.length).toBe(2);
    });

    it("sollte ein leeres Array zurückgeben, wenn keine Verbindungen existieren", async () => {
      prismaMock.invoice_has_service.findMany.mockResolvedValue([]);

      const result = await invoiceHasServiceService.getAll();

      expect(result).toEqual([]);
      expect(result.length).toBe(0);
    });
  });

  describe("getById", () => {
    it("sollte eine Rechnung-Service-Verbindung anhand der ID mit Relationen finden", async () => {
      prismaMock.invoice_has_service.findUnique.mockResolvedValue(mockInvoiceHasServiceWithRelations as any);

      const result = await invoiceHasServiceService.getById(1);

      expect(result).toEqual(mockInvoiceHasServiceWithRelations);
      expect(prismaMock.invoice_has_service.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
        include: {
          invoices: true,
          services: true,
        },
      });
    });

    it("sollte einen Fehler werfen, wenn die Verbindung nicht gefunden wird", async () => {
      prismaMock.invoice_has_service.findUnique.mockResolvedValue(null);

      await expect(invoiceHasServiceService.getById(999)).rejects.toThrow(
        "invoice has service does not exist with id 999"
      );
    });
  });

  describe("getByInvoiceId", () => {
    it("sollte alle Services einer Rechnung finden", async () => {
      const mockServices = [
        {
          id: 1,
          fk_invoiceid: 1,
          fk_serviceid: 1,
          quantity: 1,
          discount: 0.0,
          services: {
            id: 1,
            name: "Allgemeine Untersuchung",
            description: "Routineuntersuchung des Tieres",
            price: 50.0,
          },
        },
        {
          id: 2,
          fk_invoiceid: 1,
          fk_serviceid: 2,
          quantity: 2,
          discount: 0.1,
          services: {
            id: 2,
            name: "Impfung",
            description: "Schutzimpfung für das Tier",
            price: 35.0,
          },
        },
      ];

      prismaMock.invoice_has_service.findMany.mockResolvedValue(mockServices as any);

      const result = await invoiceHasServiceService.getByInvoiceId(1);

      expect(result).toEqual(mockServices);
      expect(prismaMock.invoice_has_service.findMany).toHaveBeenCalledWith({
        where: { fk_invoiceid: 1 },
        include: { services: true },
      });
      expect(result.length).toBe(2);
    });

    it("sollte ein leeres Array zurückgeben, wenn die Rechnung keine Services hat", async () => {
      prismaMock.invoice_has_service.findMany.mockResolvedValue([]);

      const result = await invoiceHasServiceService.getByInvoiceId(999);

      expect(result).toEqual([]);
      expect(result.length).toBe(0);
    });
  });

  describe("getByServiceId", () => {
    it("sollte alle Rechnungen finden, die einen bestimmten Service enthalten", async () => {
      const mockInvoices = [
        {
          id: 1,
          fk_invoiceid: 1,
          fk_serviceid: 1,
          quantity: 1,
          discount: 0.0,
          invoices: {
            id: 1,
            status: paymentstatus.unpaid,
            priceincents: 5000,
            discount: 0.0,
            fk_appointmentid: 1,
          },
        },
        {
          id: 3,
          fk_invoiceid: 2,
          fk_serviceid: 1,
          quantity: 1,
          discount: 0.05,
          invoices: {
            id: 2,
            status: paymentstatus.paid,
            priceincents: 4750,
            discount: 0.0,
            fk_appointmentid: 2,
          },
        },
      ];

      prismaMock.invoice_has_service.findMany.mockResolvedValue(mockInvoices as any);

      const result = await invoiceHasServiceService.getByServiceId(1);

      expect(result).toEqual(mockInvoices);
      expect(prismaMock.invoice_has_service.findMany).toHaveBeenCalledWith({
        where: { fk_serviceid: 1 },
        include: { invoices: true },
      });
      expect(result.length).toBe(2);
    });

    it("sollte ein leeres Array zurückgeben, wenn der Service in keiner Rechnung enthalten ist", async () => {
      prismaMock.invoice_has_service.findMany.mockResolvedValue([]);

      const result = await invoiceHasServiceService.getByServiceId(999);

      expect(result).toEqual([]);
      expect(result.length).toBe(0);
    });
  });

  describe("update", () => {
    it("sollte eine Rechnung-Service-Verbindung aktualisieren", async () => {
      const updatedInvoiceHasService = {
        ...mockInvoiceHasService,
        quantity: 3,
        discount: 0.15,
      };

      prismaMock.invoice_has_service.update.mockResolvedValue(updatedInvoiceHasService);

      const result = await invoiceHasServiceService.update(updatedInvoiceHasService);

      expect(result).toEqual(updatedInvoiceHasService);
      expect(prismaMock.invoice_has_service.update).toHaveBeenCalledWith({
        where: { id: updatedInvoiceHasService.id },
        data: updatedInvoiceHasService,
      });
    });

    it("sollte einen Fehler werfen, wenn keine ID für das Update angegeben wird", async () => {
      const invoiceHasServiceWithoutId = { ...mockInvoiceHasService, id: undefined } as any;

      await expect(invoiceHasServiceService.update(invoiceHasServiceWithoutId)).rejects.toThrow(
        "ID is required for update"
      );
    });

    it("sollte einen Fehler werfen, wenn die zu aktualisierende Verbindung nicht existiert", async () => {
      const error = new Error("Record to update not found");
      prismaMock.invoice_has_service.update.mockRejectedValue(error);

      await expect(invoiceHasServiceService.update({ ...mockInvoiceHasService, id: 999 })).rejects.toThrow(
        "Record to update not found"
      );
    });
  });

  describe("delete", () => {
    it("sollte eine Rechnung-Service-Verbindung löschen", async () => {
      prismaMock.invoice_has_service.delete.mockResolvedValue(mockInvoiceHasService);

      await invoiceHasServiceService.delete(1);

      expect(prismaMock.invoice_has_service.delete).toHaveBeenCalledWith({
        where: { id: 1 },
      });
      expect(prismaMock.invoice_has_service.delete).toHaveBeenCalledTimes(1);
    });

    it("sollte einen Fehler werfen, wenn die zu löschende Verbindung nicht existiert", async () => {
      const error = new Error("Record to delete does not exist");
      prismaMock.invoice_has_service.delete.mockRejectedValue(error);

      await expect(invoiceHasServiceService.delete(999)).rejects.toThrow("Record to delete does not exist");
    });
  });
});
