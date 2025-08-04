import { redirect, fail } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { movieRequest } from '$lib/server/db/schema';
import { eq, desc } from 'drizzle-orm';
import type { PageServerLoad, Actions } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	if (!locals.user) {
		return redirect(302, '/login');
	}

	// Get all movie requests ordered by most recent
	const requests = await db
		.select()
		.from(movieRequest)
		.orderBy(desc(movieRequest.createdAt));

	return {
		user: locals.user,
		requests
	};
};

export const actions: Actions = {
	submit: async ({ request, locals }) => {
		if (!locals.user) {
			return fail(401, { message: 'Unauthorized' });
		}

		const formData = await request.formData();
		const title = formData.get('title');
		const year = formData.get('year');
		const genre = formData.get('genre');
		const reason = formData.get('reason');

		if (!title || typeof title !== 'string' || title.trim().length === 0) {
			return fail(400, { message: 'Movie title is required' });
		}

		if (!reason || typeof reason !== 'string' || reason.trim().length === 0) {
			return fail(400, { message: 'Reason for request is required' });
		}

		try {
			await db.insert(movieRequest).values({
				userId: locals.user.id,
				title: title.trim(),
				year: year && typeof year === 'string' ? parseInt(year) || null : null,
				genre: genre && typeof genre === 'string' ? genre.trim() || null : null,
				reason: reason.trim(),
				status: 'pending'
			});

			return { success: true, message: 'Movie request submitted successfully!' };
		} catch (error) {
			console.error('Error submitting movie request:', error);
			return fail(500, { message: 'Failed to submit movie request' });
		}
	}
};