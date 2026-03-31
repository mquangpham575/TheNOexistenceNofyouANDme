import Fastify from "fastify";
import cors from "@fastify/cors";

import prismaPlugin from "./plugins/prisma.js";
import authPlugin from "./plugins/auth.js";
import { authRoutes } from "./routes/auth.js";
import { profileRoutes } from "./routes/profile.js";
import { env } from "./env.js"; // validate and access env vars

async function buildServer() {
  const app = Fastify({ logger: true });

  await app.register(cors, {
    origin: env.FRONTEND_ORIGIN,
    credentials: true,
  });

  await app.register(prismaPlugin);
  await app.register(authPlugin);

  app.get("/health", async () => ({ status: "ok" }));
  // Added root route
  app.get("/", async () => ({ status: "Backend is running on Northflank!" }));

  await app.register(authRoutes, { prefix: "/auth" });
  await app.register(profileRoutes, { prefix: "/profile" });

  return app;
}

async function start() {
  const port = Number(env.PORT);
  const app = await buildServer();

  try {
    await app.listen({ port, host: "0.0.0.0" });
  } catch (error) {
    app.log.error(error);
    process.exit(1);
  }
}

void start();
