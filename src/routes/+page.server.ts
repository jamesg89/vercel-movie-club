import { redirect, fail } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { movie, userLike } from '$lib/server/db/schema';
import { eq, and } from 'drizzle-orm';
import { invalidateSession, deleteSessionTokenCookie } from '$lib/server/auth';
import type { PageServerLoad, Actions } from './$types';

export const load: PageServerLoad = async ({ locals, url }) => {
	if (!locals.user) {
		return redirect(302, '/login');
	}

	// Get search parameters for filtering
	const searchTitle = url.searchParams.get('title') || '';
	const searchYear = url.searchParams.get('year') || '';

	// Fetch all movies
	let moviesQuery = db.select().from(movie);

	// Apply filters if provided
	if (searchTitle || searchYear) {
		// For now, return all movies and filter client-side
		// In production, you'd want to implement database-level filtering
	}

	const movies = await moviesQuery;

	// Get user's liked movies
	const userLikes = await db
		.select({ movieId: userLike.movieId })
		.from(userLike)
		.where(eq(userLike.userId, locals.user.id));

	const likedMovieIds = new Set(userLikes.map((like) => like.movieId));

	return {
		user: locals.user,
		movies: movies.map((movie) => ({
			...movie,
			isLiked: likedMovieIds.has(movie.id)
		})),
		searchTitle,
		searchYear
	};
};

export const actions: Actions = {
	toggleLike: async ({ request, locals }) => {
		if (!locals.user) {
			return fail(401, { message: 'Unauthorized' });
		}

		const formData = await request.formData();
		const movieId = formData.get('movieId');

		if (!movieId || typeof movieId !== 'string') {
			return fail(400, { message: 'Invalid movie ID' });
		}

		const movieIdNum = parseInt(movieId);

		// Check if like already exists
		const [existingLike] = await db
			.select()
			.from(userLike)
			.where(and(eq(userLike.userId, locals.user.id), eq(userLike.movieId, movieIdNum)));

		if (existingLike) {
			// Remove like
			await db
				.delete(userLike)
				.where(and(eq(userLike.userId, locals.user.id), eq(userLike.movieId, movieIdNum)));
		} else {
			// Add like
			await db.insert(userLike).values({
				userId: locals.user.id,
				movieId: movieIdNum
			});
		}

		return { success: true };
	}
};
