import process from "node:process";
import { PrismaClient } from "@prisma/client";

/**
 * Pings the database to keep the Supabase project active.
 * Supabase pauses free-tier projects after 7 days of inactivity.
 */
async function pingDatabase() {
  const prisma = new PrismaClient();
  try {
    console.log("Connecting to database...");
    await prisma.$connect();

    // Performance: A simple SELECT 1 is the lightest way to ping
    const result = await prisma.$queryRaw`SELECT 1`;
    console.log("Ping successful:", result);

    // Optional: Could also count users to simulate real activity
    const userCount = await prisma.user.count();
    console.log(`Current user count: ${userCount}`);
  } catch (error) {
    console.error("Failed to ping database:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

pingDatabase();
