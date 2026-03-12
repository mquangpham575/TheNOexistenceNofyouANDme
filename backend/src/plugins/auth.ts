import fp from "fastify-plugin";
import jwt from "@fastify/jwt";

declare module "@fastify/jwt" {
  interface FastifyJWT {
    payload: {
      userId: string;
      email: string;
    };
    user: {
      userId: string;
      email: string;
    };
  }
}

declare module "fastify" {
  interface FastifyInstance {
    authenticate: (request: import("fastify").FastifyRequest, reply: import("fastify").FastifyReply) => Promise<void>;
  }
}

export default fp(async (app) => {
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    throw new Error("JWT_SECRET is required");
  }

  await app.register(jwt, { secret });

  app.decorate("authenticate", async (request, reply) => {
    try {
      await request.jwtVerify();
    } catch {
      reply.code(401).send({ message: "Unauthorized" });
    }
  });
});
