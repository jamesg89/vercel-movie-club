import { redirect } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { movie, userLike } from '$lib/server/db/schema';
import { eq, count, desc } from 'drizzle-orm';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	if (!locals.user) {
		return redirect(302, '/login');
	}

	// Get top 20 most liked movies
	const topMovies = await db
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
		.groupBy(movie.id)
		.orderBy(desc(count(userLike.id)))
		.limit(20);

	// Get user's liked movies
	const userLikes = await db
		.select({ movieId: userLike.movieId })
		.from(userLike)
		.where(eq(userLike.userId, locals.user.id));

	const likedMovieIds = new Set(userLikes.map((like) => like.movieId));

	return {
		user: locals.user,
		movies: topMovies.map((movie) => ({
			...movie,
			isLiked: likedMovieIds.has(movie.id)
		}))
	};
};