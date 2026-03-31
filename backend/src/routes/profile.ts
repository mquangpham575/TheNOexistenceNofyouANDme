import type { FastifyInstance } from "fastify";
import { z } from "zod";
import type { ZodTypeProvider } from "fastify-type-provider-zod";

export async function profileRoutes(app: FastifyInstance) {
  const typedApp = app.withTypeProvider<ZodTypeProvider>();

  // [GET] /profile
  typedApp.get(
    "/",
    {
      preHandler: [app.authenticate],
      schema: {
        tags: ["Profile"],
        summary: "Get current profile",
        security: [{ bearerAuth: [] }],
      },
    },
    async (request, reply) => {
      const profile = await app.prisma.profile.findUnique({
        where: { userId: request.user.userId },
      });

      if (!profile) {
        return reply.code(404).send({ message: "Profile not found" });
      }

      return reply.send(profile);
    },
  );

  // [PATCH] /profile
  typedApp.patch(
    "/",
    {
      preHandler: [app.authenticate],
      schema: {
        tags: ["Profile"],
        summary: "Update current profile",
        security: [{ bearerAuth: [] }],
        body: z.object({
          displayName: z.string().min(2).max(40).optional(),
          avatarUrl: z.string().nullable().optional(),
          bio: z.string().nullable().optional(),
        }),
      },
    },
    async (request, reply) => {
      // The body is already validated and typed!
      const updates = request.body;

      const profile = await app.prisma.profile.update({
        where: { userId: request.user.userId },
        data: updates,
      });

      return reply.send(profile);
    },
  );
}
