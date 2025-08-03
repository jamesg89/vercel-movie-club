import { seedMovies } from '../src/lib/server/db/seed.js';

async function main() {
	try {
		console.log('Starting database seeding...');
		const count = await seedMovies();
		console.log(`Database seeding completed successfully! Added ${count} movies.`);
		process.exit(0);
	} catch (error) {
		console.error('Database seeding failed:', error);
		process.exit(1);
	}
}

main();
