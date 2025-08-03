# Movie Club

A modern SvelteKit web application where users can sign in, browse a curated list of movies, and vote for their favorites. Built with Svelte 5, TypeScript, Tailwind CSS 4.0, Lucia Auth, and Vercel Postgres.

## Features

- **User Authentication**: Secure signup and login with Lucia Auth
- **Movie Browsing**: Responsive grid layout displaying movie collection
- **Real-time Filtering**: Search movies by title and year
- **Like/Unlike System**: Save favorite movies with heart icons
- **Personal Collections**: Dedicated "My Likes" page for favorited movies
- **Modern UI**: Clean, professional design with Tailwind CSS 4.0
- **Responsive Design**: Optimized for mobile, tablet, and desktop

## Technology Stack

- **Frontend**: Svelte 5 with SvelteKit
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS 4.0
- **Authentication**: Lucia Auth with Argon2 password hashing
- **Database**: Vercel Postgres with Drizzle ORM
- **Deployment**: Vercel

## Setup Instructions

### Prerequisites

- Node.js 18+
- npm or yarn
- Vercel account (for deployment)

### Local Development

1. **Clone and install dependencies:**

   ```bash
   npm install
   ```

2. **Set up database:**

   You have several options for the database:

   **Option A: Vercel Postgres (Recommended)**
   
   1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
   2. Create a new project or select existing project
   3. Go to Storage tab → Create Database → Postgres
   4. Copy the connection string from "Quickstart" → ".env.local"
   5. Create a `.env` file in your project root:

   ```env
   DATABASE_URL="postgres://default:xxxx@xxx-pooler.us-east-1.postgres.vercel-storage.com/verceldb"
   ```

   **Option B: Local PostgreSQL**
   
   1. Install PostgreSQL locally
   2. Create a database named `movie_club`
   3. Set up your `.env` file:

   ```env
   DATABASE_URL="postgresql://username:password@localhost:5432/movie_club"
   ```

   **Option C: Cloud Database (Neon, Supabase, etc.)**
   
   1. Create an account with your preferred provider
   2. Create a new database
   3. Copy the connection string to your `.env` file

3. **Initialize database:**

   ```bash
   # Generate migration files
   npm run db:generate
   
   # Push schema to database
   npm run db:push

   # Seed with movie data
   npm run db:seed
   ```

4. **Start development server:**
   ```bash
   npm run dev
   ```

### Deployment

1. **Deploy to Vercel:**

   ```bash
   npx vercel
   ```

2. **Set up Vercel Postgres:**
   - Create a Vercel Postgres database in your project dashboard
   - Add the `DATABASE_URL` environment variable

3. **Run database setup on Vercel:**
   ```bash
   npx vercel env pull .env.local
   npm run db:push
   npm run db:seed
   ```

## Project Structure

```
src/
├── lib/
│   └── server/
│       ├── auth.ts          # Authentication logic
│       ├── password.ts      # Password hashing utilities
│       └── db/
│           ├── index.ts     # Database connection
│           ├── schema.ts    # Database schema definitions
│           └── seed.ts      # Data seeding script
├── routes/
│   ├── +layout.svelte       # Global layout
│   ├── +page.svelte         # Main movie browsing page
│   ├── +page.server.ts      # Server-side logic for main page
│   ├── login/               # Login page
│   ├── signup/              # Registration page
│   ├── likes/               # User's liked movies page
│   └── logout/              # Logout handling
└── hooks.server.ts          # Authentication middleware
```

## Database Schema

### Users Table

- `id`: Unique user identifier
- `username`: User's unique username
- `passwordHash`: Hashed password

### Movies Table

- `id`: Movie identifier
- `title`: Movie title
- `year`: Release year
- `summary`: Movie description
- `director`: Director name
- `genre`: Movie genre
- `posterUrl`: Poster image URL
- `imdbId`: IMDB identifier

### User Likes Table

- `id`: Like record identifier
- `userId`: Reference to user
- `movieId`: Reference to movie
- `createdAt`: Timestamp of like

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run check` - Run TypeScript and Svelte checks
- `npm run lint` - Lint code
- `npm run format` - Format code
- `npm run db:generate` - Generate database migrations
- `npm run db:push` - Push schema to database
- `npm run db:seed` - Seed database with movie data
- `npm run db:studio` - Open Drizzle Studio

## Contributing

This project follows strict coding standards:

- **Svelte 5 Syntax**: Use `onclick` instead of `on:click`
- **Reactivity**: Use runes (`$state`, `$derived`, `$effect`)
- **TypeScript**: Strict mode with proper interfaces
- **Styling**: Tailwind CSS 4.0 utilities only
- **Authentication**: Lucia Auth patterns

## License

Private project - Movie Club
