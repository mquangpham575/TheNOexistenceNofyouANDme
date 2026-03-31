# The NOexistenceN of you AND me Web Based

A "non functional" fan tribute to the game **The NOexistenceN of you AND me**, originally developed by **Nino Games** and **0x0Real Studio**.

<div align="center">
  <img src="frontend/assets/readme/readme_top_preview.png" alt="App Preview" />
</div>

## ✨ Features

- **Immersive Interface**: Custom main menu with hover animations and seamless transitions.
- **Audio Integration**: Background music (OST) support with interactive playback controls.
- **Visuals**: Animated backgrounds and planned 3D interactive book model integration.
- **Smooth Animations**: Fluid UI interactions powered by Framer Motion.
- **Robust API**: Bulletproof Fastify backend with strictly validated environment variables and automated testing configurations.

## 🛠️ Tech Stack

- **Frontend**: [React 19](https://react.dev/) + [Vite](https://vitejs.dev/) + [Tailwind CSS v4](https://tailwindcss.com/) + [Framer Motion](https://www.framer.com/motion/)
- **Backend**: [Fastify](https://fastify.dev/) + [Zod](https://zod.dev/) + [ESLint](https://eslint.org/)
- **Database**: [PostgreSQL (Supabase)](https://supabase.com/) + [Prisma ORM](https://www.prisma.io/)
- **Tooling**: [Bun](https://bun.sh/) + [TypeScript](https://www.typescriptlang.org/) + [Concurrently](https://github.com/open-cli-tools/concurrently)

## 🚀 Getting Started

Ensure you have **[Bun](https://bun.sh/)** installed on your system.

### 1. Installation

Clone the repository and install all dependencies for both the frontend and backend in one shot:

```bash
bun install
```

### 2. Environment Variables

Navigate to the `backend/` directory and duplicate the example environment file:

```bash
cp backend/.env.example backend/.env
```

Open `backend/.env` and configure your variables (Zod will strictly validate these on startup!):

- `DATABASE_URL`: Your Supabase **Connection Pooler** string (Port 6543, includes `?pgbouncer=true`).
- `DIRECT_URL`: Your Supabase **Direct Connection** string (Port 5432, used exclusively by Prisma for migrations).
- `JWT_SECRET`: A secure random string for signing auth tokens.

### 3. Database Migrations

Push the Prisma schema to your Supabase database:

```bash
cd backend
bun run db:push
cd ..
```

### 4. Run the Full Stack Locally

You no longer need multiple terminals! From the **root of the project**, simply run:

```bash
bun run dev
```

This will concurrently launch:

- Frontend on `http://localhost:5173` (or next available)
- Backend API on `http://localhost:4000`

### Run Full Stack With Docker (Alternative)

```bash
docker compose up -d --build
```

_Note: Make sure your local Postgres container is running if you aren't using Supabase._

## 🔌 API Endpoints

- `POST /auth/register`
  - body: `{ "email": "user@example.com", "password": "password123", "displayName": "Player" }`
- `POST /auth/login`
  - body: `{ "email": "user@example.com", "password": "password123" }`
- `GET /auth/me` (Header `Authorization: Bearer <token>`)
- `GET /profile` (Header `Authorization: Bearer <token>`)
- `PATCH /profile` (Header `Authorization: Bearer <token>`)
  - body example: `{ "displayName": "New Name", "bio": "...", "avatarUrl": null }`

## 🗺️ Roadmap

- [x] 1st page - Main menu: (should be done)
- [ ] 2nd page - Continue (VN like book-note of Lilth):
- [x] Settings: UI for settings. (67% cause idk how to do the hover animation and also no text yet so can't test text speed)
  - [ ] Hover animation for customizeable/reset/return.
- [ ] Fleeting Memories: Gallery.
- [ ] Backers: Credits.
- [x] Exit: Exit Screen with and voice lines.

## ⚠️ Disclaimer

This is a non-profit fan project. I do not own the rights to the original game. All credit for the concept, characters, and assets goes to Nino Games and 0x0Real Studio. Please don't sue me; I'm just a fan with a text editor and a dream.

<div align="center">
  <img src="frontend/assets/readme/readme_icon.gif" alt="App Preview" />
</div>
