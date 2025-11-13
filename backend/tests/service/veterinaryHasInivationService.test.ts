// WICHTIG: Zuerst den singleton importieren, damit das Mocking funktioniert
import { prismaMock } from "../../testConfig/mockConfig";
// Danach die Types importieren
import { veterinary_has_invitation } from "../../generated/prisma";
// Dann den Service importieren
import { veterinaryHasInvitationService } from "../../src/service/veterinaryHasInivationService";

describe("veterinaryHasInvitationService", () => {
  // Test-Datenvorbereitung
  const mockInvitation: veterinary_has_invitation = {
    fk_veterinaryid: 1,
    fk_veterinarypracticeid: 1,
    dateofinvitation: new Date(2025, 10, 28, 14, 34, 0, 0),
  };

  describe("create", () => {
    it("sollte eine neue Einladung erstellen", async () => {
      // 1. VORBEREITUNG: Mock sagen, was er zurückgeben soll
      prismaMock.veterinary_has_invitation.create.mockResolvedValue(mockInvitation);

      // 2. AUSFÜHRUNG: Service aufrufen
      const result = await veterinaryHasInvitationService.create(mockInvitation);

      // 3. ÜBERPRÜFUNG: Ist das Ergebnis korrekt?
      expect(result).toEqual(mockInvitation);
      expect(prismaMock.veterinary_has_invitation.create).toHaveBeenCalledWith({
        data: mockInvitation,
      });
      expect(prismaMock.veterinary_has_invitation.create).toHaveBeenCalledTimes(1);
    });

    it("sollte einen Fehler werfen, wenn die Erstellung fehlschlägt", async () => {
      const error = new Error("Database error");
      prismaMock.veterinary_has_invitation.create.mockRejectedValue(error);

      await expect(veterinaryHasInvitationService.create(mockInvitation)).rejects.toThrow("Database error");
    });
  });

  describe("getById", () => {
    it("sollte eine Einladung anhand von Veterinary-ID und Practice-ID finden", async () => {
      prismaMock.veterinary_has_invitation.findUnique.mockResolvedValue(mockInvitation);

      const result = await veterinaryHasInvitationService.getById(1, 1);

      expect(result).toEqual(mockInvitation);
      expect(prismaMock.veterinary_has_invitation.findUnique).toHaveBeenCalledWith({
        where: {
          fk_veterinaryid_fk_veterinarypracticeid: {
            fk_veterinaryid: 1,
            fk_veterinarypracticeid: 1,
          },
        },
      });
    });

    it("sollte einen Fehler werfen, wenn die Einladung nicht gefunden wird", async () => {
      prismaMock.veterinary_has_invitation.findUnique.mockResolvedValue(null);

      await expect(veterinaryHasInvitationService.getById(999, 999)).rejects.toThrow("Invitation not found");
    });
  });

  describe("getAll", () => {
    it("sollte alle Einladungen finden", async () => {
      const mockInvitations = [
        mockInvitation,
        {
          fk_veterinaryid: 2,
          fk_veterinarypracticeid: 2,
        },
      ];

      prismaMock.veterinary_has_invitation.findMany.mockResolvedValue(mockInvitations);

      const result = await veterinaryHasInvitationService.getAll();

      expect(result).toEqual(mockInvitations);
      expect(prismaMock.veterinary_has_invitation.findMany).toHaveBeenCalledWith();
      expect(result.length).toBe(2);
    });

    it("sollte ein leeres Array zurückgeben, wenn keine Einladungen existieren", async () => {
      prismaMock.veterinary_has_invitation.findMany.mockResolvedValue([]);

      const result = await veterinaryHasInvitationService.getAll();

      expect(result).toEqual([]);
      expect(result.length).toBe(0);
    });
  });

  describe("delete", () => {
    it("sollte eine Einladung löschen", async () => {
      prismaMock.veterinary_has_invitation.delete.mockResolvedValue(mockInvitation);

      await veterinaryHasInvitationService.delete(1, 1);

      expect(prismaMock.veterinary_has_invitation.delete).toHaveBeenCalledWith({
        where: {
          fk_veterinaryid_fk_veterinarypracticeid: {
            fk_veterinaryid: 1,
            fk_veterinarypracticeid: 1,
          },
        },
      });
      expect(prismaMock.veterinary_has_invitation.delete).toHaveBeenCalledTimes(1);
    });

    it("sollte einen Fehler werfen, wenn die zu löschende Einladung nicht existiert", async () => {
      const error = new Error("Record to delete does not exist");
      prismaMock.veterinary_has_invitation.delete.mockRejectedValue(error);

      await expect(veterinaryHasInvitationService.delete(999, 999)).rejects.toThrow("Record to delete does not exist");
    });
  });
});
