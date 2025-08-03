import { redirect, fail } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { movie, userLike } from '$lib/server/db/schema';
import { eq, and } from 'drizzle-orm';
import type { PageServerLoad, Actions } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	if (!locals.user) {
		return redirect(302, '/login');
	}

	// Get user's liked movies with movie details
	const likedMovies = await db
		.select({
			id: movie.id,
			title: movie.title,
			year: movie.year,
			summary: movie.summary,
			director: movie.director,
			genre: movie.genre,
			posterUrl: movie.posterUrl,
			imdbId: movie.imdbId,
			likedAt: userLike.createdAt
		})
		.from(userLike)
		.innerJoin(movie, eq(userLike.movieId, movie.id))
		.where(eq(userLike.userId, locals.user.id))
		.orderBy(userLike.createdAt);

	return {
		user: locals.user,
		likedMovies
	};
};

export const actions: Actions = {
	unlike: async ({ request, locals }) => {
		if (!locals.user) {
			return fail(401, { message: 'Unauthorized' });
		}

		const formData = await request.formData();
		const movieId = formData.get('movieId');

		if (!movieId || typeof movieId !== 'string') {
			return fail(400, { message: 'Invalid movie ID' });
		}

		const movieIdNum = parseInt(movieId);

		// Remove like
		await db
			.delete(userLike)
			.where(and(eq(userLike.userId, locals.user.id), eq(userLike.movieId, movieIdNum)));

		return { success: true };
	}
};
