import { prisma } from "../singletonPC";
import { invoice_has_service } from "../../generated/prisma";

export const invoiceHasServiceService = {
  async create(data: invoice_has_service): Promise<invoice_has_service> {
    return await prisma.invoice_has_service.create({ data: data });
  },

  async getAll(): Promise<invoice_has_service[]> {
    return await prisma.invoice_has_service.findMany({
      include: {
        invoices: true,
        services: true,
      },
    });
  },

  async getById(id: number): Promise<invoice_has_service> {
    const found = await prisma.invoice_has_service.findUnique({
      where: { id },
      include: {
        invoices: true,
        services: true,
      },
    });

    if (!found) throw new Error(`invoice has service does not exist with id ${id} `);

    return found;
  },

  async getByInvoiceId(fk_invoiceid: number): Promise<invoice_has_service[]> {
    return await prisma.invoice_has_service.findMany({
      where: { fk_invoiceid },
      include: { services: true },
    });
  },

  async getByServiceId(fk_serviceid: number): Promise<invoice_has_service[]> {
    return await prisma.invoice_has_service.findMany({
      where: { fk_serviceid },
      include: { invoices: true },
    });
  },

  async update(data: invoice_has_service): Promise<invoice_has_service> {
    if (!data.id) throw new Error("ID is required for update");

    return await prisma.invoice_has_service.update({ where: { id: data.id }, data: data });
  },

  async delete(id: number): Promise<void> {
    await prisma.invoice_has_service.delete({ where: { id } });
  },
};
