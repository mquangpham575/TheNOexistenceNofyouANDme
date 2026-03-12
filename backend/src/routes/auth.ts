import type { FastifyInstance } from "fastify";
import bcrypt from "bcryptjs";

interface RegisterBody {
  email: string;
  password: string;
  displayName?: string;
}

interface LoginBody {
  email: string;
  password: string;
}

export async function authRoutes(app: FastifyInstance) {
  app.post<{ Body: RegisterBody }>("/register", async (request, reply) => {
    const { email, password, displayName } = request.body;

    if (!email || !password || password.length < 8) {
      return reply
        .code(400)
        .send({ message: "Email and password (min 8 chars) are required" });
    }

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
  });

  app.post<{ Body: LoginBody }>("/login", async (request, reply) => {
    const { email, password } = request.body;

    if (!email || !password) {
      return reply
        .code(400)
        .send({ message: "Email and password are required" });
    }

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
  });

  app.get("/me", { preHandler: [app.authenticate] }, async (request, reply) => {
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
  });
}
