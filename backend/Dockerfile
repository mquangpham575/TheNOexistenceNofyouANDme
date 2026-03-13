# Stage 1: Build
FROM oven/bun:1-slim AS builder

WORKDIR /app

# Install dependencies
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile

# Generate Prisma Client
COPY prisma ./prisma
RUN bunx prisma generate

# Build TypeScript
COPY tsconfig.json ./
COPY src ./src
RUN bun run build

# Stage 2: Run
FROM oven/bun:1-slim AS runner

WORKDIR /app

# Copy production dependencies only
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile --production

# Copy built files and Prisma
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma

# Environment defaults
ENV PORT=4000
ENV NODE_ENV=production

EXPOSE 4000

# Run migrations and start
CMD ["sh", "-c", "bunx prisma db push && bun run start"]
