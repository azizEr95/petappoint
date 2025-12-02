import { prisma } from "../singletonPC";
import { AppointmentHasReview } from "../../generated/prisma";
import { ResourceNotFoundError } from "../exceptions/errors/ResourceNotFoundError";

export const appointmentHasReviewService = {
  async create(data: AppointmentHasReview): Promise<AppointmentHasReview> {
    return await prisma.appointmentHasReview.create({ data: data });
  },

  async getAll(): Promise<AppointmentHasReview[]> {
    return await prisma.appointmentHasReview.findMany();
  },

  async getById(fk_appointmentid: number, fk_reviewid: number): Promise<AppointmentHasReview> {
    const found = await prisma.appointmentHasReview.findUnique({
      where: {
        appointmentId_reviewId: {
          appointmentId: fk_appointmentid,
          reviewId: fk_reviewid,
        },
      },
    });

    if (!found)
      throw new ResourceNotFoundError(
        `Appointment with appointmentId ${fk_appointmentid} and reviewId ${fk_reviewid} does not have a review`,
        "ids",
        [fk_appointmentid, fk_reviewid]
      );

    return found;
  },

  async delete(fk_appointmentid: number, fk_reviewid: number): Promise<void> {
    await prisma.appointmentHasReview.delete({
      where: {
        appointmentId_reviewId: {
          appointmentId: fk_appointmentid,
          reviewId: fk_reviewid,
        },
      },
    });
  },
};
