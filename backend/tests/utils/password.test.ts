import { comparePassword, hashPassword } from "../../src/utils/password";
import bcrypt from "bcrypt";

describe("Password Utilities", () => {
  describe("hashPassword", () => {
    it("should hash a plain text password", async () => {
      const plain = "mySecretPassword123";
      const hashed = await hashPassword(plain);

      // Hash sollte nicht gleich Klartext sein
      expect(hashed).not.toBe(plain);
      // Hash sollte bcrypt Format haben ($2b$...)
      expect(hashed).toMatch(/^\$2[aby]\$/);
    });

    it("should produce different hashes for same password (due to different salts)", async () => {
      const plain = "samePassword";
      const hash1 = await hashPassword(plain);
      const hash2 = await hashPassword(plain);

      // Jeder Hash ist unterschiedlich wegen unique salt
      expect(hash1).not.toBe(hash2);
      // Aber beide sollten mit dem Original matchen
      expect(await bcrypt.compare(plain, hash1)).toBe(true);
      expect(await bcrypt.compare(plain, hash2)).toBe(true);
    });
  });

  describe("comparePassword", () => {
    it("should return true for matching password", async () => {
      const plain = "correctPassword";
      const hashed = await hashPassword(plain);

      const result = await comparePassword(plain, hashed);

      expect(result).toBe(true);
    });

    it("should return false for non-matching password", async () => {
      const plain = "correctPassword";
      const wrong = "wrongPassword";
      const hashed = await hashPassword(plain);

      const result = await comparePassword(wrong, hashed);

      expect(result).toBe(false);
    });

    it("should be case sensitive", async () => {
      const plain = "Password";
      const hashed = await hashPassword(plain);

      const resultLower = await comparePassword("password", hashed);
      const resultUpper = await comparePassword("PASSWORD", hashed);

      expect(resultLower).toBe(false);
      expect(resultUpper).toBe(false);
    });
  });
});
