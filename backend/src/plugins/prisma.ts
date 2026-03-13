import fp from "fastify-plugin";
import { PrismaClient } from "@prisma/client";

declare module "fastify" {
  interface FastifyInstance {
    prisma: PrismaClient;
  }
}

// Connects the Prisma client and decorates the Fastify app instance.
export default fp(async (app) => {
  const prisma = new PrismaClient();

  await prisma.$connect();
  app.decorate("prisma", prisma);

  // Ensures the database connection is closed when the application shuts down.
  app.addHook("onClose", async () => {
    await prisma.$disconnect();
  });
});
