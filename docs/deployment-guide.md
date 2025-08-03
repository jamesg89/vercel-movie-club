# Vercel Deployment Guide

Complete guide to deploy the Movie Club application to Vercel.

## Prerequisites

- [x] Vercel account ([sign up here](https://vercel.com/signup))
- [x] Git repository initialized
- [x] Application working locally

## Quick Deployment

### 1. Install Vercel CLI

```bash
npm install -g vercel
```

### 2. Deploy to Vercel

```bash
npx vercel
```

**Follow the prompts:**
- Set up and deploy? → `Y`
- Which scope? → Choose your account
- Link to existing project? → `N`
- Project name? → `movie-club` (or preferred name)
- Directory? → Press Enter
- Modify settings? → `N`

### 3. Set Up Production Database

**Option A: Create Vercel Postgres (Recommended)**

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your deployed project
3. Navigate to **Storage** tab
4. Click **Create Database** → **Postgres**
5. Follow setup wizard
6. DATABASE_URL automatically added to environment variables

**Option B: Use Existing Database**

1. Go to your project → **Settings** → **Environment Variables**
2. Add `DATABASE_URL` with your database connection string
3. Click **Save**

### 4. Initialize Production Database

```bash
# Pull environment variables from Vercel
vercel env pull .env.local

# Initialize production database
npm run db:init
```

### 5. Deploy Production Version

```bash
npm run deploy
```

## Step-by-Step Detailed Guide

### Initial Setup

1. **Prepare Repository**
   ```bash
   git add .
   git commit -m "Prepare for Vercel deployment"
   ```

2. **Run Pre-deployment Check**
   ```bash
   npm run build
   npm run check
   npm run lint
   ```

### Database Configuration

#### Creating Vercel Postgres Database

1. **Access Storage Settings**
   - Go to Vercel Dashboard
   - Select your project
   - Click **Storage** tab

2. **Create Database**
   - Click **Create Database**
   - Select **Postgres**
   - Choose region (closest to your users)
   - Click **Create**

3. **Get Connection Details**
   - Database automatically appears in **Storage** tab
   - CONNECTION_URL is automatically added to environment variables
   - No manual configuration needed

#### Environment Variables Setup

Required environment variables:
- `DATABASE_URL` - Automatically set when using Vercel Postgres

**To add custom environment variables:**
1. Project Settings → Environment Variables
2. Add variable name and value
3. Select environments (Production, Preview, Development)
4. Click **Save**

### Production Database Initialization

After setting up the database:

```bash
# Download production environment variables
vercel env pull .env.local

# Initialize database schema and seed data
npm run db:init
```

This will:
- Create all required tables
- Set up foreign key relationships  
- Seed database with 284 movies
- Verify everything is working

### Deployment Commands

```bash
# Deploy to preview (staging)
npx vercel

# Deploy to production
npx vercel --prod
# OR
npm run deploy
```

### Post-Deployment Verification

1. **Check Application Health**
   - Visit your Vercel URL
   - Test user registration
   - Verify movie browsing works
   - Test like/unlike functionality

2. **Monitor Logs**
   - Go to Vercel Dashboard → Your Project
   - Click **Functions** tab
   - Monitor for any errors

3. **Database Verification**
   ```bash
   # Check database connection
   npm run db:studio
   ```

## Troubleshooting

### Common Issues

**❌ Build Failures**
- Check TypeScript errors: `npm run check`
- Verify all dependencies: `npm install`
- Check build locally: `npm run build`

**❌ Database Connection Issues**
- Verify DATABASE_URL in environment variables
- Check database is accessible from Vercel's servers
- Ensure SSL is enabled for external connections

**❌ Runtime Errors**
- Check Vercel Function logs in dashboard
- Verify environment variables are set correctly
- Test API endpoints individually

**❌ Authentication Issues**
- Verify session cookies work across domains
- Check HTTPS configuration
- Ensure secure cookie settings

### Performance Optimization

1. **Database Connection Pooling**
   - Vercel Postgres includes connection pooling
   - Use `?pgbouncer=true` in connection string if needed

2. **Caching**
   - Static assets automatically cached by Vercel
   - Consider API route caching for movie data

3. **Region Selection**
   - Choose database region close to your users
   - Consider multiple regions for global apps

## Custom Domain Setup

1. **Add Domain**
   - Project Settings → Domains
   - Add your custom domain
   - Follow DNS configuration steps

2. **SSL Certificate**
   - Automatically provisioned by Vercel
   - No additional configuration needed

## Environment-Specific Configuration

### Development
```env
DATABASE_URL="your_local_or_dev_database_url"
```

### Production
- Set via Vercel Dashboard
- Use Vercel Postgres for production
- Enable SSL and connection pooling

## Monitoring and Maintenance

### Analytics
- Enable Vercel Analytics in project settings
- Monitor page views and performance

### Logs
- Function logs available in Vercel Dashboard
- Set up log aggregation for production monitoring

### Updates
```bash
# Deploy updates
git add .
git commit -m "Update feature"
npm run deploy
```

## Security Checklist

- [x] Environment variables properly set
- [x] Database connections use SSL
- [x] No sensitive data in client-side code
- [x] HTTPS enforced
- [x] Session cookies secure
- [x] No credentials in repository

## Support

- [Vercel Documentation](https://vercel.com/docs)
- [SvelteKit Deployment Guide](https://kit.svelte.dev/docs/adapter-vercel)
- [Drizzle ORM with Vercel](https://orm.drizzle.team/docs/quick-postgresql/vercel)