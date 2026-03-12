import type { FastifyInstance } from "fastify";

interface UpdateProfileBody {
  displayName?: string;
  avatarUrl?: string | null;
  bio?: string | null;
}

export async function profileRoutes(app: FastifyInstance) {
  app.get("/", { preHandler: [app.authenticate] }, async (request, reply) => {
    const profile = await app.prisma.profile.findUnique({
      where: { userId: request.user.userId },
    });

    if (!profile) {
      return reply.code(404).send({ message: "Profile not found" });
    }

    return reply.send(profile);
  });

  app.patch<{ Body: UpdateProfileBody }>(
    "/",
    { preHandler: [app.authenticate] },
    async (request, reply) => {
      const updates: UpdateProfileBody = {};

      if (typeof request.body.displayName === "string") {
        const value = request.body.displayName.trim();
        if (value.length < 2 || value.length > 40) {
          return reply
            .code(400)
            .send({
              message: "displayName must be between 2 and 40 characters",
            });
        }
        updates.displayName = value;
      }

      if (
        request.body.avatarUrl === null ||
        typeof request.body.avatarUrl === "string"
      ) {
        updates.avatarUrl = request.body.avatarUrl;
      }

      if (request.body.bio === null || typeof request.body.bio === "string") {
        updates.bio = request.body.bio;
      }

      const profile = await app.prisma.profile.update({
        where: { userId: request.user.userId },
        data: updates,
      });

      return reply.send(profile);
    },
  );
}
