// WICHTIG: Zuerst den singleton importieren, damit das Mocking funktioniert
import { prismaMock } from "../../testConfig/singleton";
// Danach die Types importieren
import { appointment_has_review } from "../../generated/prisma";
// Dann den Service importieren
import { appointmentHasReviewService } from "../../src/service/appointmentHasReviewService";

describe("appointmentHasReviewService", () => {
  const mockAppointmentHasReview: appointment_has_review = {
    fk_appointmentid: 1,
    fk_reviewid: 1,
  };

  describe("create", () => {
    it("sollte eine neue Appointment-Review-Verbindung erstellen", async () => {
      prismaMock.appointment_has_review.create.mockResolvedValue(mockAppointmentHasReview);

      const result = await appointmentHasReviewService.create(mockAppointmentHasReview);

      expect(result).toEqual(mockAppointmentHasReview);
      expect(prismaMock.appointment_has_review.create).toHaveBeenCalledWith({
        data: mockAppointmentHasReview,
      });
      expect(prismaMock.appointment_has_review.create).toHaveBeenCalledTimes(1);
    });

    it("sollte einen Fehler werfen, wenn die Erstellung fehlschlägt", async () => {
      const error = new Error("Database error");
      prismaMock.appointment_has_review.create.mockRejectedValue(error);

      await expect(appointmentHasReviewService.create(mockAppointmentHasReview)).rejects.toThrow("Database error");
    });
  });

  describe("getById", () => {
    it("sollte eine Appointment-Review-Verbindung anhand von Appointment-ID und Review-ID finden", async () => {
      prismaMock.appointment_has_review.findUnique.mockResolvedValue(mockAppointmentHasReview);

      const result = await appointmentHasReviewService.getById(1, 1);

      expect(result).toEqual(mockAppointmentHasReview);
      expect(prismaMock.appointment_has_review.findUnique).toHaveBeenCalledWith({
        where: {
          fk_appointmentid_fk_reviewid: {
            fk_appointmentid: 1,
            fk_reviewid: 1,
          },
        },
      });
    });

    it("sollte einen Fehler werfen, wenn die Verbindung nicht gefunden wird", async () => {
      prismaMock.appointment_has_review.findUnique.mockResolvedValue(null);

      await expect(appointmentHasReviewService.getById(999, 999)).rejects.toThrow(
        "Appointment with appointmentId 999 and reviewId 999 does not have a review"
      );
    });
  });

  describe("getAll", () => {
    it("sollte alle Appointment-Review-Verbindungen finden", async () => {
      const mockAppointmentHasReviews = [
        mockAppointmentHasReview,
        {
          fk_appointmentid: 2,
          fk_reviewid: 2,
        },
        {
          fk_appointmentid: 3,
          fk_reviewid: 3,
        },
      ];

      prismaMock.appointment_has_review.findMany.mockResolvedValue(mockAppointmentHasReviews);

      const result = await appointmentHasReviewService.getAll();

      expect(result).toEqual(mockAppointmentHasReviews);
      expect(prismaMock.appointment_has_review.findMany).toHaveBeenCalledWith();
      expect(result.length).toBe(3);
    });

    it("sollte ein leeres Array zurückgeben, wenn keine Verbindungen existieren", async () => {
      prismaMock.appointment_has_review.findMany.mockResolvedValue([]);

      const result = await appointmentHasReviewService.getAll();

      expect(result).toEqual([]);
      expect(result.length).toBe(0);
    });
  });

  describe("delete", () => {
    it("sollte eine Appointment-Review-Verbindung löschen", async () => {
      prismaMock.appointment_has_review.delete.mockResolvedValue(mockAppointmentHasReview);

      await appointmentHasReviewService.delete(1, 1);

      expect(prismaMock.appointment_has_review.delete).toHaveBeenCalledWith({
        where: {
          fk_appointmentid_fk_reviewid: {
            fk_appointmentid: 1,
            fk_reviewid: 1,
          },
        },
      });
      expect(prismaMock.appointment_has_review.delete).toHaveBeenCalledTimes(1);
    });

    it("sollte einen Fehler werfen, wenn die zu löschende Verbindung nicht existiert", async () => {
      const error = new Error("Record to delete does not exist");
      prismaMock.appointment_has_review.delete.mockRejectedValue(error);

      await expect(appointmentHasReviewService.delete(999, 999)).rejects.toThrow("Record to delete does not exist");
    });
  });
});
