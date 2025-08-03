import { config } from 'dotenv';
import { seedMovies } from '../src/lib/server/db/seed.js';

// Load environment variables
config();

async function setupDevelopment() {
	console.log('🚀 Setting up Movie Club development environment...\n');

	// Check if DATABASE_URL is set
	if (!process.env.DATABASE_URL) {
		console.error('❌ DATABASE_URL is not set!');
		console.log('\n📝 Please follow these steps:');
		console.log('1. Copy .env.example to .env');
		console.log('2. Update DATABASE_URL in .env with your database connection string');
		console.log('3. Run this script again\n');
		console.log('💡 For quick setup, use Vercel Postgres:');
		console.log('   https://vercel.com/dashboard → Storage → Create Database → Postgres\n');
		process.exit(1);
	}

	try {
		console.log('✅ DATABASE_URL found');
		console.log('🔄 Testing database connection...');

		// Test connection by attempting to seed
		console.log('📦 Seeding database with movie data...');
		const count = await seedMovies();
		
		console.log(`✅ Successfully seeded ${count} movies!`);
		console.log('\n🎉 Development environment is ready!');
		console.log('👉 Run "npm run dev" to start the development server\n');
		
	} catch (error) {
		console.error('❌ Setup failed:', error);
		console.log('\n🔧 Troubleshooting:');
		console.log('1. Verify your DATABASE_URL is correct');
		console.log('2. Ensure the database exists and is accessible');
		console.log('3. Check if you need to run "npm run db:push" first\n');
		process.exit(1);
	}
}

setupDevelopment();