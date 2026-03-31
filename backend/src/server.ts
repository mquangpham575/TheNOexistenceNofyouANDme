import Fastify, { type FastifyError } from "fastify";
import cors from "@fastify/cors";

import {
  serializerCompiler,
  validatorCompiler,
  jsonSchemaTransform,
  type ZodTypeProvider,
} from "fastify-type-provider-zod";
import swagger from "@fastify/swagger";
import swaggerUi from "@fastify/swagger-ui";

import prismaPlugin from "./plugins/prisma.js";
import authPlugin from "./plugins/auth.js";
import { authRoutes } from "./routes/auth.js";
import { profileRoutes } from "./routes/profile.js";
import { env } from "./env.js"; // validate and access env vars

async function buildServer() {
  const app = Fastify({
    logger: {
      transport: {
        target: "pino-pretty",
        options: {
          translateTime: "HH:MM:ss Z",
          ignore: "pid,hostname",
        },
      },
    },
  }).withTypeProvider<ZodTypeProvider>();

  // Use fastify-type-provider-zod compilers
  app.setValidatorCompiler(validatorCompiler);
  app.setSerializerCompiler(serializerCompiler);

  await app.register(cors, {
    origin: env.FRONTEND_ORIGIN,
    credentials: true,
  });

  // Swagger docs
  await app.register(swagger, {
    openapi: {
      info: { title: "API Documentation", version: "1.0.0" },
      components: {
        securitySchemes: {
          bearerAuth: {
            type: "http",
            scheme: "bearer",
            bearerFormat: "JWT",
          },
        },
      },
      security: [{ bearerAuth: [] }],
    },
    transform: jsonSchemaTransform,
  });

  await app.register(swaggerUi, {
    routePrefix: "/docs",
  });

  await app.register(prismaPlugin);
  await app.register(authPlugin);

  // Health routes
  app.get("/health", async () => ({ status: "ok" }));
  app.get("/", async () => ({ status: "Backend is running!" }));

  // API routing
  await app.register(authRoutes, { prefix: "/auth" });
  await app.register(profileRoutes, { prefix: "/profile" });

  // Global Error Handler
  app.setErrorHandler((error: FastifyError, request, reply) => {
    app.log.error(error);

    // Filter validation errors cleanly
    if (error.validation) {
      return reply.status(400).send({ message: "Validation error", issues: error.validation });
    }

    return reply.status(500).send({ message: "Internal server error" });
  });

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
