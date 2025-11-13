// WICHTIG: Zuerst den singleton importieren, damit das Mocking funktioniert
import { prismaMock } from "../../testConfig/mockConfig";
// Danach die Types importieren
import { reviews } from "../../generated/prisma";
// Dann den Service importieren
import { reviewService } from "../../src/service/reviewsService";

describe("reviewService", () => {
  // Test-Datenvorbereitung
  const mockReview: reviews = {
    id: 1,
    contentment: 1,
    waitingtime: 1,
    kindness: 1,
    servicequality: 1,
    price: 1,
    comment: null,
  };

  describe("create", () => {
    it("sollte eine neue Bewertung erstellen", async () => {
      prismaMock.reviews.create.mockResolvedValue(mockReview);

      const result = await reviewService.create(mockReview);

      expect(result).toEqual(mockReview);
      expect(prismaMock.reviews.create).toHaveBeenCalledWith({
        data: mockReview,
      });
      expect(prismaMock.reviews.create).toHaveBeenCalledTimes(1);
    });

    it("sollte einen Fehler werfen, wenn die Erstellung fehlschlägt", async () => {
      const error = new Error("Database error");
      prismaMock.reviews.create.mockRejectedValue(error);

      await expect(reviewService.create(mockReview)).rejects.toThrow("Database error");
    });
  });

  describe("getById", () => {
    it("sollte eine Bewertung anhand der ID finden", async () => {
      prismaMock.reviews.findUnique.mockResolvedValue(mockReview);

      const result = await reviewService.getById(1);

      expect(result).toEqual(mockReview);
      expect(prismaMock.reviews.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
      });
    });

    it("sollte einen Fehler werfen, wenn die Bewertung nicht gefunden wird", async () => {
      prismaMock.reviews.findUnique.mockResolvedValue(null);

      await expect(reviewService.getById(999)).rejects.toThrow("Review does not exist with id 999");
    });
  });

  describe("getAll", () => {
    it("sollte alle Bewertungen finden", async () => {
      const mockReviews = [
        mockReview,
        {
          id: 2,
          contentment: 2,
          waitingtime: 2,
          kindness: 2,
          servicequality: 2,
          price: 2,
          comment: null,
        },
        {
          id: 3,
          contentment: 3,
          waitingtime: 3,
          kindness: 3,
          servicequality: 3,
          price: 3,
          comment: null,
        },
      ];

      prismaMock.reviews.findMany.mockResolvedValue(mockReviews);

      const result = await reviewService.getAll();

      expect(result).toEqual(mockReviews);
      expect(prismaMock.reviews.findMany).toHaveBeenCalledWith();
      expect(result.length).toBe(3);
    });

    it("sollte ein leeres Array zurückgeben, wenn keine Bewertungen existieren", async () => {
      prismaMock.reviews.findMany.mockResolvedValue([]);

      const result = await reviewService.getAll();

      expect(result).toEqual([]);
      expect(result.length).toBe(0);
    });
  });

  describe("update", () => {
    it("sollte eine Bewertung aktualisieren", async () => {
      const updatedReview = {
        ...mockReview,
        comment: "Sehr freundlicher Tierarzt. Mein Hund wurde gut behandelt.",
      };

      prismaMock.reviews.update.mockResolvedValue(updatedReview);

      const result = await reviewService.update(updatedReview);

      expect(result).toEqual(updatedReview);
      expect(prismaMock.reviews.update).toHaveBeenCalledWith({
        where: { id: updatedReview.id },
        data: updatedReview,
      });
    });

    it("sollte einen Fehler werfen, wenn keine ID für das Update angegeben wird", async () => {
      const reviewWithoutId = { ...mockReview, id: undefined } as any;

      await expect(reviewService.update(reviewWithoutId)).rejects.toThrow("ID is required for update");
    });

    it("sollte einen Fehler werfen, wenn die zu aktualisierende Bewertung nicht existiert", async () => {
      const error = new Error("Record to update not found");
      prismaMock.reviews.update.mockRejectedValue(error);

      await expect(reviewService.update({ ...mockReview, id: 999 })).rejects.toThrow("Record to update not found");
    });
  });

  describe("delete", () => {
    it("sollte eine Bewertung löschen", async () => {
      prismaMock.reviews.delete.mockResolvedValue(mockReview);

      await reviewService.delete(1);

      expect(prismaMock.reviews.delete).toHaveBeenCalledWith({
        where: { id: 1 },
      });
      expect(prismaMock.reviews.delete).toHaveBeenCalledTimes(1);
    });

    it("sollte einen Fehler werfen, wenn die zu löschende Bewertung nicht existiert", async () => {
      const error = new Error("Record to delete does not exist");
      prismaMock.reviews.delete.mockRejectedValue(error);

      await expect(reviewService.delete(999)).rejects.toThrow("Record to delete does not exist");
    });
  });
});
