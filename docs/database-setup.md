# Database Setup Guide

This guide helps you set up the database for the Movie Club application.

## Quick Start

1. **Copy environment file:**
   ```bash
   cp .env.example .env
   ```

2. **Set up your database URL in `.env`**
3. **Run the setup script:**
   ```bash
   npm run setup
   ```

## Database Options

### Option 1: Vercel Postgres (Recommended)

**Pros:** Easy setup, integrates well with Vercel deployment, generous free tier
**Cons:** Requires Vercel account

**Steps:**
1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Create a new project or select existing project
3. Navigate to Storage tab
4. Click "Create Database" → Select "Postgres"
5. Follow the setup wizard
6. Copy the connection string from "Quickstart" → ".env.local" tab
7. Update your `.env` file:
   ```env
   DATABASE_URL="postgres://default:xxxxx@xxx-pooler.us-east-1.postgres.vercel-storage.com/verceldb"
   ```

### Option 2: Local PostgreSQL

**Pros:** Full control, works offline, no external dependencies
**Cons:** Requires local PostgreSQL installation

**Steps:**
1. **Install PostgreSQL:**
   - Windows: Download from [postgresql.org](https://www.postgresql.org/download/windows/)
   - Mac: `brew install postgresql`
   - Linux: `sudo apt-get install postgresql`

2. **Create database:**
   ```sql
   createdb movie_club
   ```

3. **Update `.env` file:**
   ```env
   DATABASE_URL="postgresql://username:password@localhost:5432/movie_club"
   ```

### Option 3: Cloud Database Services

**Popular options:**
- [Neon](https://neon.tech/) - Serverless PostgreSQL
- [Supabase](https://supabase.com/) - Open source Firebase alternative
- [PlanetScale](https://planetscale.com/) - MySQL-compatible
- [Railway](https://railway.app/) - Simple cloud database

**General steps:**
1. Create account with your chosen provider
2. Create a new PostgreSQL database
3. Copy the connection string
4. Update your `.env` file

## Database Schema Setup

After setting up your database connection:

1. **Generate migration files:**
   ```bash
   npm run db:generate
   ```

2. **Push schema to database:**
   ```bash
   npm run db:push
   ```

3. **Seed with movie data:**
   ```bash
   npm run db:seed
   ```

## Troubleshooting

### Error: "DATABASE_URL is not set"

**Solution:** Make sure you have a `.env` file in your project root with a valid DATABASE_URL

### Error: "Connection refused" or "Connection timeout"

**Possible causes:**
- Database server is not running
- Incorrect host/port in connection string
- Network/firewall issues
- Database credentials are wrong

**Solutions:**
- Verify database server is running
- Check connection string format
- Test connection using a database client (pgAdmin, TablePlus, etc.)

### Error: "Database does not exist"

**Solution:** Create the database first:
```sql
CREATE DATABASE movie_club;
```

### Error: "Authentication failed"

**Solution:** Verify username and password in connection string

### Error: "SSL required" or SSL connection issues

**Solution:** Add SSL parameters to connection string:
```env
DATABASE_URL="postgresql://user:pass@host:5432/db?sslmode=require"
```

## Connection String Format

PostgreSQL connection strings follow this format:
```
postgresql://[username[:password]@][host[:port]][/database][?param1=value1&param2=value2]
```

**Examples:**
- Local: `postgresql://postgres:password@localhost:5432/movie_club`
- With SSL: `postgresql://user:pass@host:5432/db?sslmode=require`
- Connection pooling: `postgresql://user:pass@host:5432/db?pgbouncer=true`

## Database Management

### View database content:
```bash
npm run db:studio
```
This opens Drizzle Studio in your browser for visual database management.

### Reset database:
```bash
npm run db:push --force
npm run db:seed
```

### Backup/Export data:
```bash
pg_dump $DATABASE_URL > backup.sql
```

### Import data:
```bash
psql $DATABASE_URL < backup.sql
```

## Environment Variables

The application expects these environment variables:

| Variable | Required | Description |
|----------|----------|-------------|
| `DATABASE_URL` | Yes | PostgreSQL connection string |

Make sure to:
- Never commit `.env` files to version control
- Use different databases for development/staging/production
- Keep connection strings secure and rotate credentials regularly