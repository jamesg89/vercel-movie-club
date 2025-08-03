import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema.js';
import { config } from 'dotenv';

// Load environment variables for standalone usage
config();

if (!process.env.DATABASE_URL) {
	throw new Error('DATABASE_URL is not set. Please add it to your .env file or environment variables.');
}

const client = postgres(process.env.DATABASE_URL);

export const db = drizzle(client, { schema });