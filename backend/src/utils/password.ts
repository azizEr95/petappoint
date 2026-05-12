import bcrypt from "bcrypt";

/**
 * Vergleicht ein Klartext-Passwort mit einem gehashten Passwort.
 *
 * Wird für Login-Funktionalität verwendet: Der User gibt sein Passwort ein,
 * wir vergleichen es mit dem gehashten Passwort aus der Datenbank.
 *
 * @param plainPassword - Das Klartext-Passwort (z.B. vom Login-Formular)
 * @param hashedPassword - Das gehashte Passwort aus der Datenbank
 * @returns true wenn Passwörter übereinstimmen, false wenn nicht
 *
 * @example
 * ```typescript
 * const user = await prisma.persons.findUnique({ where: { email: "user@example.com" } });
 * const isValid = await comparePassword(inputPassword, user.password);
 * if (isValid) {
 *   // Login erfolgreich
 * }
 * ```
 */
export async function comparePassword(
  plainPassword: string,
  hashedPassword: string
): Promise<boolean> {
  // bcrypt.compare() hasht das Klartext-Passwort mit dem gleichen Salt
  // wie beim ursprünglichen Hash und vergleicht die Ergebnisse
  return await bcrypt.compare(plainPassword, hashedPassword);
}

/**
 * Manuelles Hashen eines Passworts.
 *
 * Normalerweise nicht nötig, da das automatisch über Prisma Extensions passiert.
 * Kann aber nützlich sein für spezielle Use Cases (z.B. Migrations, Tests).
 *
 * @param plainPassword - Das zu hashende Passwort
 * @param saltRounds - Anzahl der Salt-Runden (default: 10)
 * @returns Das gehashte Passwort
 */
export async function hashPassword(
  plainPassword: string,
  saltRounds: number = 10
): Promise<string> {
  return await bcrypt.hash(plainPassword, saltRounds);
}
