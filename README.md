# The NOexistenceN of you AND me Web Based

A "non functional" fan tribute to the game **The NOexistenceN of you AND me**, originally developed by **Nino Games** and **0x0Real Studio**.

<div align="center">
  <img src="frontend/assets/readme/readme_top_preview.png" alt="App Preview" />
</div>

## Features

- **Immersive Interface**: Custom main menu with hover animations and seamless transitions.
- **Audio Integration**: Background music (OST) support with interactive playback controls.
- **Visuals**: Animated backgrounds and planned 3D interactive book model integration.
- **Modern Tech**: Built with React 19 and TypeScript for a robust, type-safe architecture.
- **Smooth Animations**: fluid UI interactions powered by Framer Motion.

## Tech Stack

- **Framework**: [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- **Build Tool**: [Vite](https://vitejs.dev/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Animation**: [Framer Motion](https://www.framer.com/motion/)
- **Icons**: [Lucide React](https://lucide.dev/)

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js**: v18 or higher (LTS recommended).
- **Package Manager**: npm, yarn, or pnpm.

### Installation & Run

1. Clone the repository.
2. Install dependencies:
   ```bash
   cd frontend
   npm install
   ```
3. Start the development server:
   ```bash
   cd frontend
   npm run dev
   ```

## Backend (Step 1: Auth + Profiles)

This repository now includes a backend API in `backend/` with:

- JWT auth (`register`, `login`, `me`)
- User profile fetch/update
- PostgreSQL + Prisma ORM

### Run Full Stack With Docker

From the project root:

```bash
docker compose up -d --build
```

Services:

- Frontend: `http://localhost:3000`
- Backend API: `http://localhost:4000`
- Postgres: `localhost:5432`

The frontend Nginx is configured to proxy `http://localhost:3000/api/*` to the backend.

### API Endpoints

- `POST /auth/register`
  - body: `{ "email": "user@example.com", "password": "password123", "displayName": "Player" }`
- `POST /auth/login`
  - body: `{ "email": "user@example.com", "password": "password123" }`
- `GET /auth/me`
  - auth: `Authorization: Bearer <token>`
- `GET /profile`
  - auth: `Authorization: Bearer <token>`
- `PATCH /profile`
  - auth: `Authorization: Bearer <token>`
  - body example: `{ "displayName": "New Name", "bio": "...", "avatarUrl": null }`

### Run Backend Alone (Optional)

```bash
cd backend
npm install
npm run db:push
npm run dev
```

## Roadmap

- [x] 1st page - Main menu: (should be done)
- [ ] 2nd page - Continue (VN like book-note of Lilth):
- [x] Settings: UI for settings. (67% cause idk how to do the hover animation and also no text yet so can't test text speed)
  - [ ] Hover animation for customizeable/reset/return.
- [ ] Fleeting Memories: Gallery.
- [ ] Backers: Credits.
- [x] Exit: Exit Screen with and voice lines.

## Disclaimer

This is a non-profit fan project. I do not own the rights to the original game. All credit for the concept, characters, and assets goes to Nino Games and 0x0Real Studio. Please don't sue me; I'm just a fan with a text editor and a dream.

<div align="center">
  <img src="frontend/assets/readme/readme_icon.gif" alt="App Preview" />
</div>
