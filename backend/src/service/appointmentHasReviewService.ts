import { prisma } from "../singletonPC";
import { appointment_has_review } from "../../generated/prisma";
import { ResourceNotFoundError } from "../exceptions/errors/ResourceNotFoundError";

export const appointmentHasReviewService = {
  async create(data: appointment_has_review): Promise<appointment_has_review> {
    return await prisma.appointment_has_review.create({ data: data });
  },

  async getAll(): Promise<appointment_has_review[]> {
    return await prisma.appointment_has_review.findMany();
  },

  async getById(fk_appointmentid: number, fk_reviewid: number): Promise<appointment_has_review> {
    const found = await prisma.appointment_has_review.findUnique({
      where: {
        fk_appointmentid_fk_reviewid: {
          fk_appointmentid,
          fk_reviewid,
        },
      },
    });

    if (!found)
      throw new ResourceNotFoundError(
        `Appointment with appointmentId ${fk_appointmentid} and reviewId ${fk_reviewid} does not have a review`, 'ids', [fk_appointmentid, fk_reviewid]
      );

    return found;
  },

  async delete(fk_appointmentid: number, fk_reviewid: number): Promise<void> {
    await prisma.appointment_has_review.delete({
      where: {
        fk_appointmentid_fk_reviewid: {
          fk_appointmentid,
          fk_reviewid,
        },
      },
    });
  },
};
