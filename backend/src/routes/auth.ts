import type { FastifyInstance } from "fastify";
import bcrypt from "bcryptjs";
import { z } from "zod";
import type { ZodTypeProvider } from "fastify-type-provider-zod";

export async function authRoutes(app: FastifyInstance) {
  const typedApp = app.withTypeProvider<ZodTypeProvider>();

  // [POST] /auth/register
  typedApp.post(
    "/register",
    {
      schema: {
        tags: ["Auth"],
        summary: "Register user",
        body: z.object({
          email: z.string().email(),
          password: z.string().min(8),
          displayName: z.string().optional(),
        }),
      },
    },
    async (request, reply) => {
      const { email, password, displayName } = request.body;

      const normalizedEmail = email.trim().toLowerCase();
      const existingUser = await app.prisma.user.findUnique({
        where: { email: normalizedEmail },
      });

      if (existingUser) {
        return reply.code(409).send({ message: "Email already in use" });
      }

      const passwordHash = await bcrypt.hash(password, 10);
      const defaultDisplayName = normalizedEmail.split("@")[0] || "Player";

      const user = await app.prisma.user.create({
        data: {
          email: normalizedEmail,
          passwordHash,
          profile: {
            create: {
              displayName: (displayName || defaultDisplayName).trim(),
            },
          },
        },
        include: {
          profile: true,
        },
      });

      const token = await reply.jwtSign({ userId: user.id, email: user.email });

      return reply.code(201).send({
        token,
        user: {
          id: user.id,
          email: user.email,
          profile: user.profile,
        },
      });
    },
  );

  // [POST] /auth/login
  typedApp.post(
    "/login",
    {
      schema: {
        tags: ["Auth"],
        summary: "Login user",
        body: z.object({
          email: z.string().email(),
          password: z.string().min(1),
        }),
      },
    },
    async (request, reply) => {
      const { email, password } = request.body;

      const normalizedEmail = email.trim().toLowerCase();
      const user = await app.prisma.user.findUnique({
        where: { email: normalizedEmail },
        include: { profile: true },
      });

      if (!user) {
        return reply.code(401).send({ message: "Invalid credentials" });
      }

      const isValidPassword = await bcrypt.compare(password, user.passwordHash);
      if (!isValidPassword) {
        return reply.code(401).send({ message: "Invalid credentials" });
      }

      const token = await reply.jwtSign({ userId: user.id, email: user.email });

      return reply.send({
        token,
        user: {
          id: user.id,
          email: user.email,
          profile: user.profile,
        },
      });
    },
  );

  // [GET] /auth/me
  typedApp.get(
    "/me",
    {
      preHandler: [app.authenticate],
      schema: {
        tags: ["Auth"],
        summary: "Get current user",
        security: [{ bearerAuth: [] }],
      },
    },
    async (request, reply) => {
      const user = await app.prisma.user.findUnique({
        where: { id: request.user.userId },
        include: { profile: true },
      });

      if (!user) {
        return reply.code(404).send({ message: "User not found" });
      }

      return reply.send({
        id: user.id,
        email: user.email,
        profile: user.profile,
      });
    },
  );
}
