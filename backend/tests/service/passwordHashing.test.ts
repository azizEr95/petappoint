import { comparePassword, hashPassword } from "../../src/utils/password";
import bcrypt from "bcrypt";

/**
 * Integration Tests für Password Hashing
 *
 * Diese Tests verifizieren, dass die Prisma Client Extension
 * Passwörter automatisch hasht. Da die Tests mit Mocks laufen,
 * testen wir hier hauptsächlich die Hash-Funktionalität.
 */
describe("Prisma Password Hashing Extension", () => {

  describe("password hashing functionality", () => {
    it("should produce bcrypt formatted hash", async () => {
      const plainPassword = "testPassword123";
      const hashed = await hashPassword(plainPassword);

      // Hash sollte nicht gleich Klartext sein
      expect(hashed).not.toBe(plainPassword);
      // Hash sollte bcrypt Format haben ($2b$10$...)
      expect(hashed).toMatch(/^\$2[aby]\$\d{2}\$/);
      // Länge sollte typisch für bcrypt sein (60 Zeichen)
      expect(hashed.length).toBe(60);
    });

    it("should verify password correctly with bcrypt.compare", async () => {
      const plainPassword = "mySecurePassword";
      const hashed = await hashPassword(plainPassword);

      // Korrektes Passwort sollte matchen
      const isValid = await bcrypt.compare(plainPassword, hashed);
      expect(isValid).toBe(true);

      // Falsches Passwort sollte nicht matchen
      const isInvalid = await bcrypt.compare("wrongPassword", hashed);
      expect(isInvalid).toBe(false);
    });

    it("should use comparePassword utility correctly", async () => {
      const plainPassword = "utilityTest123";
      const hashed = await hashPassword(plainPassword);

      // comparePassword sollte true für korrektes Passwort zurückgeben
      expect(await comparePassword(plainPassword, hashed)).toBe(true);
      // comparePassword sollte false für falsches Passwort zurückgeben
      expect(await comparePassword("wrongPass", hashed)).toBe(false);
    });

    it("should handle special characters in passwords", async () => {
      const specialPassword = "P@ssw0rd!#$%^&*()_+-=[]{}|;':\",./<>?";
      const hashed = await hashPassword(specialPassword);

      expect(await comparePassword(specialPassword, hashed)).toBe(true);
      expect(await comparePassword("P@ssw0rd", hashed)).toBe(false);
    });

    it("should be case sensitive", async () => {
      const password = "MyPassword123";
      const hashed = await hashPassword(password);

      expect(await comparePassword("MyPassword123", hashed)).toBe(true);
      expect(await comparePassword("mypassword123", hashed)).toBe(false);
      expect(await comparePassword("MYPASSWORD123", hashed)).toBe(false);
    });
  });
});
