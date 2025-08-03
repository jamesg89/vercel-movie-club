import { db } from './standalone.js';
import { movie } from './schema.js';
import fs from 'fs';
import path from 'path';

interface PlexMovieItem {
	title: string;
	year: number;
	summary?: string;
	studio?: string;
	tagline?: string;
	guid?: string;
}

interface PlexData {
	items: PlexMovieItem[];
}

export async function seedMovies() {
	try {
		// Read the movie data from JSON file
		const filePath = path.join(process.cwd(), 'static', 'movie-list.json');
		const jsonData = fs.readFileSync(filePath, 'utf-8');
		const plexData: PlexData[] = JSON.parse(jsonData);

		// Extract movies from the first collection (assuming it's the main movie collection)
		const movieCollection = plexData[0];
		if (!movieCollection?.items) {
			throw new Error('No movie items found in the collection');
		}

		// Transform Plex data to our movie schema format
		const moviesToInsert = movieCollection.items.map((item) => ({
			title: item.title,
			year: item.year,
			summary: item.summary || null,
			director: item.studio || null, // Using studio as director placeholder
			genre: null, // Will be extracted later if needed
			posterUrl: null, // Will be added later when we implement poster handling
			imdbId: extractImdbId(item.guid) || null
		}));

		// Clear existing movies
		await db.delete(movie);

		// Insert the movies
		await db.insert(movie).values(moviesToInsert);

		console.log(`Successfully seeded ${moviesToInsert.length} movies to the database`);
		return moviesToInsert.length;
	} catch (error) {
		console.error('Error seeding movies:', error);
		throw error;
	}
}

// Helper function to extract IMDB ID from Plex GUID if available
function extractImdbId(guid?: string): string | null {
	if (!guid) return null;

	// Look for IMDB pattern in the guid
	const imdbMatch = guid.match(/imdb:\/\/([^?]+)/);
	if (imdbMatch) {
		return imdbMatch[1];
	}

	return null;
}
