# Product Requirements Document: Movie Club

## 1. Overview

[cite_start]Movie Club is a modern SvelteKit web application where users can sign in, browse a curated list of movies, and vote for their favorites. [cite: 1] The application provides a personalized experience, allowing users to track the movies they've "liked" and filter the extensive movie list by title and year. [cite_start] Built with Svelte 5, the project emphasizes a clean user interface, robust authentication, and a scalable architecture deployed on Vercel. [cite: 1, 2]

---

## 2. User Stories

- **As a new user,** I want to be able to create an account so that I can save my liked movies.
- **As a registered user,** I want to be able to log in to my account to access my personalized content.
- **As a user,** I want to see a grid of all available movies so that I can browse the collection.
- **As a user,** I want to be able to filter movies by title and year, so I can easily find specific movies.
- **As a user,** I want to be able to "like" a movie from the main grid so I can save it to my favorites.
- **As a user,** I want to be able to navigate to a separate page to see all the movies I have liked.
- **As a user,** I want to be able to "unlike" a movie from my liked movies page so I can remove it from my favorites.

---

## 3. Functional Requirements

### 3.1. Authentication

- Users must be able to sign up for a new account and log in with their credentials.
- Authentication will be managed using **Lucia Auth**, as specified in the project documentation.
- Session management and user identity will persist across browser sessions.

### 3.2. Movie Browse & Filtering

- The main page of the application will display all movies from the database in a responsive grid layout.
- Each movie card in the grid must display, at a minimum, the movie's poster, title, and year of release.
- A text input field will be available for users to filter the movie grid in real-time by **title** and **year**.
- Each movie card will feature a "like" button (e.g., a heart icon) to allow authenticated users to add a movie to their personal list.

### 3.3. Liked Movies Page

- Authenticated users will have access to a dedicated "My Likes" page.
- This page will display a grid of all movies the logged-in user has liked.
- Each movie card on this page must have an "unlike" button that, when clicked, removes the movie from the user's liked list.

---

## 4. Technical & Project Requirements

### 4.1. [cite_start]Technology Stack [cite: 3]

- **Core Framework**: Svelte 5 with SvelteKit.
  - [cite_start]**MANDATORY**: Use Svelte 5 syntax exclusively (e.g., `onclick`, not `on:click`). [cite: 3, 4]
  - [cite_start]**MANDATORY**: Use runes for all reactivity (`$state`, `$derived`, `$effect`). [cite: 3]
- **Language**: TypeScript (strict mode enabled). [cite_start]All `.svelte` files must use `<script lang="ts">`. [cite: 3]
- **Styling**: Tailwind CSS 4.0.
  - [cite_start]**MANDATORY**: Use Tailwind utility classes exclusively for all styling. [cite: 3]
  - [cite_start]**FORBIDDEN**: Custom CSS files or `<style>` blocks (except for global base styles). [cite: 3]
- **Authentication**: Lucia Auth (see `docs/lucia-auth.md`).
- **Deployment**: Vercel.
- **Database**: Vercel Postgres.

### 4.2. UI/UX and Development Process

- [cite_start]The design must be modern, professional, and fully responsive across mobile, tablet, and desktop screen sizes. [cite: 16]
- The UI must be intuitive and provide a seamless user experience.
- **MANDATORY**: The "Screenshot-Driven Development Process" must be followed. [cite_start]Use Puppeteer MCP to take and evaluate screenshots after UI changes to ensure high-quality visual design, spacing, and consistency. [cite: 15]

---

## 5. Database Schema

The full database is currently in /static/movie-list.json and when ready to deploy to vercel, this json file can be used to populate the vercel database as well this json file can be used for dummy data during development.

The database will be hosted on Vercel Postgres and will consist of three primary tables: `users`, `movies`, and `user_likes`.

### 5.1. `users` Table

_Managed by Lucia Auth._
| Column | Data Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | `VARCHAR(255)` | PRIMARY KEY | Unique user identifier from Lucia Auth. |
| `username` | `VARCHAR(255)` | UNIQUE, NOT NULL | User's unique username. |
| `hashed_password` | `VARCHAR(255)` | NOT NULL | Hashed password for user authentication. |

### 5.2. `movies` Table

_Populated from the `movie-list.json` file._
| Column | Data Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | `SERIAL` | PRIMARY KEY | Unique identifier for the movie. |
| `title` | `VARCHAR(255)` | NOT NULL | Movie title. |
| `year` | `INT` | NOT NULL | Release year of the movie. |
| `posterUrl` | `VARCHAR(255)` | | URL for the movie poster image. |
| `summary` | `TEXT` | | A short summary of the movie. |
| `imdbId` | `VARCHAR(255)` | | The IMDB ID of the movie. |
| `genre` | `VARCHAR(255)` | | Genre(s) of the movie. |
| `director` | `VARCHAR(255)` | | Director(s) of the movie. |

### 5.3. `user_likes` Table

_Maps users to the movies they have liked._
| Column | Data Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | `SERIAL` | PRIMARY KEY | Unique identifier for the like entry. |
| `user_id` | `VARCHAR(255)` | FOREIGN KEY (`users.id`), NOT NULL | The ID of the user who liked the movie. |
| `movie_id` | `INT` | FOREIGN KEY (`movies.id`), NOT NULL | The ID of the liked movie. |
| `created_at` | `TIMESTAMP` | DEFAULT `NOW()` | Timestamp of when the movie was liked. |
