import Fastify from "fastify";
import cors from "@fastify/cors";

import prismaPlugin from "./plugins/prisma.js";
import authPlugin from "./plugins/auth.js";
import { authRoutes } from "./routes/auth.js";
import { profileRoutes } from "./routes/profile.js";

async function buildServer() {
  const app = Fastify({ logger: true });

  await app.register(cors, {
    origin: process.env.FRONTEND_ORIGIN || "http://localhost:3000",
    credentials: true,
  });

  await app.register(prismaPlugin);
  await app.register(authPlugin);

  app.get("/health", async () => ({ status: "ok" }));

  await app.register(authRoutes, { prefix: "/auth" });
  await app.register(profileRoutes, { prefix: "/profile" });

  return app;
}

async function start() {
  const port = Number(process.env.PORT || 4000);
  const app = await buildServer();

  try {
    await app.listen({ port, host: "0.0.0.0" });
  } catch (error) {
    app.log.error(error);
    process.exit(1);
  }
}

void start();
