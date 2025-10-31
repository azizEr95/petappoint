import { prisma } from "../singletonPC";
import { invoices } from "../../generated/prisma";

export const invoiceService = {
  async create(data: invoices): Promise<invoices> {
    return await prisma.invoices.create({ data: data });
  },

  async getById(id: number): Promise<invoices> {
    const found = await prisma.invoices.findUnique({ where: { id } });

    if (!found) throw new Error(`Invoice with id ${id} does not exist`);

    return found;
  },

  async getByAppointmentId(fk_appointmentid: number): Promise<invoices[]> {
    return await prisma.invoices.findMany({ where: { fk_appointmentid } });
  },

  async getAll(): Promise<invoices[]> {
    return await prisma.invoices.findMany();
  },

  async update(data: invoices): Promise<invoices> {
    if (!data.id) throw new Error("ID is required for update");

    return await prisma.invoices.update({ where: { id: data.id }, data: data });
  },

  async delete(id: number): Promise<void> {
    await prisma.invoices.delete({ where: { id } });
  },
};
