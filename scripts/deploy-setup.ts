import { config } from 'dotenv';

// Load environment variables
config({ path: '.env.local' });

console.log('🚀 Setting up production database...\n');

async function deploySetup() {
	const steps = [
		'1. Create Vercel Postgres database in your Vercel dashboard',
		'2. The DATABASE_URL will be automatically added to environment variables',
		'3. Deploy the application: npx vercel --prod',
		'4. Initialize the database with this command:'
	];

	steps.forEach(step => console.log(step));
	
	console.log('\n📦 Run this command to seed production database:');
	console.log('vercel env pull .env.local');
	console.log('npm run db:init');
	console.log('\n✅ Your Movie Club application will be ready!');
}

deploySetup();