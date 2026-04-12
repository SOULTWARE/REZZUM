import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as typeof globalThis & {
  prisma?: PrismaClient;
};

export const db =
  globalForPrisma.prisma ??
  (() => {
    if (!process.env.DATABASE_URL) {
      throw new Error("DATABASE_URL is required to initialize Prisma.");
    }

    const adapter = new PrismaPg({
      connectionString: process.env.DATABASE_URL,
    });

    return new PrismaClient({
      adapter,
      log: process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
    });
  })();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = db;
}
