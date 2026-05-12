import { PrismaClient } from "../generated/prisma";
import bcrypt from "bcrypt";

// Anzahl der Runden für bcrypt Salt-Generierung (höher = sicherer aber langsamer)
// 10 ist ein guter Kompromiss zwischen Sicherheit und Performance
const SALT_ROUNDS = 10;

/**
 * Erstellt einen Prisma Client mit automatischem Password-Hashing.
 *
 * Nutzt Prisma Client Extensions (seit v4.16.0) um Passwörter automatisch
 * zu hashen, bevor sie in die Datenbank geschrieben werden.
 *
 * Die Extension intercepted create/update Operationen und hasht das
 * password-Feld transparent mit bcrypt, falls es gesetzt ist
 */
const prismaClientSingleton = () => {
  return new PrismaClient().$extends({
    query: {
      // Extension für persons-Tabelle (normale Nutzer)
      person: {
        // Hook: Wird vor jedem persons.create() Aufruf ausgeführt
        async create({ args, query }) {
          // Prüfen ob ein Passwort im data-Objekt vorhanden ist
          if (args.data.password) {
            // Passwort mit bcrypt hashen (async, salt wird automatisch generiert)
            args.data.password = await bcrypt.hash(args.data.password, SALT_ROUNDS);
          }
          // Originale Query mit gehashtem Passwort ausführen
          return query(args);
        },
        // Hook: Wird vor jedem persons.update() Aufruf ausgeführt
        async update({ args, query }) {
          // Prüfen ob ein neues Passwort gesetzt werden soll
          if (args.data.password) {
            // Type-Cast nötig wegen Prisma Typen (kann string oder nested update sein)
            args.data.password = await bcrypt.hash(args.data.password as string, SALT_ROUNDS);
          }
          // Originale Query mit gehashtem Passwort ausführen
          return query(args);
        },
      },
      // Extension für veterinarypractices-Tabelle (Tierarztpraxen)
      veterinaryPractice: {
        // Hook: Wird vor jedem veterinarypractices.create() Aufruf ausgeführt
        async create({ args, query }) {
          if (args.data.password) {
            args.data.password = await bcrypt.hash(args.data.password, SALT_ROUNDS);
          }
          return query(args);
        },
        // Hook: Wird vor jedem veterinarypractices.update() Aufruf ausgeführt
        async update({ args, query }) {
          if (args.data.password) {
            args.data.password = await bcrypt.hash(args.data.password as string, SALT_ROUNDS);
          }
          return query(args);
        },
      },
    },
  });
};

// Exportiere den extended Prisma Client als Singleton
// Dieser wird in allen Services verwendet
export const prisma = prismaClientSingleton();
