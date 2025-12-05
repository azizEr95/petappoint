import { prisma } from "../../testConfig/integrationConfig";
import { reviewService } from "../../src/service/reviewsService";

describe("reviewService", () => {
  const reviewData = {
    contentment: 1,
    waitingtime: 1,
    kindness: 1,
    servicequality: 1,
    price: 1,
    comment: null,
  };

  describe("create", () => {
    it("sollte eine neue Bewertung erstellen", async () => {
      const result = await reviewService.create(reviewData);

      expect(result.contentment).toBe(reviewData.contentment);
      expect(result.kindness).toBe(reviewData.kindness);

      const dbReview = await prisma.reviews.findUnique({ where: { id: result.id } });
      expect(dbReview).not.toBeNull();
      expect(dbReview?.contentment).toBe(reviewData.contentment);
    });

    it("sollte einen Fehler werfen, wenn die Erstellung fehlschlägt", async () => {
      const invalidData = { contentment: null } as any;

      await expect(reviewService.create(invalidData)).rejects.toThrow();
    });
  });

  describe("getById", () => {
    it("sollte eine Bewertung anhand der ID finden", async () => {
      const created = await prisma.reviews.create({ data: reviewData });

      const result = await reviewService.getById(created.id);

      expect(result.id).toBe(created.id);
      expect(result.contentment).toBe(reviewData.contentment);
    });

    it("sollte einen Fehler werfen, wenn die Bewertung nicht gefunden wird", async () => {
      await expect(reviewService.getById(999999)).rejects.toThrow("Review does not exist with id 999999");
    });
  });

  describe("getAll", () => {
    it("sollte alle Bewertungen finden", async () => {
      await prisma.reviews.create({ data: reviewData });
      await prisma.reviews.create({ data: { ...reviewData, contentment: 2, waitingtime: 2, kindness: 2, servicequality: 2, price: 2 } });
      await prisma.reviews.create({ data: { ...reviewData, contentment: 3, waitingtime: 3, kindness: 3, servicequality: 3, price: 3 } });

      const result = await reviewService.getAll();

      expect(result.length).toBe(3);
      expect(result.some(r => r.contentment === 1)).toBe(true);
      expect(result.some(r => r.contentment === 2)).toBe(true);
      expect(result.some(r => r.contentment === 3)).toBe(true);
    });

    it("sollte ein leeres Array zurückgeben, wenn keine Bewertungen existieren", async () => {
      const result = await reviewService.getAll();

      expect(result).toEqual([]);
      expect(result.length).toBe(0);
    });
  });

  describe("update", () => {
    it("sollte eine Bewertung aktualisieren", async () => {
      const created = await prisma.reviews.create({ data: reviewData });
      const updatedData = {
        ...created,
        comment: "Sehr freundlicher Tierarzt. Mein Hund wurde gut behandelt.",
      };

      const result = await reviewService.update(updatedData);

      expect(result.comment).toBe("Sehr freundlicher Tierarzt. Mein Hund wurde gut behandelt.");

      const dbReview = await prisma.reviews.findUnique({ where: { id: created.id } });
      expect(dbReview?.comment).toBe("Sehr freundlicher Tierarzt. Mein Hund wurde gut behandelt.");
    });

    it("sollte einen Fehler werfen, wenn keine ID für das Update angegeben wird", async () => {
      const reviewWithoutId = { ...reviewData, id: undefined } as any;

      await expect(reviewService.update(reviewWithoutId)).rejects.toThrow("ID is required for update");
    });

    it("sollte einen Fehler werfen, wenn die zu aktualisierende Bewertung nicht existiert", async () => {
      const nonExistentReview = { ...reviewData, id: 999999 };

      await expect(reviewService.update(nonExistentReview)).rejects.toThrow();
    });
  });

  describe("delete", () => {
    it("sollte eine Bewertung löschen", async () => {
      const created = await prisma.reviews.create({ data: reviewData });

      await reviewService.delete(created.id);

      const dbReview = await prisma.reviews.findUnique({ where: { id: created.id } });
      expect(dbReview).toBeNull();
    });

    it("sollte einen Fehler werfen, wenn die zu löschende Bewertung nicht existiert", async () => {
      await expect(reviewService.delete(999999)).rejects.toThrow();
    });
  });
});
