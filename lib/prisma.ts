import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// Prüfe ob DATABASE_URL gesetzt ist
if (!process.env.DATABASE_URL) {
  console.warn("WARNING: DATABASE_URL ist nicht gesetzt!");
}

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
  }).$extends({
    query: {
      $allOperations({ operation, model, args, query }) {
        return query(args).catch((error: any) => {
          console.error(`Prisma Error [${model}.${operation}]:`, error);
          throw error;
        });
      },
    },
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;


