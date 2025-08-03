import { config } from 'dotenv';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from '../src/lib/server/db/schema.js';
import { seedMovies } from '../src/lib/server/db/seed.js';

// Load environment variables
config();

async function initializeDatabase() {
	console.log('🚀 Initializing Movie Club database...\n');

	if (!process.env.DATABASE_URL) {
		console.error('❌ DATABASE_URL is not set!');
		console.log('\n📝 Please follow these steps:');
		console.log('1. Copy .env.example to .env');
		console.log('2. Update DATABASE_URL in .env with your database connection string');
		console.log('3. Run this script again\n');
		process.exit(1);
	}

	console.log('✅ DATABASE_URL found');
	console.log('🔄 Connecting to database...');

	try {
		const client = postgres(process.env.DATABASE_URL);
		const db = drizzle(client, { schema });

		// Test connection
		await client`SELECT 1`;
		console.log('✅ Database connection successful');

		// Create tables if they don't exist
		console.log('🏗️  Creating database tables...');
		
		// Create users table
		await client`
			CREATE TABLE IF NOT EXISTS "user" (
				"id" text PRIMARY KEY NOT NULL,
				"age" integer,
				"username" text NOT NULL,
				"password_hash" text NOT NULL,
				CONSTRAINT "user_username_unique" UNIQUE("username")
			)
		`;

		// Create sessions table
		await client`
			CREATE TABLE IF NOT EXISTS "session" (
				"id" text PRIMARY KEY NOT NULL,
				"user_id" text NOT NULL,
				"expires_at" timestamp with time zone NOT NULL
			)
		`;

		// Create movies table
		await client`
			CREATE TABLE IF NOT EXISTS "movie" (
				"id" serial PRIMARY KEY NOT NULL,
				"title" varchar(255) NOT NULL,
				"year" integer NOT NULL,
				"poster_url" varchar(255),
				"summary" text,
				"imdb_id" varchar(255),
				"genre" varchar(255),
				"director" varchar(255)
			)
		`;

		// Create user_likes table
		await client`
			CREATE TABLE IF NOT EXISTS "user_like" (
				"id" serial PRIMARY KEY NOT NULL,
				"user_id" text NOT NULL,
				"movie_id" integer NOT NULL,
				"created_at" timestamp with time zone DEFAULT now() NOT NULL
			)
		`;

		// Add foreign key constraints if they don't exist
		await client`
			DO $$ 
			BEGIN
				IF NOT EXISTS (
					SELECT 1 FROM information_schema.table_constraints 
					WHERE constraint_name = 'session_user_id_user_id_fk'
				) THEN
					ALTER TABLE "session" ADD CONSTRAINT "session_user_id_user_id_fk" 
					FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;
				END IF;
			END $$;
		`;

		await client`
			DO $$ 
			BEGIN
				IF NOT EXISTS (
					SELECT 1 FROM information_schema.table_constraints 
					WHERE constraint_name = 'user_like_user_id_user_id_fk'
				) THEN
					ALTER TABLE "user_like" ADD CONSTRAINT "user_like_user_id_user_id_fk" 
					FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;
				END IF;
			END $$;
		`;

		await client`
			DO $$ 
			BEGIN
				IF NOT EXISTS (
					SELECT 1 FROM information_schema.table_constraints 
					WHERE constraint_name = 'user_like_movie_id_movie_id_fk'
				) THEN
					ALTER TABLE "user_like" ADD CONSTRAINT "user_like_movie_id_movie_id_fk" 
					FOREIGN KEY ("movie_id") REFERENCES "public"."movie"("id") ON DELETE no action ON UPDATE no action;
				END IF;
			END $$;
		`;

		console.log('✅ Database tables created successfully');

		// Check if movies already exist
		const [movieCount] = await client`SELECT COUNT(*) as count FROM movie`;
		
		if (movieCount.count > 0) {
			console.log(`📚 Database already has ${movieCount.count} movies. Skipping seeding.`);
		} else {
			console.log('📦 Seeding database with movie data...');
			const count = await seedMovies();
			console.log(`✅ Successfully seeded ${count} movies!`);
		}

		console.log('\n🎉 Database initialization complete!');
		console.log('👉 Run "npm run dev" to start the development server\n');

		await client.end();
		process.exit(0);
		
	} catch (error) {
		console.error('❌ Database initialization failed:', error);
		console.log('\n🔧 Troubleshooting:');
		console.log('1. Verify your DATABASE_URL is correct');
		console.log('2. Ensure the database exists and is accessible');
		console.log('3. Check your network connection');
		console.log('4. Verify database credentials\n');
		process.exit(1);
	}
}

initializeDatabase();