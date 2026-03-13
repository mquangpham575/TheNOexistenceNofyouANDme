FROM oven/bun:1

WORKDIR /app

COPY package.json bun.lock ./
RUN bun install --frozen-lockfile

COPY prisma ./prisma
RUN bunx prisma generate

COPY tsconfig.json ./
COPY src ./src
RUN bun run build

EXPOSE 4000

CMD ["sh", "-c", "bunx prisma db push && bun run start"]
