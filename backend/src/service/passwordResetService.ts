import { prisma } from "../singletonPC";
import bcrypt from "bcrypt";
import crypto from "crypto";

const TOKEN_EXPIRY_HOURS = 1;
const TOKEN_BYTES = 32;

export const passwordResetService = {
  async createResetToken(email: string): Promise<string | null> {
    // Find person by email
    const person = await prisma.person.findUnique({
      where: { email },
      select: { id: true },
    });

    if (!person) {
      return null; // Return null but don't expose to client
    }

    // Generate secure random token
    const token = crypto.randomBytes(TOKEN_BYTES).toString("hex");
    const tokenHash = await bcrypt.hash(token, 10);

    // Delete any existing unused tokens for this user
    await prisma.passwordResetToken.deleteMany({
      where: {
        userId: person.id,
        usedAt: null,
      },
    });

    // Create new token
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + TOKEN_EXPIRY_HOURS);

    await prisma.passwordResetToken.create({
      data: {
        userId: person.id,
        tokenHash,
        expiresAt,
      },
    });

    return token; // Return plaintext token for email
  },

  async verifyToken(token: string): Promise<number | null> {
    // Get all valid tokens (not expired, not used)
    const validTokens = await prisma.passwordResetToken.findMany({
      where: {
        expiresAt: { gt: new Date() },
        usedAt: null,
      },
      select: {
        id: true,
        userId: true,
        tokenHash: true,
      },
    });

    // Compare token with hashes
    for (const record of validTokens) {
      const isValid = await bcrypt.compare(token, record.tokenHash);
      if (isValid) {
        return record.userId; // Return user ID if valid
      }
    }

    return null; // Token invalid/expired/used
  },

  async resetPassword(token: string, newPassword: string): Promise<boolean> {
    const userId = await this.verifyToken(token);

    if (!userId) {
      return false;
    }

    // Update password (will be auto-hashed by Prisma extension)
    await prisma.person.update({
      where: { id: userId },
      data: { password: newPassword },
    });

    // Mark all tokens for this user as used
    await prisma.passwordResetToken.updateMany({
      where: {
        userId,
        usedAt: null,
      },
      data: {
        usedAt: new Date(),
      },
    });

    return true;
  },

  async cleanupExpiredTokens(): Promise<void> {
    // Cleanup job to delete old tokens
    await prisma.passwordResetToken.deleteMany({
      where: {
        expiresAt: { lt: new Date() },
      },
    });
  },
};
