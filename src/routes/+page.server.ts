import { redirect, fail } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { movie, userLike } from '$lib/server/db/schema';
import { eq, and, count, isNotNull, sql } from 'drizzle-orm';
import { invalidateSession, deleteSessionTokenCookie } from '$lib/server/auth';
import type { PageServerLoad, Actions } from './$types';

export const load: PageServerLoad = async ({ locals, url }) => {
	if (!locals.user) {
		return redirect(302, '/login');
	}

	// Get search parameters for filtering
	const searchTitle = url.searchParams.get('title') || '';
	const searchYear = url.searchParams.get('year') || '';

	// Fetch all movies with total likes count
	const movies = await db
		.select({
			id: movie.id,
			title: movie.title,
			year: movie.year,
			posterUrl: movie.posterUrl,
			summary: movie.summary,
			imdbId: movie.imdbId,
			genre: movie.genre,
			director: movie.director,
			totalLikes: count(userLike.id)
		})
		.from(movie)
		.leftJoin(userLike, eq(movie.id, userLike.movieId))
		.groupBy(movie.id);

	// Get user's liked movies
	const userLikes = await db
		.select({ movieId: userLike.movieId })
		.from(userLike)
		.where(eq(userLike.userId, locals.user.id));

	const likedMovieIds = new Set(userLikes.map((like) => like.movieId));

	// Get unique directors for the filter dropdown
	const directors = await db
		.selectDistinct({ director: movie.director })
		.from(movie)
		.where(isNotNull(movie.director))
		.orderBy(movie.director);

	return {
		user: locals.user,
		movies: movies.map((movie) => ({
			...movie,
			isLiked: likedMovieIds.has(movie.id)
		})),
		directors: directors.map(d => d.director).filter(Boolean),
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
